'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from '../../../admin.module.css';
import { useToast } from '../../../ToastProvider';

interface CategoryFormData {
  slug: string;
  name: string;
  image: string;
  fg_image: string;
  description: string;
  count: number | '';
}

interface BgOption {
  key: string;
  label: string;
  preview_url: string;
  available: boolean;
}

interface Props {
  initialData?: Partial<CategoryFormData>;
  isNew: boolean;
  token: string;
  apiUrl: string;
  existingSlug?: string;
}

export default function CategoryForm({ initialData, isNew, token, apiUrl, existingSlug }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { showToast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [enhancedMappings, setEnhancedMappings] = useState<Record<string, string>>({});

  const [form, setForm] = useState<CategoryFormData>({
    slug: '', name: '', image: '', fg_image: '', description: '', count: '',
    ...initialData,
  });

  // BG selector state
  const [bgSelectorTarget, setBgSelectorTarget] = useState<{ imgUrl: string; fgUrl: string } | null>(null);
  const [bgOptions, setBgOptions] = useState<BgOption[]>([]);
  const [applyingBg, setApplyingBg] = useState(false);
  const [uploadingCustomBg, setUploadingCustomBg] = useState(false);
  const customBgInputRef = useRef<HTMLInputElement>(null);
  const [customBgOptions, setCustomBgOptions] = useState<{ url: string; label: string; filename: string }[]>([]);
  const [fgMappings, setFgMappings] = useState<Record<string, string>>({});
  // Per-image async job tracking: rawUrl -> jobId
  const [pendingJobs, setPendingJobs] = useState<Record<string, string>>({});
  const pollTimers = useRef<Record<string, ReturnType<typeof setInterval>>>({});

  // Auto-generate slug from name (only for new categories)
  useEffect(() => {
    if (isNew) {
      const slug = form.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
      setForm(prev => ({ ...prev, slug }));
    }
  }, [form.name, isNew]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'count' ? (value === '' ? '' : Number(value)) : value
    }));
  };

  const [aiDisabled, setAiDisabled] = useState(false);

  // ── Cleanup polling timers on unmount & fetch config ──────────────────
  useEffect(() => {
    fetch(`${apiUrl}/api/uploads/config`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => setAiDisabled(data.ai_disabled))
      .catch(() => {});

    const timers = pollTimers.current;
    return () => { Object.values(timers).forEach(clearInterval); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Start polling for a raw-image AI job ────────────────────────────────
  const startPolling = (rawUrl: string, jobId: string) => {
    const timer = setInterval(async () => {
      try {
        const res = await fetch(`${apiUrl}/api/uploads/job/${jobId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const job = await res.json();
        if (job.status === 'done') {
          clearInterval(timer);
          delete pollTimers.current[rawUrl];
          setPendingJobs(prev => { const next = { ...prev }; delete next[rawUrl]; return next; });

          const enhancedUrl = job.enhanced_url as string | null;
          const fgUrl = job.fg_url as string | null;

          if (enhancedUrl) {
            setEnhancedMappings(prev => ({
              ...prev,
              [enhancedUrl]: rawUrl,
              [rawUrl]: enhancedUrl,
            }));
            if (fgUrl) setFgMappings(prev => ({ ...prev, [enhancedUrl]: fgUrl }));
            setForm(prev => ({
              ...prev,
              image: prev.image === rawUrl ? enhancedUrl : prev.image,
              fg_image: prev.image === rawUrl ? (fgUrl || prev.fg_image) : prev.fg_image,
            }));
          }
        }
      } catch {
        // network blip — keep polling
      }
    }, 4000);
    pollTimers.current[rawUrl] = timer;
  };

  // ── Image upload (non-blocking) ──────────────────────────────────────────
  const uploadFile = async (file: File) => {
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch(`${apiUrl}/api/uploads/image`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg);
      }
      const data = await res.json();
      const rawUrl: string = data.url;

      // Show the raw image immediately — no blocking
      setForm(prev => ({ ...prev, image: rawUrl, fg_image: '' }));

      // Gracefully handle if enhanced already present (future-proof)
      if (data.enhanced_url) {
        setEnhancedMappings(prev => ({
          ...prev,
          [data.enhanced_url]: rawUrl,
          [rawUrl]: data.enhanced_url,
        }));
        if (data.fg_url) setFgMappings(prev => ({ ...prev, [data.enhanced_url]: data.fg_url }));
        setForm(prev => ({
          ...prev,
          image: data.enhanced_url,
          fg_image: data.fg_url || prev.fg_image,
        }));
      }

      // Kick off background polling
      if (data.job_id) {
        setPendingJobs(prev => ({ ...prev, [rawUrl]: data.job_id }));
        startPolling(rawUrl, data.job_id);
      }

      showToast('Image uploaded! AI is enhancing it in the background…', 'success');
    } catch (err) {
      showToast(`Image upload failed: ${err instanceof Error ? err.message : 'Unknown error'}`, 'error');
    }
  };


  // ── Background Selector ───────────────────────────────────────
  const openBgSelector = async (imgUrl: string) => {
    const fgUrl = fgMappings[imgUrl] || (form.image === imgUrl ? form.fg_image : '') || '';
    if (!fgUrl) return;
    setBgSelectorTarget({ imgUrl, fgUrl });
    // Fetch AI backgrounds (once)
    if (bgOptions.length === 0) {
      const res = await fetch(`${apiUrl}/api/uploads/backgrounds`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setBgOptions(await res.json());
    }
    // Always refresh custom backgrounds from server (persisted)
    const customRes = await fetch(`${apiUrl}/api/uploads/custom-backgrounds`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (customRes.ok) setCustomBgOptions(await customRes.json());
  };

  const handleCustomBgUpload = async (file: File) => {
    if (!bgSelectorTarget) return;
    setUploadingCustomBg(true);
    try {
      // Step 1: upload bg image
      const fd = new FormData();
      fd.append('file', file);
      const uploadRes = await fetch(`${apiUrl}/api/uploads/upload-bg`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      if (!uploadRes.ok) throw new Error(await uploadRes.text());
      const { bg_url, warning } = await uploadRes.json();
      if (warning) showToast(`⚠️ ${warning}`, 'error');

      // Step 2: composite with current fg
      const applyRes = await fetch(`${apiUrl}/api/uploads/apply-bg`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ fg_url: bgSelectorTarget.fgUrl, bg_url }),
      });
      if (!applyRes.ok) throw new Error(await applyRes.text());
      const data = await applyRes.json();
      const newUrl = data.enhanced_url;
      const oldUrl = bgSelectorTarget.imgUrl;
      setForm(prev => ({
        ...prev,
        image: prev.image === oldUrl ? newUrl : prev.image,
      }));
      setFgMappings(prev => ({ ...prev, [newUrl]: bgSelectorTarget.fgUrl }));
      const originalUrl = enhancedMappings[oldUrl];
      if (originalUrl) setEnhancedMappings(prev => ({ ...prev, [newUrl]: originalUrl }));
      setBgSelectorTarget(prev => prev ? { ...prev, imgUrl: newUrl } : null);
      // Add to custom bg grid
      const label = file.name.replace(/\.[^.]+$/, '') || 'Custom';
      const filename = bg_url.split('/').pop() || '';
      setCustomBgOptions(prev => [...prev.filter(b => b.url !== bg_url), { url: bg_url, label, filename }]);
      showToast('Custom background applied!', 'success');
    } catch (e) {
      showToast(`Custom BG failed: ${e instanceof Error ? e.message : e}`, 'error');
    } finally {
      setUploadingCustomBg(false);
    }
  };

  const applyBg = async (bgKey: string) => {
    if (!bgSelectorTarget) return;
    setApplyingBg(true);
    try {
      const res = await fetch(`${apiUrl}/api/uploads/apply-bg`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ fg_url: bgSelectorTarget.fgUrl, bg_key: bgKey }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      const newUrl = data.enhanced_url;
      const oldUrl = bgSelectorTarget.imgUrl;
      setForm(prev => ({
        ...prev,
        image: prev.image === oldUrl ? newUrl : prev.image,
      }));
      setFgMappings(prev => ({ ...prev, [newUrl]: bgSelectorTarget.fgUrl }));
      const originalUrl = enhancedMappings[oldUrl];
      if (originalUrl) setEnhancedMappings(prev => ({ ...prev, [newUrl]: originalUrl }));
      setBgSelectorTarget(prev => prev ? { ...prev, imgUrl: newUrl } : null);
      showToast('Background applied! Pick another or close the panel.', 'success');
    } catch (e) {
      showToast(`Failed to apply background: ${e instanceof Error ? e.message : e}`, 'error');
    } finally {
      setApplyingBg(false);
    }
  };

  const applyCustomBg = async (bgUrl: string) => {
    if (!bgSelectorTarget || applyingBg || uploadingCustomBg) return;
    setApplyingBg(true);
    try {
      const res = await fetch(`${apiUrl}/api/uploads/apply-bg`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ fg_url: bgSelectorTarget.fgUrl, bg_url: bgUrl }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      const newUrl = data.enhanced_url;
      const oldUrl = bgSelectorTarget.imgUrl;
      setForm(prev => ({
        ...prev,
        image: prev.image === oldUrl ? newUrl : prev.image,
      }));
      setFgMappings(prev => ({ ...prev, [newUrl]: bgSelectorTarget.fgUrl }));
      const originalUrl = enhancedMappings[oldUrl];
      if (originalUrl) setEnhancedMappings(prev => ({ ...prev, [newUrl]: originalUrl }));
      setBgSelectorTarget(prev => prev ? { ...prev, imgUrl: newUrl } : null);
      showToast('Custom background applied! Pick another or close the panel.', 'success');
    } catch (e) {
      showToast(`Custom BG failed: ${e instanceof Error ? e.message : e}`, 'error');
    } finally {
      setApplyingBg(false);
    }
  };

  const deleteCustomBg = async (filename: string) => {
    try {
      const res = await fetch(`${apiUrl}/api/uploads/custom-bg/${filename}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(await res.text());
      setCustomBgOptions(prev => prev.filter(b => b.filename !== filename));
      showToast('Custom background deleted.', 'success');
    } catch (e) {
      showToast(`Delete failed: ${e instanceof Error ? e.message : e}`, 'error');
    }
  };

  const handleFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) uploadFile(file);
  };

  // ── Submit ────────────────────────────────────────────────────
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      try {
        const url = isNew
          ? `${apiUrl}/api/categories`
          : `${apiUrl}/api/categories/${existingSlug}`;
        const method = isNew ? 'POST' : 'PATCH';

        const payload: Record<string, any> = {};
        for (const [k, v] of Object.entries(form)) {
          if (k === 'count' && v === '') payload[k] = 0;
          else if (v !== '' && v !== null) payload[k] = v;
          else if (isNew && v === '') payload[k] = null;
        }

        const res = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const msg = await res.json();
          throw new Error(msg.detail || JSON.stringify(msg));
        }

        showToast(isNew ? 'Category created successfully!' : 'Category updated successfully!', 'success');
        setTimeout(() => router.push('/admin/categories'), 1200);
      } catch (err) {
        showToast(err instanceof Error ? err.message : 'An unexpected error occurred.', 'error');
      }
    });
  };

  const imagePreviewSrc = form.image || null;

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.formCard}>
        <div className={styles.formGrid}>
          {/* ── Core Info ──────────────────────────────────────── */}
          <div className={styles.formSectionTitle}>Category Information</div>

          <div>
            <label className={styles.formLabel} htmlFor="cat-name">Category Name *</label>
            <input id="cat-name" name="name" value={form.name} onChange={handleChange}
              className={styles.formInput} placeholder="e.g. Marble Ganesh Statues" required />
          </div>

          <div>
            <label className={styles.formLabel} htmlFor="cat-slug">URL Slug *</label>
            <input id="cat-slug" name="slug" value={form.slug} onChange={handleChange}
              className={styles.formInput} placeholder="e.g. ganesh" required
              readOnly={!isNew} style={!isNew ? { opacity: 0.5, cursor: 'not-allowed' } : {}} />
          </div>

          <div>
            <label className={styles.formLabel} htmlFor="cat-count">Display Count</label>
            <input id="cat-count" name="count" type="number" min="0" value={form.count} onChange={handleChange}
              className={styles.formInput} placeholder="e.g. 24" required />
          </div>

          <div className={styles.formGridFull}>
            <label className={styles.formLabel} htmlFor="cat-description">Description *</label>
            <textarea id="cat-description" name="description" value={form.description}
              onChange={handleChange} className={styles.formTextarea}
              placeholder="Short description shown on the collections page" required
              style={{ minHeight: 80 }} />
          </div>

          {/* ── Image Upload ──────────────────────────────────── */}
          <div className={`${styles.formGridFull}`}>
            <div className={styles.formSectionTitle} style={{ margin: '0 0 12px' }}>Category Image</div>
            
            {aiDisabled && (
              <div style={{ background: 'rgba(255, 60, 60, 0.1)', border: '1px solid rgba(255, 60, 60, 0.3)', padding: '12px 16px', borderRadius: 8, marginBottom: 16, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <span style={{ fontSize: '1.2rem' }}>⚠️</span>
                <div>
                  <div style={{ color: '#ff6b6b', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: 4 }}>AI Background Enhancement is Disabled</div>
                  <div style={{ color: '#ccc', fontSize: '0.8rem', lineHeight: 1.4 }}>
                    To change backgrounds on this server, you must upload a <strong>pre-processed transparent PNG</strong>. Uploading standard JPGs will not automatically remove the background.
                  </div>
                </div>
              </div>
            )}

            <div
              className={`${styles.uploadZone} ${isDragging ? styles.uploadZoneDragging : ''}`}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              {imagePreviewSrc ? (
                <>
                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    <Image src={imagePreviewSrc} alt="Preview" width={200} height={200}
                      className={styles.uploadPreview} style={{ objectFit: 'contain' }} />
                    <div style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6 }}>
                      {enhancedMappings[imagePreviewSrc] && (
                        <button type="button" onClick={(e) => {
                          e.stopPropagation();
                          const pairedUrl = enhancedMappings[imagePreviewSrc];
                          setForm(prev => ({ ...prev, image: pairedUrl }));
                        }}
                          style={{ background: 'rgba(0,0,0,0.8)', color: '#fff', border: '1px solid #d4a05a', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', fontSize: '0.7rem', whiteSpace: 'nowrap' }}>
                          ✨ Toggle BG
                        </button>
                      )}
                      {(fgMappings[imagePreviewSrc] || form.fg_image) && (
                        <button type="button" onClick={(e) => { e.stopPropagation(); openBgSelector(imagePreviewSrc); }}
                          style={{ background: 'rgba(212, 160, 90, 0.95)', color: '#111', border: 'none', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
                          🎨 Change BG
                        </button>
                      )}
                    </div>
                  </div>
                  <div className={styles.uploadZoneText} style={{ marginTop: 8 }}>Click or drag to replace</div>
                  {Object.keys(pendingJobs).length > 0 && (
                    <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.72rem', color: '#d4a05a' }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', border: '2px solid rgba(212,160,90,0.3)', borderTopColor: '#d4a05a', animation: 'spin 0.9s linear infinite', flexShrink: 0 }} />
                      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                      🤖 AI is enhancing your image in the background…
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div style={{ fontSize: '2rem', marginBottom: 8 }}>📸</div>
                  <div className={styles.uploadZoneText}>
                    Drag &amp; drop an image here, or <span style={{ color: '#d4a05a' }}>click to browse</span>
                  </div>
                  <div className={styles.uploadZoneText} style={{ marginTop: 4, fontSize: '0.72rem' }}>
                    JPEG, PNG, WebP, HEIC — max 10 MB
                  </div>
                </>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*,.heic,.heif" style={{ display: 'none' }}
              onChange={handleFilePick} id="cat-image-file" />

            <div style={{ marginTop: 10 }}>
              <label className={styles.formLabel} htmlFor="cat-image-url">Or paste an image URL</label>
              <input id="cat-image-url" name="image" value={form.image} onChange={handleChange}
                className={styles.formInput} placeholder="/uploads/hero_ganesh.png" required />
            </div>
          </div>

          {/* ── Actions ───────────────────────────────────────── */}
          <div className={styles.formActions}>
            <button type="button" className={styles.btnSecondary}
              onClick={() => router.push('/admin/categories')}>
              Cancel
            </button>
            <button type="submit" className={styles.btnPrimary} id="cat-save-btn" disabled={isPending}>
              {isPending ? 'Saving…' : isNew ? '✓ Create Category' : '✓ Save Changes'}
            </button>
          </div>
        </div>
      </div>

      {/* ── Background Selector Panel ───────────────────────────── */}
      {bgSelectorTarget && (
        <div className={styles.bgSelectorOverlay} onClick={() => setBgSelectorTarget(null)}>
          <div className={styles.bgSelectorPanel} onClick={e => e.stopPropagation()}>
            <div className={styles.bgSelectorHeader}>
              <h3 className={styles.bgSelectorTitle}>Choose Background</h3>
              <button type="button" className={styles.bgSelectorClose} onClick={() => setBgSelectorTarget(null)}>✕</button>
            </div>
            
            <div className={styles.bgSelectorContent}>
              <div className={styles.bgSelectorLayout}>
                {/* Preview */}
                <div className={styles.bgSelectorPreviewCol}>
                  <div className={styles.bgSelectorPreviewLabel}>Current Result</div>
                  <div className={styles.bgSelectorPreviewWrap}>
                    {applyingBg && <div className={styles.bgSelectorLoading}>Applying...</div>}
                    <Image src={bgSelectorTarget.imgUrl} alt="Preview" width={400} height={400} style={{ objectFit: 'contain', width: '100%', height: 'auto' }} unoptimized />
                  </div>
                </div>

                {/* Options */}
                <div className={styles.bgSelectorOptionsCol}>
                  <div className={styles.bgSelectorTabs}>
                    <div className={styles.bgSelectorTabActive}>Presets</div>
                  </div>

                  <div className={styles.bgOptionsGrid}>
                    {bgOptions.map(opt => (
                      <button
                        key={opt.key}
                        type="button"
                        className={styles.bgOptionCard}
                        onClick={() => applyBg(opt.key)}
                        disabled={applyingBg || uploadingCustomBg}
                      >
                        <div className={styles.bgOptionThumb}>
                          <Image src={opt.preview_url} alt={opt.label} width={80} height={80} />
                        </div>
                        <div className={styles.bgOptionLabel}>{opt.label}</div>
                      </button>
                    ))}
                  </div>

                  <div className={styles.bgSelectorSeparator}>OR</div>

                  <div className={styles.bgSelectorPreviewLabel}>Your Custom Backgrounds</div>
                  <div className={styles.bgOptionsGrid}>
                    <button
                      type="button"
                      className={styles.bgOptionCard}
                      onClick={() => customBgInputRef.current?.click()}
                      disabled={applyingBg || uploadingCustomBg}
                    >
                      <div className={styles.bgOptionThumb} style={{ background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                        {uploadingCustomBg ? '⌛' : '+'}
                      </div>
                      <div className={styles.bgOptionLabel}>{uploadingCustomBg ? 'Uploading...' : 'Upload New'}</div>
                    </button>
                    <input
                      ref={customBgInputRef}
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) handleCustomBgUpload(file);
                      }}
                    />

                    {customBgOptions.map(opt => (
                      <div key={opt.url} className={styles.bgOptionCardWrap}>
                        <button
                          type="button"
                          className={styles.bgOptionCard}
                          onClick={() => applyCustomBg(opt.url)}
                          disabled={applyingBg || uploadingCustomBg}
                        >
                          <div className={styles.bgOptionThumb}>
                            <Image src={opt.url} alt={opt.label} width={80} height={80} />
                          </div>
                          <div className={styles.bgOptionLabel}>{opt.label}</div>
                        </button>
                        <button
                          type="button"
                          className={styles.bgOptionDelete}
                          onClick={(e) => { e.stopPropagation(); deleteCustomBg(opt.filename); }}
                          title="Delete background"
                        >✕</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
