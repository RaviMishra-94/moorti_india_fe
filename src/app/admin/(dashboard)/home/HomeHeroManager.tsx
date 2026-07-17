'use client';

import { useState, useRef } from 'react';
import { updateSiteSettings, apiUpload } from '@/lib/api';
import type { SiteSettings } from '@/lib/types';
import { useToast } from '../../ToastProvider';
import styles from '../../admin.module.css';

interface HeroForm {
  hero_image_url: string;
  hero_image_mobile_url: string;
  hero_title_line1: string;
  hero_title_line2: string;
  hero_tagline: string;
  hero_description: string;
}

// Resolve a stored image path to something the admin browser can display.
// `/uploads/...` lives on the backend; `/images/...` defaults live in the
// frontend public folder (same origin as the admin), absolute URLs as-is.
function resolvePreview(url: string, apiUrl: string): string {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  if (url.startsWith('/uploads/')) return `${apiUrl}${url}`;
  return url;
}

export default function HomeHeroManager({
  initialSettings,
  token,
  apiUrl,
}: {
  initialSettings: SiteSettings | null;
  token: string;
  apiUrl: string;
}) {
  const { showToast } = useToast();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<'desktop' | 'mobile' | null>(null);
  const [dragging, setDragging] = useState<'desktop' | 'mobile' | null>(null);
  const desktopInputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<HeroForm>({
    hero_image_url: initialSettings?.heroImageUrl || '',
    hero_image_mobile_url: initialSettings?.heroImageMobileUrl || '',
    hero_title_line1: initialSettings?.heroTitleLine1 || '',
    hero_title_line2: initialSettings?.heroTitleLine2 || '',
    hero_tagline: initialSettings?.heroTagline || '',
    hero_description: initialSettings?.heroDescription || '',
  });

  const setField = (name: keyof HeroForm, value: string) =>
    setForm((prev) => ({ ...prev, [name]: value }));

  const uploadFile = async (file: File, target: 'desktop' | 'mobile') => {
    if (!token) {
      showToast('No admin token found', 'error');
      return;
    }
    setUploading(target);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const data = await apiUpload(`${apiUrl}/api/uploads/hero`, fd, token);
      setField(target === 'desktop' ? 'hero_image_url' : 'hero_image_mobile_url', data.url);
      showToast('Image uploaded successfully', 'success');
    } catch (err) {
      console.error(err);
      showToast(err instanceof Error ? err.message : 'Image upload failed', 'error');
    } finally {
      setUploading(null);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSiteSettings(form, token);
      showToast('Home hero updated successfully', 'success');
    } catch (err) {
      console.error(err);
      showToast(err instanceof Error ? err.message : 'Failed to save', 'error');
    } finally {
      setSaving(false);
    }
  };

  const renderUploader = (target: 'desktop' | 'mobile') => {
    const field: keyof HeroForm = target === 'desktop' ? 'hero_image_url' : 'hero_image_mobile_url';
    const value = form[field];
    const inputRef = target === 'desktop' ? desktopInputRef : mobileInputRef;
    const isUploading = uploading === target;

    return (
      <div>
        <label className={styles.formLabel}>
          {target === 'desktop' ? 'Desktop Background *' : 'Mobile Background'}
          {target === 'mobile' && (
            <span style={{ color: '#888', fontWeight: 400 }}> — optional, falls back to desktop</span>
          )}
        </label>
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          {value && (
            <div style={{ position: 'relative', width: 160, height: 100, borderRadius: 8, overflow: 'hidden', border: '1px solid #333', flexShrink: 0 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={resolvePreview(value, apiUrl)} alt="Hero preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button
                type="button"
                onClick={() => setField(field, '')}
                style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.75)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '50%', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#ff6b6b', fontSize: '11px' }}
                title="Remove image"
              >🗑</button>
            </div>
          )}
          <div
            className={`${styles.uploadZone} ${dragging === target ? styles.uploadZoneDragging : ''}`}
            style={{ flex: 1, padding: '18px 14px', minHeight: 90 }}
            onDragOver={(e) => { e.preventDefault(); setDragging(target); }}
            onDragLeave={() => setDragging(null)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(null);
              const file = e.dataTransfer.files?.[0];
              if (file) uploadFile(file, target);
            }}
            onClick={() => inputRef.current?.click()}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              style={{ display: 'none' }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) uploadFile(file, target);
                e.target.value = '';
              }}
              disabled={isUploading}
            />
            {isUploading ? (
              <div style={{ color: '#d4a05a', fontSize: '0.82rem' }}>⏳ Uploading…</div>
            ) : (
              <div className={styles.uploadZoneText}>
                📷 Drag &amp; drop or <span style={{ color: '#d4a05a', textDecoration: 'underline' }}>click to browse</span>
                <div style={{ fontSize: '0.72rem', marginTop: 4, color: '#555' }}>JPEG, PNG, WebP — max 20 MB</div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h1 className={styles.sectionTitle}>Home Hero</h1>
        <p style={{ fontSize: '0.85rem', color: '#888', marginTop: 4 }}>
          Control the background image and headline text of the homepage hero section.
        </p>
      </div>

      <div className={styles.formCard}>
        <div className={styles.formGrid}>
          <div className={styles.formSectionTitle}>Background Image</div>

          <div className={styles.formGridFull}>{renderUploader('desktop')}</div>
          <div className={styles.formGridFull} style={{ marginTop: 8 }}>{renderUploader('mobile')}</div>

          <div className={styles.formSectionTitle} style={{ marginTop: 12 }}>Headline Text</div>

          <div>
            <label className={styles.formLabel}>Title — Line 1</label>
            <input
              type="text"
              className={styles.formInput}
              value={form.hero_title_line1}
              onChange={(e) => setField('hero_title_line1', e.target.value)}
              placeholder="Bring Home Timeless"
            />
          </div>
          <div>
            <label className={styles.formLabel}>Title — Line 2</label>
            <input
              type="text"
              className={styles.formInput}
              value={form.hero_title_line2}
              onChange={(e) => setField('hero_title_line2', e.target.value)}
              placeholder="Divine Craftsmanship"
            />
          </div>

          <div className={styles.formGridFull}>
            <label className={styles.formLabel}>Tagline</label>
            <input
              type="text"
              className={styles.formInput}
              value={form.hero_tagline}
              onChange={(e) => setField('hero_tagline', e.target.value)}
              placeholder="Marble Idols That Elevate Your Space & Spirit"
            />
          </div>

          <div className={styles.formGridFull}>
            <label className={styles.formLabel}>Description</label>
            <textarea
              className={styles.formTextarea}
              rows={3}
              value={form.hero_description}
              onChange={(e) => setField('hero_description', e.target.value)}
              placeholder="Handcrafted from premium marble by skilled artisans. Designed for homes and sacred spaces."
            />
          </div>
        </div>

        <div className={styles.formActions}>
          <button
            type="button"
            className={styles.btnPrimary}
            onClick={handleSave}
            disabled={saving || uploading !== null}
          >
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
