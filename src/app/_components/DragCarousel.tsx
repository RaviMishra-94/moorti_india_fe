'use client';

import React, { useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';

interface DragCarouselProps {
  children: React.ReactNode;
  className?: string;
  itemGap?: number;
  showArrows?: boolean;
  arrowSize?: number;
}

export default function DragCarousel({ 
  children, 
  className = '', 
  itemGap = 16,
  showArrows = true,
  arrowSize = 56
}: DragCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true, 
    align: 'start',
    skipSnaps: false,
    dragFree: false
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const ArrowLeft = () => (
    <svg width={arrowSize * 0.4} height={arrowSize * 0.4} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );

  const ArrowRight = () => (
    <svg width={arrowSize * 0.4} height={arrowSize * 0.4} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );

  return (
    <div style={{ position: 'relative', width: '100%' }} className={className}>
      <div 
        ref={emblaRef} 
        style={{ overflow: 'hidden', width: '100%', cursor: 'grab' }}
        onMouseDown={e => { e.currentTarget.style.cursor = 'grabbing'; }}
        onMouseUp={e => { e.currentTarget.style.cursor = 'grab'; }}
        onMouseLeave={e => { e.currentTarget.style.cursor = 'grab'; }}
      >
        <div style={{ display: 'flex', alignItems: 'stretch', backfaceVisibility: 'hidden', touchAction: 'pan-y' }}>
          {React.Children.map(children, (child, i) => (
            <div key={i} style={{ display: 'flex', flex: '0 0 auto', minWidth: 0, paddingRight: `${itemGap}px` }}>
              <div style={{ width: '100%', display: 'flex' }}>
                {child}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showArrows && (
        <>
          <button
            onClick={scrollPrev}
            style={{
              position: 'absolute',
              left: `-${arrowSize / 2}px`,
              top: '50%',
              transform: 'translateY(-50%)',
              width: `${arrowSize}px`,
              height: `${arrowSize}px`,
              borderRadius: '50%',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-medium)',
              color: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              zIndex: 10,
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => {
               e.currentTarget.style.background = 'var(--gold)';
               e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={e => {
               e.currentTarget.style.background = 'var(--bg-surface)';
               e.currentTarget.style.color = 'var(--accent)';
            }}
            aria-label="Previous slide"
          >
            <ArrowLeft />
          </button>

          <button
            onClick={scrollNext}
            style={{
              position: 'absolute',
              right: `-${arrowSize / 2}px`,
              top: '50%',
              transform: 'translateY(-50%)',
              width: `${arrowSize}px`,
              height: `${arrowSize}px`,
              borderRadius: '50%',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-medium)',
              color: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              zIndex: 10,
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => {
               e.currentTarget.style.background = 'var(--gold)';
               e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={e => {
               e.currentTarget.style.background = 'var(--bg-surface)';
               e.currentTarget.style.color = 'var(--accent)';
            }}
            aria-label="Next slide"
          >
            <ArrowRight />
          </button>
        </>
      )}
    </div>
  );
}
