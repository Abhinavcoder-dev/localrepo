const STAR_PATH = "M12 3.5l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17.3 6.6 20.4l1-6.1-4.4-4.3 6.1-.9z";

export default function StarRating({ rating, count, size = 14 }: { rating: string | number; count?: number; size?: number }) {
  const value = Number(rating);
  const full = Math.floor(value);
  const stars = Array.from({ length: 5 }, (_, i) => {
    const fillLevel = i < full ? 1 : i === full ? value - full : 0;
    return fillLevel;
  });

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <div style={{ display: "inline-flex", gap: 1 }}>
        {stars.map((level, i) => (
          <span
            key={i}
            style={{
              position: "relative",
              width: size,
              height: size,
              display: "inline-block",
              color: "var(--line)",
            }}
          >
            <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
              <path d={STAR_PATH} />
            </svg>
            <span
              style={{
                position: "absolute",
                inset: 0,
                overflow: "hidden",
                width: `${level * 100}%`,
                color: "var(--orange)",
              }}
            >
              <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
                <path d={STAR_PATH} />
              </svg>
            </span>
          </span>
        ))}
      </div>
      {count !== undefined && (
        <span style={{ fontSize: 12.5, color: "var(--ink-soft)" }}>{count.toLocaleString()}</span>
      )}
    </div>
  );
}
