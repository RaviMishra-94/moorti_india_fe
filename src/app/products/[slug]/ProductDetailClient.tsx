'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import styles from './page.module.css';
import DragCarousel from '../../_components/DragCarousel';

import { socialLinks } from '@/lib/data';



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

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);

const RefreshIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 4v6h-6"></path>
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
  </svg>
);

const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);



const PauseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <rect x="6" y="4" width="4" height="16"></rect>
    <rect x="14" y="4" width="4" height="16"></rect>
  </svg>
);

const PlayIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5 3 19 12 5 21 5 3"></polygon>
  </svg>
);

interface Props {
  product: Product;
  clientStories?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export default function ProductDetailClient({ product, clientStories = [] }: Props) {
  const [activeTab, setActiveTab] = useState<'details' | 'care' | 'why'>('details');
  const [mainImageIdx, setMainImageIdx] = useState(0);
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  const FALLBACK_IMAGE = '/images/placeholder.webp';
  
  const handleImageError = (imgUrl: string) => {
    if (!imgUrl || imgUrl === FALLBACK_IMAGE) return;
    setBrokenImages(prev => {
      if (prev[imgUrl]) return prev;
      return { ...prev, [imgUrl]: true };
    });
  };

  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{type: 'error' | 'success', text: string} | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any

  // Auto-clear notification
  useEffect(() => {
    if (statusMsg) {
      const timer = setTimeout(() => setStatusMsg(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [statusMsg]);

  // Get matching testimonial or default to the first one
  const fallbackTestimonial = { name: 'Moorti India Customer', text: 'Beautiful craftsmanship and fast delivery.', statue: 'Marble Statue' };
  const categoryTestimonial = clientStories.length > 0
    ? (clientStories.find((t: any) => t.statue && t.statue.toLowerCase().includes(product.category.toLowerCase().split(' ')[0])) || clientStories[0])
    : fallbackTestimonial;

  const displayImages = [product.image, ...(product.images || [])].filter(Boolean);





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
      setIsPaused(false);
      setAudioUrl(null);
      setAudioBlob(null);
      setRecordingSeconds(0);
      chunksRef.current = [];
    } catch (err: any) {
      let errorMsg = "Microphone access is required to record audio.";
      
      if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        errorMsg = "No microphone found. Please connect a microphone and try again.";
      } else if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorMsg = "Microphone permission denied. Please enable it in your browser settings.";
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        errorMsg = "Microphone is already in use by another application.";
      }
      
      setStatusMsg({ type: 'error', text: errorMsg });
    }
  };

  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = window.setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording, isPaused]);

  const togglePause = () => {
    if (!mediaRecorderRef.current) return;
    
    if (mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
    } else if (mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      // Stop all tracks to release mic
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleWhatsappClick = () => {
    // Extract phone from socialLinks.whatsapp (strip https://wa.me/)
    const phone = socialLinks.whatsapp.split('/').pop() || "917073333202"; 
    const message = `Hi, I am interested in ${product.name} (${product.slug}). Could you please guide me?\n\nI am currently looking at:\n${window.location.href}`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleSendAudioEnquiry = async () => {
    if (!audioBlob) return;
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', audioBlob, `Requirement-${product.slug}.webm`);
      formData.append('statue', product.name);
      formData.append('message', `Audio requirement for ${product.name} (from Product Page)`);
      
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiBase}/api/leads/audio-enquiry`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) throw new Error('Failed to upload audio enquiry');
      
      const data = await response.json();
      const audioPublicUrl = `${apiBase}${data.audio_url}`;
      
      // Construct WhatsApp message
      const phone = socialLinks.whatsapp.split('/').pop() || "919958476169";
      const message = `Hi Moorti India, I have a requirement for ${product.name}.\n\nPlease listen to my audio requirement here: ${audioPublicUrl}`;
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
      
    } catch (err) {
      setStatusMsg({ type: 'error', text: "Failed to send audio. Please try again or contact us directly on WhatsApp." });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="texture-section" style={{ minHeight: '100vh' }}>
      <div className="texture-overlay texture-temple-mural" />
      <div className="texture-vignette" />

      <div className={`${styles.container} texture-content`}>
      
      {/* Toast Notification */}
      {statusMsg && (
        <div className={`${styles.toast} ${statusMsg.type === 'error' ? styles.toastError : styles.toastSuccess}`}>
          <div className={styles.toastContent}>
            {statusMsg.type === 'error' ? '✕' : '✓'} {statusMsg.text}
          </div>
          <button className={styles.toastClose} onClick={() => setStatusMsg(null)}>×</button>
        </div>
      )}
      
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
          <div className={styles.imageCol} style={{ width: '100%' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={brokenImages[displayImages[mainImageIdx]] ? FALLBACK_IMAGE : (displayImages[mainImageIdx] || FALLBACK_IMAGE)}
              alt={product.imageAltText ? `${product.imageAltText} View` : `${product.name} View`}
              style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'contain' }}
              onError={() => handleImageError(displayImages[mainImageIdx])}
              onContextMenu={e => e.preventDefault()}
              draggable={false}
            />
          </div>

          {/* Thumbnail Carousel */}
          {displayImages.length > 1 && (
            <div style={{ paddingBottom: '12px' }}>
              <DragCarousel itemGap={12} showArrows={true} arrowSize={32}>
                {displayImages.map((img, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => setMainImageIdx(idx)}
                    style={{ 
                      flexShrink: 0, 
                      width: '200px', 
                      height: '200px', 
                      borderRadius: '8px', 
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: mainImageIdx === idx ? '2px solid var(--accent)' : '2px solid transparent',
                      opacity: mainImageIdx === idx ? 1 : 0.6,
                      transition: 'all 0.2s ease',
                      background: 'var(--bg-surface)'
                    }}
                  >
                    <Image
                  src={brokenImages[img] ? FALLBACK_IMAGE : (img || FALLBACK_IMAGE)}
                  alt={`${product.name} thumbnail ${idx + 1}`}
                  width={200}
                  height={200}
                  className={styles.thumbnailImage}
                  onError={() => handleImageError(img)}
                  onContextMenu={(e: React.MouseEvent) => e.preventDefault()}
                  draggable={false}
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
                <p className={styles.testimonialText}>&quot;{text}&quot;</p>
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

          {product.keyFeatures && product.keyFeatures.length > 0 && (
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {product.keyFeatures.map((feat, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: '0.88rem', color: 'var(--text-primary, #2a1f0e)', lineHeight: 1.5 }}>
                  <span style={{ color: 'var(--gold, #b07d2e)', fontWeight: 'bold', flexShrink: 0, marginTop: 1 }}>•</span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          )}

          <div className={styles.decisionCtaBox}>
            <h3 className={styles.decisionTitle}>Not sure what size fits your space?</h3>
            <p className={styles.decisionText}>Need Help Choosing the Right Idol? We’ll help you choose the perfect one.</p>
            
            <div style={{ display: 'flex', gap: '10px', marginTop: '15px', flexDirection: 'column' }}>
              <button onClick={handleWhatsappClick} className={`btn btn-primary ${styles.whatsappBtn}`} style={{ margin: 0, letterSpacing: '0.1em' }}>
                <WhatsappIcon /> LET US HELP YOU
              </button>
              
              <button onClick={() => setIsSizeGuideOpen(true)} className="btn btn-ghost" style={{ margin: 0, justifyContent: 'center', display: 'flex', alignItems: 'center', border: '1px solid var(--gold)', color: 'var(--gold)', padding: '10px 16px', fontSize: '1rem', fontWeight: 600, letterSpacing: '0.1em' }}>
                VIEW SIZE GUIDE
              </button>
              
              <p className={styles.noObligation} style={{ textAlign: 'center', marginTop: '2px', marginBottom: '24px' }}>No obligation. Just guidance.</p>
            </div>
            
              <div className={styles.audioRecordSection}>
                <p className={styles.audioTitle}>Or describe your requirement using audio:</p>
                
                {!isRecording && !audioUrl && (
                  <button onClick={startRecording} className={styles.audioBtn}>
                    <AudioMicIcon /> Start Recording
                  </button>
                )}
                
                {isRecording && (
                  <div className={styles.recordingStatus}>
                    <div className={styles.recordingInfo}>
                      <div className={styles.pulseWrapper}>
                        <div className={`${styles.pulseInner} ${isPaused ? styles.pulsePaused : ''}`} />
                      </div>
                      <span className={styles.recordingTimer}>{formatTime(recordingSeconds)}</span>
                    </div>
                    
                    <div className={styles.recordingControls}>
                      <button onClick={togglePause} className={styles.pauseBtn}>
                        {isPaused ? <><PlayIcon /> Resume</> : <><PauseIcon /> Pause</>}
                      </button>
                      <button onClick={stopRecording} className={`${styles.audioBtn} ${styles.audioBtnRecording}`}>
                        Stop
                      </button>
                    </div>
                  </div>
                )}
                
                {audioUrl && (
                  <div className={styles.audioPlayerContainer}>
                    <audio src={audioUrl} controls className={styles.audioControl} />
                    
                    <div className={styles.audioActionButtons}>
                      <button 
                        onClick={handleSendAudioEnquiry} 
                        className={styles.sendAudioBtn}
                        disabled={isUploading}
                      >
                        {isUploading ? 'Sending...' : <><SendIcon /> Send Requirement</>}
                      </button>
                      
                      <div className={styles.audioSecondaryActions}>
                        <button onClick={() => startRecording()} className={styles.iconBtn} title="Retake">
                          <RefreshIcon /> Retake
                        </button>
                        <button onClick={() => { setAudioUrl(null); setAudioBlob(null); }} className={`${styles.iconBtn} ${styles.deleteBtn}`} title="Delete">
                          <TrashIcon /> Delete
                        </button>
                      </div>
                    </div>
                    
                    <p className={styles.audioHelpText}>* This will be shared directly with us on WhatsApp.</p>
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



    {/* Size Guide Modal */}

    {isSizeGuideOpen && (
      <div className={styles.modalOverlay} onClick={() => setIsSizeGuideOpen(false)}>
        <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
          <button className={styles.modalCloseBtn} onClick={() => setIsSizeGuideOpen(false)} aria-label="Close Size Guide">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          <iframe 
            src={`/size-chart?image=${encodeURIComponent(displayImages[mainImageIdx] || product.image || '')}&modal=true`} 
            className={styles.modalIframe}
            title="Size Guide"
          />
        </div>
      </div>
    )}

    </div>
  );
}
