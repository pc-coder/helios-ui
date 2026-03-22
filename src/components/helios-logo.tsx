import { cn } from "@/lib/utils"

interface HeliosLogoProps {
  size?: number
  className?: string
}

const RAY_COUNT = 48
const CENTER = 24
const INNER_RADIUS = 11.5
const OUTER_RADIUS = 23

function generateRays() {
  const rays: {
    x1: number
    y1: number
    x2: number
    y2: number
    tier: number
  }[] = []

  for (let i = 0; i < RAY_COUNT; i++) {
    const angle = (i * 2 * Math.PI) / RAY_COUNT
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)

    const tier = i % 6 === 0 ? 0 : i % 3 === 0 ? 1 : i % 2 === 0 ? 2 : 3

    rays.push({
      x1: CENTER + cos * INNER_RADIUS,
      y1: CENTER + sin * INNER_RADIUS,
      x2: CENTER + cos * OUTER_RADIUS,
      y2: CENTER + sin * OUTER_RADIUS,
      tier,
    })
  }

  return rays
}

const rays = generateRays()

const tierStyles = [
  { strokeWidth: 2.5, opacity: 1 },
  { strokeWidth: 2, opacity: 0.85 },
  { strokeWidth: 1.5, opacity: 0.6 },
  { strokeWidth: 1, opacity: 0.4 },
]

export function HeliosLogo({ size = 24, className }: HeliosLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
    >
      <defs>
        <radialGradient id="helios-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="100%" stopColor="#F59E0B" />
        </radialGradient>
        <radialGradient id="helios-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FDE047" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Glow */}
      <circle cx="24" cy="24" r="22" fill="url(#helios-glow)" />

      {/* Rays */}
      {rays.map((ray, i) => {
        const style = tierStyles[ray.tier]
        return (
          <line
            key={i}
            x1={ray.x1.toFixed(1)}
            y1={ray.y1.toFixed(1)}
            x2={ray.x2.toFixed(1)}
            y2={ray.y2.toFixed(1)}
            stroke="#F59E0B"
            strokeWidth={style.strokeWidth}
            strokeLinecap="round"
            opacity={style.opacity}
          />
        )
      })}

      {/* Core */}
      <circle cx="24" cy="24" r="10" fill="url(#helios-core)" />
    </svg>
  )
}
