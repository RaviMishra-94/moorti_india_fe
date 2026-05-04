'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from '../../../admin.module.css';
import { useToast } from '../../../ToastProvider';

interface ProductFormData {
  slug: string;
  name: string;
  category: string;
  category_slug: string;
  image: string;
  images: string[];
  god_name: string;
  height: string;
  base_width_depth: string;
  weight: string;
  material: string;
  painting: string;
  shipping_info: string;
  product_care: string;
  why_choose_us: string;
  description: string;
  short_desc: string;
  use_default_tab_content: boolean;
  use_default_testimonial: boolean;
  testimonial_stars: number;
  testimonial_text: string;
  testimonial_author: string;
  tag: string;
  is_featured: boolean;
  is_trending: boolean;
  use_default_seo: boolean;
  meta_title: string;
  meta_description: string;
  image_alt_text: string;
}

interface Props {
  initialData?: Partial<ProductFormData>;
  isNew: boolean;
  token: string;
  apiUrl: string;
  existingSlug?: string;
  categories: { slug: string; name: string }[];
  clientStories?: any[];
}

export default function ProductForm({ initialData, isNew, token, apiUrl, existingSlug, categories, clientStories = [] }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { showToast } = useToast();
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggingMulti, setIsDraggingMulti] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const multiFileInputRef = useRef<HTMLInputElement>(null);
  const [enhancedMappings, setEnhancedMappings] = useState<Record<string, string>>({});

  const [availableTags, setAvailableTags] = useState<string[]>([
    'Bestseller', 'New Arrival', 'Temple Grade', 'Premium', 'Limited Edition', 'Customizable'
  ]);
  const [newTagInput, setNewTagInput] = useState('');

  useEffect(() => {
    if (initialData?.tag && !availableTags.includes(initialData.tag)) {
      setAvailableTags(prev => [...prev, initialData.tag as string]);
    }
  }, [initialData?.tag, availableTags]);

  const defaultForm: ProductFormData = {
    slug: '', name: '', category: '', category_slug: '', image: '', images: [],
    god_name: '', height: '', base_width_depth: '', weight: '',
    material: '', painting: '', shipping_info: '', product_care: '',
    why_choose_us: '', description: '', short_desc: '', tag: '',
    use_default_tab_content: true,
    use_default_testimonial: true, testimonial_stars: 5, testimonial_text: '', testimonial_author: '',
    is_featured: false, is_trending: false,
    use_default_seo: true, meta_title: '', meta_description: '', image_alt_text: '',
  };

  const safeInitialData = initialData
    ? Object.fromEntries(Object.entries(initialData).map(([k, v]) => {
        if (v === null) {
          if (k === 'use_default_testimonial') return [k, true];
          if (k === 'use_default_seo') return [k, true];
          if (k === 'testimonial_stars') return [k, 5];
          if (k === 'images') return [k, []];
          if (k.startsWith('is_')) return [k, false];
          return [k, ''];
        }
        return [k, v];
      }))
    : {};

  // Infer use_default_tab_content based on whether they have custom text
  if (initialData) {
    if (safeInitialData.shipping_info || safeInitialData.product_care || safeInitialData.why_choose_us) {
      safeInitialData.use_default_tab_content = false;
    } else {
      safeInitialData.use_default_tab_content = true;
    }
  }

  const [form, setForm] = useState<ProductFormData>({
    ...defaultForm,
    ...safeInitialData,
  });

  // Auto-generate slug from name (only for new products)
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

  // Sync category name when slug changes
  const handleCategorySlugChange = (slug: string) => {
    const found = categories.find(c => c.slug === slug);
    setForm(prev => ({
      ...prev,
      category_slug: slug,
      category: found ? found.name : '',
    }));
  };

  const handleAddTag = () => {
    const tag = newTagInput.trim();
    if (tag) {
      if (!availableTags.includes(tag)) {
        setAvailableTags(prev => [...prev, tag]);
      }
      setForm(prev => ({ ...prev, tag }));
      setNewTagInput('');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setForm(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
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
      
      setForm(prev => {
        if (!prev.image) {
          return { ...prev, image: imageUrlToAdd };
        } else {
          return { ...prev, images: [...(prev.images || []), imageUrlToAdd] };
        }
      });
      showToast('Image uploaded successfully.', 'success');
    } catch (err) {
      showToast(`Image upload failed: ${err instanceof Error ? err.message : 'Unknown error'}`, 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach(file => uploadFile(file));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingMulti(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) uploadFile(file);
      });
    }
  };

  const setAsMainImage = (url: string) => {
    setForm(prev => {
      const currentMain = prev.image;
      const newImages = (prev.images || []).filter(img => img !== url);
      if (currentMain) {
        newImages.push(currentMain);
      }
      return { ...prev, image: url, images: newImages };
    });
  };

  const removeImage = (url: string) => {
    setForm(prev => {
      if (prev.image === url) {
        const newImages = [...(prev.images || [])];
        const newMain = newImages.shift() || '';
        return { ...prev, image: newMain, images: newImages };
      } else {
        return { ...prev, images: (prev.images || []).filter(img => img !== url) };
      }
    });
  };

  // ── Submit ────────────────────────────────────────────────────
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      try {
        const url = isNew
          ? `${apiUrl}/api/products`
          : `${apiUrl}/api/products/${existingSlug}`;
        const method = isNew ? 'POST' : 'PATCH';

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const payload: Record<string, any> = {};
        for (const [k, v] of Object.entries(form)) {
          if (k === 'use_default_tab_content') continue; // Frontend only flag
          if (v === '') {
            payload[k] = null;
          } else if (v !== null) {
            payload[k] = k === 'testimonial_stars' ? Number(v) : v;
          }
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

        // Revalidate the Next.js cache so the frontend updates immediately
        const { revalidateProduct } = await import('../actions');
        await revalidateProduct(form.slug);

        showToast(isNew ? 'Product created successfully!' : 'Product updated successfully!', 'success');
        setTimeout(() => router.push('/admin/products'), 1200);
      } catch (err) {
        showToast(err instanceof Error ? err.message : 'An unexpected error occurred.', 'error');
      }
    });
  };

  const fallbackTestimonial = { name: 'Moorti India Customer', text: 'Beautiful craftsmanship and fast delivery.', statue: 'Marble Statue' };
  const defaultTestimonial = form.category && clientStories.length > 0
    ? (clientStories.find(t => t.statue && t.statue.toLowerCase().includes(form.category.toLowerCase().split(' ')[0])) || clientStories[0]) 
    : (clientStories.length > 0 ? clientStories[0] : fallbackTestimonial);

  const imagePreviewSrc = form.image || null;

  return (
    <form onSubmit={handleSubmit}>

      <div className={styles.formCard}>
        <div className={styles.formGrid}>
          {/* ── Core Info ──────────────────────────────────────── */}
          <div className={styles.formSectionTitle}>Core Information</div>

          <div>
            <label className={styles.formLabel} htmlFor="prod-name">Product Name *</label>
            <input id="prod-name" name="name" value={form.name} onChange={handleChange}
              className={styles.formInput} placeholder="e.g. Radha Krishna — Classic Pose" required />
          </div>

          <div>
            <label className={styles.formLabel} htmlFor="prod-slug">URL Slug *</label>
            <input id="prod-slug" name="slug" value={form.slug} onChange={handleChange}
              className={styles.formInput} placeholder="e.g. radha-krishna-classic" required
              readOnly={!isNew} style={!isNew ? { opacity: 0.5, cursor: 'not-allowed' } : {}} />
          </div>

          <div>
            <label className={styles.formLabel} htmlFor="prod-category-slug">Category *</label>
            <select id="prod-category-slug" name="category_slug" value={form.category_slug}
              onChange={(e) => handleCategorySlugChange(e.target.value)}
              className={styles.formSelect} required>
              <option value="">Select a category…</option>
              {categories.map(c => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={styles.formLabel} htmlFor="prod-material">Material *</label>
            <input id="prod-material" name="material" value={form.material} onChange={handleChange}
              className={styles.formInput} placeholder="e.g. Makrana White Marble" required />
          </div>

          <div>
            <label className={styles.formLabel} htmlFor="prod-short-desc">Short Description *</label>
            <input id="prod-short-desc" name="short_desc" value={form.short_desc} onChange={handleChange}
              className={styles.formInput} placeholder="One-line summary shown on cards" required />
          </div>

          <div>
            <label className={styles.formLabel} htmlFor="prod-tag">Badge / Tag</label>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <select
                id="prod-tag"
                name="tag"
                value={form.tag}
                onChange={handleChange}
                className={styles.formSelect}
                style={{ flex: 1 }}
              >
                <option value="">No Badge / Tag</option>
                {availableTags.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="New tag…"
                value={newTagInput}
                onChange={e => setNewTagInput(e.target.value)}
                className={styles.formInput}
                style={{ width: 140 }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddTag}
                className={styles.btnSecondary}
                style={{ padding: '8px 12px' }}
                title="Add new tag"
              >
                +
              </button>
            </div>
          </div>

          <div className={styles.formGridFull}>
            <label className={styles.formLabel} htmlFor="prod-description">Full Description *</label>
            <textarea id="prod-description" name="description" value={form.description}
              onChange={handleChange} className={styles.formTextarea}
              placeholder="Detailed product description shown in the Product Details tab" required
              style={{ minHeight: 110 }} />
          </div>

          {/* ── Product Images ──────────────────────────────────── */}
          <div className={`${styles.formGridFull}`}>
            <div className={styles.formSectionTitle} style={{ margin: '0 0 12px' }}>Product Images</div>
            
            {(() => {
              const allImages = [form.image, ...(form.images || [])].filter(Boolean);
              if (allImages.length === 0) return null;
              return (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 12, marginBottom: 20 }}>
                  {allImages.map((imgUrl, idx) => {
                    const isMain = imgUrl === form.image;
                    return (
                      <div key={idx} style={{ position: 'relative', border: isMain ? '2px solid #d4a05a' : '1px solid #333', borderRadius: 8, overflow: 'hidden', aspectRatio: '1' }}>
                        <Image src={imgUrl.startsWith('/') || imgUrl.startsWith('http') ? imgUrl : `/images/${imgUrl}`} alt={`Gallery ${idx}`} fill style={{ objectFit: 'cover' }} />
                        
                        {/* Remove Button */}
                        <button type="button" onClick={() => removeImage(imgUrl)}
                          style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(0,0,0,0.7)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '12px' }}>
                          ✕
                        </button>

                        {/* AI Background Toggle Button */}
                        {enhancedMappings[imgUrl] && (
                          <button type="button" onClick={() => {
                            const pairedUrl = enhancedMappings[imgUrl];
                            setForm(prev => {
                              const newImage = prev.image === imgUrl ? pairedUrl : prev.image;
                              const newImages = (prev.images || []).map(img => img === imgUrl ? pairedUrl : img);
                              return { ...prev, image: newImage, images: newImages };
                            });
                          }}
                            style={{ position: 'absolute', bottom: 35, left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.8)', color: '#fff', border: '1px solid #d4a05a', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', fontSize: '0.7rem', whiteSpace: 'nowrap' }}>
                            ✨ Toggle BG
                          </button>
                        )}

                        {/* Set Main Button */}
                        {!isMain && (
                          <button type="button" onClick={() => setAsMainImage(imgUrl)}
                            style={{ position: 'absolute', bottom: 6, left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.8)', color: '#d4a05a', border: '1px solid #d4a05a', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', fontSize: '0.7rem', whiteSpace: 'nowrap', fontWeight: 'bold' }}>
                            Set as Main
                          </button>
                        )}
                        {isMain && (
                          <div style={{ position: 'absolute', bottom: 6, left: '50%', transform: 'translateX(-50%)', background: '#d4a05a', color: '#000', borderRadius: '4px', padding: '4px 8px', fontSize: '0.7rem', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                            Main Photo
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })()}

            <div
              className={`${styles.uploadZone} ${isDraggingMulti ? styles.uploadZoneDragging : ''}`}
              onDragOver={(e) => { e.preventDefault(); setIsDraggingMulti(true); }}
              onDragLeave={() => setIsDraggingMulti(false)}
              onDrop={handleDrop}
              onClick={() => multiFileInputRef.current?.click()}
              style={{ padding: '28px', minHeight: 'auto' }}
            >
              <div style={{ fontSize: '2rem', marginBottom: 8 }}>📸</div>
              <div className={styles.uploadZoneText} style={{ fontSize: '0.9rem' }}>
                Drag & drop images here, or <span style={{ color: '#d4a05a', fontWeight: 'bold' }}>click to browse</span>
              </div>
              <div className={styles.uploadZoneText} style={{ marginTop: 6, fontSize: '0.75rem', color: '#666' }}>
                JPEG, PNG, WebP, HEIC — max 10 MB per image
              </div>
              {uploadingImage && <div style={{ marginTop: 12, color: '#d4a05a', fontSize: '0.85rem', fontWeight: 'bold' }}>Uploading & Enhancing Background (takes a few seconds)...</div>}
            </div>
            <input ref={multiFileInputRef} type="file" accept="image/*,.heic,.heif" multiple style={{ display: 'none' }}
              onChange={handleFilePick} id="prod-images-file" />

            <div style={{ marginTop: 16 }}>
              <label className={styles.formLabel} htmlFor="prod-image-url">Or paste an image URL (Press Enter to add)</label>
              <input id="prod-image-url" type="text"
                className={styles.formInput} placeholder="/images/my-product.png or https://…" 
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const val = e.currentTarget.value.trim();
                    if (val) {
                       setForm(prev => {
                         if (!prev.image) return { ...prev, image: val };
                         return { ...prev, images: [...(prev.images || []), val] };
                       });
                       e.currentTarget.value = '';
                    }
                  }
                }}
              />
            </div>
          </div>

          {/* ── Idol Details ──────────────────────────────────── */}
          <div className={styles.formSectionTitle}>Idol Details</div>

          <div>
            <label className={styles.formLabel} htmlFor="prod-god-name">God Name</label>
            <input id="prod-god-name" name="god_name" value={form.god_name} onChange={handleChange}
              className={styles.formInput} placeholder="e.g. Ganesh, Radha Krishna" />
          </div>

          <div>
            <label className={styles.formLabel} htmlFor="prod-height">Height</label>
            <input id="prod-height" name="height" value={form.height} onChange={handleChange}
              className={styles.formInput} placeholder="e.g. 24 inches" />
          </div>

          <div>
            <label className={styles.formLabel} htmlFor="prod-base">Base Width × Depth</label>
            <input id="prod-base" name="base_width_depth" value={form.base_width_depth} onChange={handleChange}
              className={styles.formInput} placeholder="e.g. 12 x 8 inches" />
          </div>

          <div>
            <label className={styles.formLabel} htmlFor="prod-weight">Weight</label>
            <input id="prod-weight" name="weight" value={form.weight} onChange={handleChange}
              className={styles.formInput} placeholder="e.g. 35 kg" />
          </div>

          <div>
            <label className={styles.formLabel} htmlFor="prod-painting">Painting / Finish</label>
            <input id="prod-painting" name="painting" value={form.painting} onChange={handleChange}
              className={styles.formInput} placeholder="e.g. Subtle Gold Highlights" />
          </div>

          {/* ── Tab Content ───────────────────────────────────── */}
          <div className={styles.formSectionTitle}>Tab Content</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input type="checkbox" id="prod-use-default-tabs" name="use_default_tab_content"
                checked={!!form.use_default_tab_content} onChange={(e) => {
                  const checked = e.target.checked;
                  setForm(prev => ({
                    ...prev,
                    use_default_tab_content: checked,
                    ...(checked ? { shipping_info: '', product_care: '', why_choose_us: '' } : {})
                  }));
                }}
                style={{ width: 16, height: 16, accentColor: '#d4a05a' }} />
              <label htmlFor="prod-use-default-tabs" className={styles.formLabel} style={{ margin: 0, textTransform: 'none', fontSize: '0.88rem', color: '#ccc' }}>
                Use default tab content (Shipping, Product Care, Why Moorti India)
              </label>
            </div>

            {form.use_default_tab_content && (
              <div style={{ background: '#1a1511', padding: '12px 16px', borderRadius: 6, border: '1px solid #332a21', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1.2rem', color: '#d4a05a', lineHeight: 1 }}>ⓘ</span>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#999', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Default Previews</div>
                  <div style={{ marginBottom: 8 }}>
                    <div style={{ fontSize: '0.75rem', color: '#d4a05a', fontWeight: 'bold', marginBottom: 2 }}>PRODUCT CARE</div>
                    <div style={{ fontSize: '0.85rem', color: '#ddd', fontStyle: 'italic' }}>"General marble care instructions apply."</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#d4a05a', fontWeight: 'bold', marginBottom: 2 }}>WHY MOORTI INDIA</div>
                    <div style={{ fontSize: '0.85rem', color: '#ddd', fontStyle: 'italic' }}>"We are one of the leading Premium Handcrafted Marble Sculptures manufacturers in Jaipur, India."</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {!form.use_default_tab_content && (
            <>
              <div className={styles.formGridFull}>
                <label className={styles.formLabel} htmlFor="prod-shipping">Shipping Info</label>
                <textarea id="prod-shipping" name="shipping_info" value={form.shipping_info}
                  onChange={handleChange} className={styles.formTextarea}
                  placeholder="Custom shipping and delivery information" />
              </div>

              <div className={styles.formGridFull}>
                <label className={styles.formLabel} htmlFor="prod-care">Product Care</label>
                <textarea id="prod-care" name="product_care" value={form.product_care}
                  onChange={handleChange} className={styles.formTextarea}
                  placeholder="Custom instructions for cleaning and maintaining the marble" />
              </div>

              <div className={styles.formGridFull}>
                <label className={styles.formLabel} htmlFor="prod-why">Why Moorti India</label>
                <textarea id="prod-why" name="why_choose_us" value={form.why_choose_us}
                  onChange={handleChange} className={styles.formTextarea}
                  placeholder="Custom reasons why customers should choose Moorti India" />
              </div>
            </>
          )}

          {/* ── Testimonial / Review ────────────────────────────── */}
          <div className={styles.formSectionTitle}>Testimonial / Review</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input type="checkbox" id="prod-use-default-testimonial" name="use_default_testimonial"
                checked={!!form.use_default_testimonial} onChange={handleChange}
                style={{ width: 16, height: 16, accentColor: '#d4a05a' }} />
              <label htmlFor="prod-use-default-testimonial" className={styles.formLabel} style={{ margin: 0, textTransform: 'none', fontSize: '0.88rem', color: '#ccc' }}>
                Use default category testimonial (If unchecked and left empty, no testimonial will be shown)
              </label>
            </div>

            {form.use_default_testimonial && (
              <div style={{ background: '#1a1511', padding: '12px 16px', borderRadius: 6, border: '1px solid #332a21', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1.2rem', color: '#d4a05a', lineHeight: 1 }}>ⓘ</span>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#999', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Default Preview</div>
                  <div style={{ fontSize: '0.9rem', color: '#ddd', fontStyle: 'italic', marginBottom: 4 }}>"{defaultTestimonial.text}"</div>
                  <div style={{ fontSize: '0.8rem', color: '#aaa', fontWeight: 500 }}>— {defaultTestimonial.name}, {defaultTestimonial.location}</div>
                </div>
              </div>
            )}
          </div>

          {!form.use_default_testimonial && (
            <>
              <div className={styles.formGridFull}>
                <label className={styles.formLabel} htmlFor="prod-testimonial-stars">Rating (Stars)</label>
                <select id="prod-testimonial-stars" name="testimonial_stars" value={form.testimonial_stars}
                  onChange={handleChange} className={styles.formSelect} style={{ width: '150px' }}>
                  <option value={5}>★★★★★ (5)</option>
                  <option value={4}>★★★★☆ (4)</option>
                  <option value={3}>★★★☆☆ (3)</option>
                  <option value={2}>★★☆☆☆ (2)</option>
                  <option value={1}>★☆☆☆☆ (1)</option>
                </select>
              </div>

              <div className={styles.formGridFull}>
                <label className={styles.formLabel} htmlFor="prod-testimonial-text">Review Text (Optional)</label>
                <textarea id="prod-testimonial-text" name="testimonial_text" value={form.testimonial_text}
                  onChange={handleChange} className={styles.formTextarea}
                  placeholder="Custom review text for this specific product." />
              </div>

              <div className={styles.formGridFull}>
                <label className={styles.formLabel} htmlFor="prod-testimonial-author">Review Author & Location (Optional)</label>
                <input id="prod-testimonial-author" name="testimonial_author" value={form.testimonial_author}
                  onChange={handleChange} className={styles.formInput}
                  placeholder="e.g. — Priya Sharma, Sydney" />
              </div>
            </>
          )}

          {/* ── Metadata Flags ────────────────────────────────── */}
          <div className={styles.formSectionTitle}>Metadata</div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <input type="checkbox" id="prod-featured" name="is_featured"
              checked={form.is_featured} onChange={handleChange}
              style={{ width: 16, height: 16, accentColor: '#d4a05a' }} />
            <label htmlFor="prod-featured" className={styles.formLabel} style={{ margin: 0, textTransform: 'none', fontSize: '0.88rem', color: '#ccc' }}>
              Show on Homepage (Featured)
            </label>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <input type="checkbox" id="prod-trending" name="is_trending"
              checked={form.is_trending} onChange={handleChange}
              style={{ width: 16, height: 16, accentColor: '#d4a05a' }} />
            <label htmlFor="prod-trending" className={styles.formLabel} style={{ margin: 0, textTransform: 'none', fontSize: '0.88rem', color: '#ccc' }}>
              Mark as Trending
            </label>
          </div>

          {/* ── SEO Metadata ────────────────────────────────────── */}
          <div className={styles.formSectionTitle}>SEO Settings</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input type="checkbox" id="prod-use-default-seo" name="use_default_seo"
                checked={!!form.use_default_seo} onChange={(e) => {
                  const checked = e.target.checked;
                  setForm(prev => ({
                    ...prev,
                    use_default_seo: checked,
                    ...(checked ? { meta_title: '', meta_description: '', image_alt_text: '' } : {})
                  }));
                }}
                style={{ width: 16, height: 16, accentColor: '#d4a05a' }} />
              <label htmlFor="prod-use-default-seo" className={styles.formLabel} style={{ margin: 0, textTransform: 'none', fontSize: '0.88rem', color: '#ccc' }}>
                Use default SEO values (Auto-generated from name and description)
              </label>
            </div>

            {form.use_default_seo && (
              <div style={{ background: '#1a1511', padding: '12px 16px', borderRadius: 6, border: '1px solid #332a21', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1.2rem', color: '#d4a05a', lineHeight: 1 }}>ⓘ</span>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#999', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Default Previews</div>
                  <div style={{ marginBottom: 8 }}>
                    <div style={{ fontSize: '0.75rem', color: '#d4a05a', fontWeight: 'bold', marginBottom: 2 }}>META TITLE</div>
                    <div style={{ fontSize: '0.85rem', color: '#ddd', fontStyle: 'italic' }}>"{form.name ? `${form.name} | Moorti India` : 'Product Name | Moorti India'}"</div>
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <div style={{ fontSize: '0.75rem', color: '#d4a05a', fontWeight: 'bold', marginBottom: 2 }}>META DESCRIPTION</div>
                    <div style={{ fontSize: '0.85rem', color: '#ddd', fontStyle: 'italic' }}>"{form.short_desc || 'Short description...'}"</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#d4a05a', fontWeight: 'bold', marginBottom: 2 }}>IMAGE ALT TEXT</div>
                    <div style={{ fontSize: '0.85rem', color: '#ddd', fontStyle: 'italic' }}>"{form.name || 'Product Image'}"</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {!form.use_default_seo && (
            <>
              <div className={styles.formGridFull}>
                <label className={styles.formLabel} htmlFor="prod-meta-title">Meta Title</label>
                <input id="prod-meta-title" name="meta_title" value={form.meta_title} onChange={handleChange}
                  className={styles.formInput} placeholder="Custom SEO Title" />
              </div>

              <div className={styles.formGridFull}>
                <label className={styles.formLabel} htmlFor="prod-meta-description">Meta Description</label>
                <textarea id="prod-meta-description" name="meta_description" value={form.meta_description}
                  onChange={handleChange} className={styles.formTextarea}
                  placeholder="Custom SEO Description" style={{ minHeight: '80px' }} />
              </div>

              <div className={styles.formGridFull}>
                <label className={styles.formLabel} htmlFor="prod-image-alt">Main Image Alt Text</label>
                <input id="prod-image-alt" name="image_alt_text" value={form.image_alt_text} onChange={handleChange}
                  className={styles.formInput} placeholder="Descriptive alt text for the main image" />
              </div>
            </>
          )}

          {/* ── Actions ───────────────────────────────────────── */}
          <div className={styles.formActions}>
            <button type="button" className={styles.btnSecondary}
              onClick={() => router.push('/admin/products')}>
              Cancel
            </button>
            <button type="submit" className={styles.btnPrimary} id="prod-save-btn" disabled={isPending}>
              {isPending ? 'Saving…' : isNew ? '✓ Create Product' : '✓ Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
