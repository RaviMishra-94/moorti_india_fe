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
  const [uploadingImage, setUploadingImage] = useState(false);
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
  // fg URL mapping: enhanced_url -> fg_url
  const [fgMappings, setFgMappings] = useState<Record<string, string>>({});

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

  // ── Image upload ─────────────────────────────────────────────
  const uploadFile = async (file: File) => {
    setUploadingImage(true);
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

      let imageUrlToAdd = data.url;
      if (data.enhanced_url) {
        imageUrlToAdd = data.enhanced_url;
        setEnhancedMappings(prev => ({ 
          ...prev, 
          [data.enhanced_url]: data.url, 
          [data.url]: data.enhanced_url 
        }));
      }

      if (data.fg_url && data.enhanced_url) {
        setFgMappings(prev => ({ ...prev, [data.enhanced_url]: data.fg_url }));
      }

      setForm(prev => ({ 
        ...prev, 
        image: imageUrlToAdd,
        fg_image: data.fg_url || prev.fg_image
      }));
      showToast('Image uploaded successfully.', 'success');
    } catch (err) {
      showToast(`Image upload failed: ${err instanceof Error ? err.message : 'Unknown error'}`, 'error');
    } finally {
      setUploadingImage(false);
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
            <div
              className={`${styles.uploadZone} ${isDragging ? styles.uploadZoneDragging : ''}`}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              {uploadingImage ? (
                <div className={styles.uploadZoneText} style={{ color: '#d4a05a', fontWeight: 'bold' }}>Uploading & Enhancing Background (takes a few seconds)...</div>
              ) : imagePreviewSrc ? (
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
                </>
              ) : (
                <>
                  <div style={{ fontSize: '2rem', marginBottom: 8 }}>📸</div>
                  <div className={styles.uploadZoneText}>
                    Drag & drop an image here, or <span style={{ color: '#d4a05a' }}>click to browse</span>
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
