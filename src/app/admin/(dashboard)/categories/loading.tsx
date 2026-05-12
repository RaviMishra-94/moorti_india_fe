/**
 * Skeleton loader shown while the categories list page fetches data.
 */
export default function CategoriesListSkeleton() {
  const shimmer: React.CSSProperties = {
    background: 'linear-gradient(90deg, #1a1a1a 25%, #242424 50%, #1a1a1a 75%)',
    backgroundSize: '400% 100%',
    animation: 'shimmer 1.4s ease infinite',
    borderRadius: 8,
  };

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 100% 0; }
          100% { background-position: -100% 0; }
        }
      `}</style>

      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div style={{ ...shimmer, width: 160, height: 26 }} />
        <div style={{ ...shimmer, width: 140, height: 36 }} />
      </div>

      {/* Table card */}
      <div style={{ background: '#161616', border: '1px solid #222', borderRadius: 14, overflow: 'hidden' }}>
        {/* Table header */}
        <div style={{ display: 'grid', gridTemplateColumns: '44px 1fr 200px 80px 90px', gap: 0, padding: '10px 14px', borderBottom: '1px solid #222' }}>
          {['', 'NAME', 'DESCRIPTION', 'COUNT', 'ACTIONS'].map(h => (
            <div key={h} style={{ ...shimmer, height: 12, width: h ? '60%' : 20, borderRadius: 4 }} />
          ))}
        </div>
        {/* Table rows */}
        {[1, 2, 3, 4].map(i => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '44px 1fr 200px 80px 90px', gap: 0, padding: '13px 14px', borderBottom: '1px solid #1a1a1a', alignItems: 'center' }}>
            <div style={{ ...shimmer, width: 8, height: 16, borderRadius: 4 }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ ...shimmer, width: 44, height: 44, borderRadius: 6, flexShrink: 0 }} />
              <div style={{ ...shimmer, width: '50%', height: 14 }} />
            </div>
            <div style={{ ...shimmer, width: '75%', height: 14 }} />
            <div style={{ ...shimmer, width: 32, height: 14 }} />
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ ...shimmer, width: 32, height: 32, borderRadius: 7 }} />
              <div style={{ ...shimmer, width: 32, height: 32, borderRadius: 7 }} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
