"use client";
import { type BigFive } from "@/lib/psychology";

interface RadarChartProps {
  profiles: {
    data: BigFive;
    color: string;
    label: string;
    opacity?: number;
  }[];
  size?: number;
}

const AXES: { key: keyof BigFive; label: string; short: string }[] = [
  { key: "O", label: "Ouverture",     short: "O" },
  { key: "C", label: "Conscience",    short: "C" },
  { key: "E", label: "Extraversion",  short: "E" },
  { key: "A", label: "Agréabilité",   short: "A" },
  { key: "N", label: "Névrosisme",    short: "N" },
];

function polarToCart(angle: number, r: number, cx: number, cy: number) {
  return {
    x: cx + r * Math.cos(angle - Math.PI / 2),
    y: cy + r * Math.sin(angle - Math.PI / 2),
  };
}

export default function RadarChart({ profiles, size = 260 }: RadarChartProps) {
  const cx = size / 2;
  const cy = size / 2;
  const maxR = size * 0.36;
  const n = AXES.length;
  const step = (2 * Math.PI) / n;

  // Grid rings
  const rings = [0.25, 0.5, 0.75, 1.0];

  // Axis endpoints
  const axisPoints = AXES.map((_, i) => polarToCart(i * step, maxR, cx, cy));

  // Polygon path for a profile
  function profilePath(data: BigFive) {
    return AXES.map((ax, i) => {
      const r = data[ax.key] * maxR;
      const pt = polarToCart(i * step, r, cx, cy);
      return `${i === 0 ? "M" : "L"}${pt.x.toFixed(2)},${pt.y.toFixed(2)}`;
    }).join(" ") + " Z";
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
      {/* Grid rings */}
      {rings.map((r) => {
        const pts = AXES.map((_, i) => {
          const pt = polarToCart(i * step, r * maxR, cx, cy);
          return `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
        });
        return (
          <polygon
            key={r}
            points={pts.join(" ")}
            fill="none"
            stroke="#374151"
            strokeWidth="1"
          />
        );
      })}

      {/* Axis lines */}
      {axisPoints.map((pt, i) => (
        <line key={i} x1={cx} y1={cy} x2={pt.x} y2={pt.y} stroke="#374151" strokeWidth="1" />
      ))}

      {/* Profiles */}
      {profiles.map((p, pi) => (
        <path
          key={pi}
          d={profilePath(p.data)}
          fill={p.color}
          fillOpacity={p.opacity ?? 0.15}
          stroke={p.color}
          strokeWidth="2"
          strokeLinejoin="round"
        />
      ))}

      {/* Dots on profile vertices */}
      {profiles.map((p, pi) =>
        AXES.map((ax, i) => {
          const r = p.data[ax.key] * maxR;
          const pt = polarToCart(i * step, r, cx, cy);
          return <circle key={`${pi}-${i}`} cx={pt.x} cy={pt.y} r="3" fill={p.color} />;
        })
      )}

      {/* Axis labels */}
      {AXES.map((ax, i) => {
        const pt = polarToCart(i * step, maxR + 18, cx, cy);
        return (
          <text
            key={i}
            x={pt.x}
            y={pt.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="11"
            fill="#9ca3af"
            fontWeight="500"
          >
            {ax.label}
          </text>
        );
      })}

      {/* Legend */}
      {profiles.map((p, i) => (
        <g key={i} transform={`translate(8, ${size - 20 - i * 16})`}>
          <rect width="10" height="10" rx="2" fill={p.color} fillOpacity="0.7" />
          <text x="14" y="9" fontSize="10" fill="#9ca3af">{p.label}</text>
        </g>
      ))}
    </svg>
  );
}
