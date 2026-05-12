/**
 * Skeleton loader shown automatically by Next.js while the
 * product form page (server component) is fetching its data.
 */
export default function ProductFormSkeleton() {
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

      {/* Topbar */}
      <div style={{ height: 60, background: '#111', borderBottom: '1px solid #222', display: 'flex', alignItems: 'center', padding: '0 28px', gap: 12 }}>
        <div style={{ ...shimmer, width: 80, height: 22, borderRadius: 6 }} />
        <div style={{ ...shimmer, width: 180, height: 22, borderRadius: 6 }} />
      </div>

      <div style={{ padding: 28 }}>
        {/* Page header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div style={row('220px', 28)} />
          <div style={row('100px', 34)} />
        </div>

        {/* Form card */}
        <div style={{ background: '#161616', border: '1px solid #222', borderRadius: 14, padding: 28 }}>

          {/* Section title */}
          <div style={{ ...row('160px', 14), marginBottom: 24 }} />

          {/* Grid rows */}
          {[1, 2, 3].map(i => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
              <div>
                <div style={{ ...row('80px', 12), marginBottom: 8 }} />
                <div style={row('100%')} />
              </div>
              <div>
                <div style={{ ...row('80px', 12), marginBottom: 8 }} />
                <div style={row('100%')} />
              </div>
            </div>
          ))}

          {/* Full-width textarea skeleton */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ ...row('120px', 12), marginBottom: 8 }} />
            <div style={{ ...shimmer, width: '100%', height: 90, borderRadius: 8 }} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <div style={{ ...row('120px', 12), marginBottom: 8 }} />
            <div style={{ ...shimmer, width: '100%', height: 130, borderRadius: 8 }} />
          </div>

          {/* Section title */}
          <div style={{ ...row('140px', 14), marginBottom: 20, marginTop: 8 }} />

          {/* Image upload zone skeleton */}
          <div style={{ ...shimmer, width: '100%', height: 160, borderRadius: 10 }} />

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 28 }}>
            <div style={row('100px', 38)} />
            <div style={row('140px', 38)} />
          </div>
        </div>
      </div>
    </>
  );
}
