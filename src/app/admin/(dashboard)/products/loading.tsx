/**
 * Skeleton loader shown while the products list page fetches data.
 */
export default function ProductsListSkeleton() {
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
        <div style={{ ...shimmer, width: 140, height: 26 }} />
        <div style={{ ...shimmer, width: 120, height: 36 }} />
      </div>

      {/* Table card */}
      <div style={{ background: '#161616', border: '1px solid #222', borderRadius: 14, overflow: 'hidden' }}>
        {/* Table header */}
        <div style={{ display: 'grid', gridTemplateColumns: '44px 1fr 160px 200px 140px 90px', gap: 0, padding: '10px 14px', borderBottom: '1px solid #222' }}>
          {['', 'NAME', 'CATEGORY', 'MATERIAL', 'BADGES', 'ACTIONS'].map(h => (
            <div key={h} style={{ ...shimmer, height: 12, width: h ? '60%' : 20, borderRadius: 4 }} />
          ))}
        </div>
        {/* Table rows */}
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '44px 1fr 160px 200px 140px 90px', gap: 0, padding: '13px 14px', borderBottom: '1px solid #1a1a1a', alignItems: 'center' }}>
            <div style={{ ...shimmer, width: 8, height: 16, borderRadius: 4 }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ ...shimmer, width: 44, height: 44, borderRadius: 6, flexShrink: 0 }} />
              <div style={{ ...shimmer, width: '55%', height: 14 }} />
            </div>
            <div style={{ ...shimmer, width: '70%', height: 14 }} />
            <div style={{ ...shimmer, width: '65%', height: 14 }} />
            <div style={{ display: 'flex', gap: 6 }}>
              <div style={{ ...shimmer, width: 64, height: 22, borderRadius: 20 }} />
              <div style={{ ...shimmer, width: 72, height: 22, borderRadius: 20 }} />
            </div>
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
