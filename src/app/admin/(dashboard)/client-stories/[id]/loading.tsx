export default function ClientStoryFormSkeleton() {
  const shimmer: React.CSSProperties = {
    background: 'linear-gradient(90deg, #1a1a1a 25%, #242424 50%, #1a1a1a 75%)',
    backgroundSize: '400% 100%',
    animation: 'shimmer 1.4s ease infinite',
    borderRadius: 8,
  };
  const row = (w: string, h = 38): React.CSSProperties => ({ ...shimmer, width: w, height: h });

  return (
    <>
      <style>{`@keyframes shimmer { 0% { background-position: 100% 0; } 100% { background-position: -100% 0; } }`}</style>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <div style={{ ...shimmer, width: 36, height: 36, borderRadius: 8 }} />
        <div style={row('200px', 24)} />
      </div>
      <div style={{ background: '#161616', border: '1px solid #222', borderRadius: 14, padding: 28 }}>
        <div style={{ ...row('140px', 14), marginBottom: 24 }} />
        {/* Image upload skeleton */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
          <div style={{ ...shimmer, width: 120, height: 120, borderRadius: 8, flexShrink: 0 }} />
          <div style={{ ...shimmer, flex: 1, height: 90, borderRadius: 10 }} />
        </div>
        {/* Two-col rows */}
        {[1, 2].map(i => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
            <div><div style={{ ...row('80px', 12), marginBottom: 8 }} /><div style={row('100%')} /></div>
            <div><div style={{ ...row('80px', 12), marginBottom: 8 }} /><div style={row('100%')} /></div>
          </div>
        ))}
        <div style={{ ...row('120px', 14), marginBottom: 20 }} />
        {[1, 2].map(i => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
            <div><div style={{ ...row('80px', 12), marginBottom: 8 }} /><div style={row('100%')} /></div>
            <div><div style={{ ...row('80px', 12), marginBottom: 8 }} /><div style={row('100%')} /></div>
          </div>
        ))}
        <div style={{ marginBottom: 20 }}>
          <div style={{ ...row('100px', 12), marginBottom: 8 }} />
          <div style={{ ...shimmer, width: '100%', height: 110, borderRadius: 8 }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 28 }}>
          <div style={row('100px', 38)} />
          <div style={row('120px', 38)} />
        </div>
      </div>
    </>
  );
}
