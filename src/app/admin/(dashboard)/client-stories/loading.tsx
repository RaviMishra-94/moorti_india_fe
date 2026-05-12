export default function ClientStoriesListSkeleton() {
  const shimmer: React.CSSProperties = {
    background: 'linear-gradient(90deg, #1a1a1a 25%, #242424 50%, #1a1a1a 75%)',
    backgroundSize: '400% 100%',
    animation: 'shimmer 1.4s ease infinite',
    borderRadius: 8,
  };

  return (
    <>
      <style>{`@keyframes shimmer { 0% { background-position: 100% 0; } 100% { background-position: -100% 0; } }`}</style>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div style={{ ...shimmer, width: 160, height: 26 }} />
        <div style={{ ...shimmer, width: 150, height: 36 }} />
      </div>
      <div style={{ background: '#161616', border: '1px solid #222', borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 160px 100px 80px 90px', gap: 0, padding: '10px 14px', borderBottom: '1px solid #222' }}>
          {[1,2,3,4,5,6].map(i => <div key={i} style={{ ...shimmer, height: 12, width: '60%', borderRadius: 4 }} />)}
        </div>
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '60px 1fr 160px 100px 80px 90px', gap: 0, padding: '13px 14px', borderBottom: '1px solid #1a1a1a', alignItems: 'center' }}>
            <div style={{ ...shimmer, width: 44, height: 44, borderRadius: 6 }} />
            <div style={{ ...shimmer, width: '55%', height: 14 }} />
            <div style={{ ...shimmer, width: '70%', height: 14 }} />
            <div style={{ ...shimmer, width: '60%', height: 14 }} />
            <div style={{ ...shimmer, width: 36, height: 20, borderRadius: 20 }} />
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
