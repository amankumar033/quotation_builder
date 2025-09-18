"use client";

interface SpinnerProps {
  bgColor: string;   // required Tailwind class, e.g. "bg-blue-600"
  size?: number;     // spinner size in px (default 20)
  text?: string;     // optional label
}

export default function Spinner({ bgColor, size = 20, text }: SpinnerProps) {
  return (
    <div className="flex items-center gap-2 mr-2">
      <div className="relative" style={{ width: size, height: size }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className={`absolute rounded origin-center ${bgColor}`}
            style={{
              width: size * 0.1,
              height: size * 0.35,
              top: "50%",
              left: "50%",
              transform: `rotate(${i * 45}deg) translate(0, -${size * 0.35}px)`,
              animation: `spinnerFade 1.2s linear infinite`,
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
        <style jsx>{`
          @keyframes spinnerFade {
            0%, 39%, 100% {
              opacity: 0.25;
            }
            40% {
              opacity: 1;
            }
          }
        `}</style>
      </div>
      {/* { <span className="text-sm">{text}</span>} */}
    </div>
  );
}
