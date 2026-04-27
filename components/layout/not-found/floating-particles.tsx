/** biome-ignore-all lint/suspicious/noArrayIndexKey: false positive */
export default function FloatingParticles() {
  return (
    <div className="pointer-events-none absolute inset-0">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="nf-particle absolute rounded-full"
          style={{
            width: `${3 + Math.random() * 4}px`,
            height: `${3 + Math.random() * 4}px`,
            left: `${8 + i * 7.5}%`,
            top: `${15 + Math.random() * 70}%`,
            background:
              i % 3 === 0
                ? "oklch(0.65 0.25 290)"
                : i % 3 === 1
                  ? "oklch(0.8 0.15 200)"
                  : "oklch(0.7 0.2 250)",
            opacity: 0.3,
            boxShadow:
              i % 2 === 0
                ? "0 0 8px oklch(0.65 0.25 290 / 0.5)"
                : "0 0 8px oklch(0.8 0.15 200 / 0.5)",
          }}
        />
      ))}
    </div>
  );
}
