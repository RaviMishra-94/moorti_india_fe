'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import styles from './page.module.css';
import DragCarousel from '../../_components/DragCarousel';

import { socialLinks } from '@/lib/data';

const ZoomIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    <line x1="11" y1="8" x2="11" y2="14"></line>
    <line x1="8" y1="11" x2="14" y2="11"></line>
  </svg>
);

const AudioMicIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: 6}}>
    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
    <line x1="12" y1="19" x2="12" y2="22"></line>
  </svg>
);

const WhatsappIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: 8}}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
);

// Reuse icons from footer for sharing
const FacebookIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>;
const InstagramIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>;
const TwitterIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
const YoutubeIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>;

const DiamondIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="var(--gold)" style={{marginRight: 8, flexShrink: 0}}>
    <path d="M12 2L2 12l10 10 10-10L12 2z" />
  </svg>
);

interface Props {
  product: Product;
  clientStories?: any[];
}

export default function ProductDetailClient({ product, clientStories = [] }: Props) {
  const [activeTab, setActiveTab] = useState<'details' | 'care' | 'why'>('details');
  const [zoomStyle, setZoomStyle] = useState({ transformOrigin: '50% 50%', transform: 'scale(1)' });
  const [isZooming, setIsZooming] = useState(false);
  const [mainImageIdx, setMainImageIdx] = useState(0);

  // Audio recording state
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // Get matching testimonial or default to the first one
  const fallbackTestimonial = { name: 'Moorti India Customer', text: 'Beautiful craftsmanship and fast delivery.', statue: 'Marble Statue' };
  const categoryTestimonial = clientStories.length > 0
    ? (clientStories.find(t => t.statue && t.statue.toLowerCase().includes(product.category.toLowerCase().split(' ')[0])) || clientStories[0])
    : fallbackTestimonial;

  const displayImages = [product.image, ...(product.images || [])].filter(Boolean);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({ transformOrigin: `${x}% ${y}%`, transform: 'scale(2.2)' });
  };

  const handleMouseEnter = () => setIsZooming(true);
  const handleMouseLeave = () => {
    setIsZooming(false);
    setZoomStyle({ transformOrigin: '50% 50%', transform: 'scale(1)' });
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setAudioBlob(blob);
        chunksRef.current = [];
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setAudioUrl(null);
    } catch (err) {
      console.error("Error accessing microphone", err);
      alert("Microphone access is required to record audio.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      // Stop all tracks to release mic
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleWhatsappClick = () => {
    // Extract phone from socialLinks.whatsapp (strip https://wa.me/)
    const phone = socialLinks.whatsapp.split('/').pop() || "919958476169"; 
    const message = `Hi, I am interested in ${product.name} (${product.slug}). Could you please guide me?`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleShareAudio = async () => {
    if (!audioBlob || !audioUrl) return;
    
    try {
      const file = new File([audioBlob], `Requirement-${product.slug}.webm`, { type: 'audio/webm' });
      
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `Requirement for ${product.name}`,
          text: `Hi, please find my audio requirement for ${product.name}.`,
          files: [file]
        });
      } else {
        const a = document.createElement('a');
        a.href = audioUrl;
        a.download = `Requirement-${product.slug}.webm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        alert("Audio downloaded. You can now attach and share this file via WhatsApp.");
      }
    } catch (err) {
      console.error("Error sharing audio", err);
    }
  };

  return (
    <div className={styles.container}>
      
      {/* Floating Banner */}
      <div className={styles.floatingBanner}>
        <div className={styles.bannerItem}><DiamondIcon /> Premium Vietnam / Makrana marble</div>
        <div className={styles.bannerItem}><DiamondIcon /> Handcrafted by artisans</div>
        <div className={styles.bannerItem}><DiamondIcon /> Safe delivery across India</div>
        <div className={styles.bannerItem}><DiamondIcon /> 5000+ happy homes</div>
      </div>

      <div className={styles.productGrid}>
        
        {/* Left Column: Images (Main Image + Thumbnail Carousel + Testimonial) */}
        <div className={styles.leftCol} style={{ minWidth: 0 }}>
          
          {/* Main Selected Image */}
          <div
            className={styles.imageCol}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ cursor: isZooming ? 'zoom-in' : 'default', width: '100%' }}
          >
            <div className={styles.imageZoomWrapper} style={zoomStyle}>
              <Image
                src={displayImages[mainImageIdx]}
                alt={product.imageAltText ? `${product.imageAltText} View` : `${product.name} View`}
                width={800}
                height={800}
                style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                priority
              />
            </div>
            {!isZooming && (
              <div className={styles.magnifierHint}>
                <ZoomIcon /> Roll over image to magnify
              </div>
            )}
          </div>

          {/* Thumbnail Carousel */}
          {displayImages.length > 1 && (
            <div style={{ paddingBottom: '12px' }}>
              <DragCarousel itemGap={12} showArrows={true} arrowSize={32}>
                {displayImages.map((img, i) => (
                  <div 
                    key={i} 
                    onClick={() => setMainImageIdx(i)}
                    style={{ 
                      flexShrink: 0, 
                      width: '100px', 
                      height: '100px', 
                      borderRadius: '8px', 
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: mainImageIdx === i ? '2px solid var(--accent)' : '2px solid transparent',
                      opacity: mainImageIdx === i ? 1 : 0.6,
                      transition: 'all 0.2s ease',
                      background: 'var(--bg-surface)'
                    }}
                  >
                    <Image 
                      src={img} 
                      alt={`Thumbnail ${i+1}`} 
                      width={100} 
                      height={100} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  </div>
                ))}
              </DragCarousel>
            </div>
          )}
          
          {/* Testimonial */}
          {(product.useDefaultTestimonial || product.testimonialText) && (() => {
            const isDefault = product.useDefaultTestimonial;
            const text = isDefault ? categoryTestimonial.text : (product.testimonialText || categoryTestimonial.text);
            const author = isDefault ? `— ${categoryTestimonial.name}, ${categoryTestimonial.location}` : (product.testimonialAuthor || `— ${categoryTestimonial.name}, ${categoryTestimonial.location}`);
            const starsCount = isDefault ? 5 : (product.testimonialStars ?? 5);
            
            return (
              <div className={styles.testimonialBox}>
                <div className={styles.stars}>
                  {'★'.repeat(starsCount)}{'☆'.repeat(5 - starsCount)}
                </div>
                <p className={styles.testimonialText}>"{text}"</p>
                <p className={styles.testimonialAuthor}>{author}</p>
              </div>
            );
          })()}
        </div>

        {/* Right Column: Details */}
        <div className={styles.detailsCol}>
          <div className={styles.tagsContainer}>
            {product.tags?.map(tag => (
              <span key={tag} className={styles.tag}>{tag}</span>
            ))}
            {!product.tags && <span className={styles.tag}>Premium</span>}
          </div>

          <h1 className={styles.title}>{product.name}</h1>
          <p className={styles.shortDesc}>{product.description || product.shortDesc}</p>

          <div className={styles.decisionCtaBox}>
            <h3 className={styles.decisionTitle}>Not sure what size fits your space?</h3>
            <p className={styles.decisionText}>Need Help Choosing the Right Idol? We’ll help you choose the perfect one.</p>
            
            <button onClick={handleWhatsappClick} className={`btn btn-primary ${styles.whatsappBtn}`}>
              <WhatsappIcon /> Let us help you
            </button>
            <p className={styles.noObligation}>No obligation. Just guidance.</p>
            
            <div className={styles.audioRecordSection}>
              <p className={styles.audioTitle}>Or describe your requirement using audio:</p>
              {!isRecording && !audioUrl && (
                <button onClick={startRecording} className={styles.audioBtn}>
                  <AudioMicIcon /> Start Recording
                </button>
              )}
              {isRecording && (
                <button onClick={stopRecording} className={`${styles.audioBtn} ${styles.audioBtnRecording}`}>
                  <AudioMicIcon /> Stop Recording
                </button>
              )}
              {audioUrl && (
                <div className={styles.audioPlayer}>
                  <audio src={audioUrl} controls className={styles.audioControl} />
                  <div className={styles.audioActions}>
                    <button onClick={handleShareAudio} className={styles.shareAudioBtn}>
                      <WhatsappIcon /> Send / Download Audio
                    </button>
                    <button onClick={() => { setAudioUrl(null); setAudioBlob(null); }} className={styles.clearAudioBtn}>Reset</button>
                  </div>
                  <p className={styles.audioNotice}>*If sharing is not supported on your device, the audio will be downloaded for you to share manually.</p>
                </div>
              )}
            </div>
          </div>

          {false && (
            <>
              <h2 className={styles.detailsHeader}>Specifications</h2>
              <div className={styles.detailsTable}>
                {product.height && (
                  <div className={styles.detailsRow}>
                    <span className={styles.detailsLabel}>Height :</span>
                    <span className={styles.detailsValue}>{product.height}</span>
                  </div>
                )}
                {product.weight && (
                  <div className={styles.detailsRow}>
                    <span className={styles.detailsLabel}>Weight :</span>
                    <span className={styles.detailsValue}>{product.weight}</span>
                  </div>
                )}
                {product.material && (
                  <div className={styles.detailsRow}>
                    <span className={styles.detailsLabel}>Material :</span>
                    <span className={styles.detailsValue}>{product.material}</span>
                  </div>
                )}
                {product.finish && (
                  <div className={styles.detailsRow}>
                    <span className={styles.detailsLabel}>Finish :</span>
                    <span className={styles.detailsValue}>{product.finish}</span>
                  </div>
                )}
                {product.color && (
                  <div className={styles.detailsRow}>
                    <span className={styles.detailsLabel}>Color :</span>
                    <span className={styles.detailsValue}>{product.color}</span>
                  </div>
                )}
                {/* Fallbacks for older data structure */}
                {product.painting && !product.finish && (
                  <div className={styles.detailsRow}>
                    <span className={styles.detailsLabel}>Painting :</span>
                    <span className={styles.detailsValue}>{product.painting}</span>
                  </div>
                )}
              </div>
            </>
          )}

          <div className={styles.socialRow}>
            <span className={styles.socialLabel}>Connect & Share:</span>
            <div className={styles.socials}>
              <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className={styles.socialBtn} aria-label="Facebook"><FacebookIcon /></a>
              <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className={styles.socialBtn} aria-label="Instagram"><InstagramIcon /></a>
              <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className={styles.socialBtn} aria-label="Twitter"><TwitterIcon /></a>
              <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className={styles.socialBtn} aria-label="YouTube"><YoutubeIcon /></a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Tabs Area */}
      <div className={styles.tabsContainer}>
        <div className={styles.tabList}>
          <button
            className={`${styles.tabBtn} ${activeTab === 'details' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('details')}
          >
            More Details
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === 'care' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('care')}
          >
            Product Care
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === 'why' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('why')}
          >
            Why Moorti India
          </button>
        </div>

        <div className={styles.tabContent}>
          {activeTab === 'details' && (
            <div>{product.shortDesc || 'Detailed specifications and craftsmanship information about this product.'}</div>
          )}
          {activeTab === 'care' && (
            <div>{product.productCare || 'General marble care instructions apply.'}</div>
          )}
          {activeTab === 'why' && (
            <div>
              <h3>Why Moorti India</h3>
              <p>{product.whyChooseUs || 'We are one of the leading Premium Handcrafted Marble Sculptures manufacturers in Jaipur, India.'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
