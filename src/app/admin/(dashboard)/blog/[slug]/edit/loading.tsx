/**
 * Skeleton loader shown while the blog post form fetches data.
 */
export default function BlogFormSkeleton() {
  const shimmer: React.CSSProperties = {
    background: 'linear-gradient(90deg, #1a1a1a 25%, #242424 50%, #1a1a1a 75%)',
    backgroundSize: '400% 100%',
    animation: 'shimmer 1.4s ease infinite',
    borderRadius: 8,
  };

  const row = (w: string, h = 38): React.CSSProperties => ({
    ...shimmer,
    width: w,
    height: h,
  });

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 100% 0; }
          100% { background-position: -100% 0; }
        }
      `}</style>

      {/* Page header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div style={row('220px', 28)} />
        <div style={row('100px', 34)} />
      </div>

      {/* Form card */}
      <div style={{ background: '#161616', border: '1px solid #222', borderRadius: 14, padding: 28 }}>
        
        {/* Title / Slug */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20, marginBottom: 20 }}>
          <div>
            <div style={{ ...row('80px', 12), marginBottom: 8 }} />
            <div style={row('100%')} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
          <div>
            <div style={{ ...row('80px', 12), marginBottom: 8 }} />
            <div style={row('100%')} />
          </div>
          <div>
            <div style={{ ...row('80px', 12), marginBottom: 8 }} />
            <div style={row('100%')} />
          </div>
        </div>

        {/* Full-width textarea skeleton (Excerpt) */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ ...row('120px', 12), marginBottom: 8 }} />
          <div style={{ ...shimmer, width: '100%', height: 90, borderRadius: 8 }} />
        </div>
        
        {/* Full-width textarea skeleton (Content) */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ ...row('120px', 12), marginBottom: 8 }} />
          <div style={{ ...shimmer, width: '100%', height: 300, borderRadius: 8 }} />
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-start', gap: 12, marginTop: 28 }}>
          <div style={row('140px', 38)} />
        </div>
      </div>
    </>
  );
}
