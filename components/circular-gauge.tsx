interface CircularGaugeProps {
  value: number
  min?: number
  max?: number
  unit: string
  label: string
  color?: string
}

export function CircularGauge({ value, min = 0, max = 100, unit, label, color = "#00f3ff" }: CircularGaugeProps) {
  const percentage = Math.min(Math.max((value - min) / (max - min), 0), 1)
  const radius = 80
  const strokeWidth = 8
  const circumference = 2 * Math.PI * radius
  // We want a 270 degree gauge (3/4 circle)
  const visibleCircumference = circumference * 0.75
  const strokeDashoffset = visibleCircumference - percentage * visibleCircumference

  // Rotate to start at 135 degrees (bottom left)
  const rotation = 135

  return (
    <div className="relative w-48 h-48 flex items-center justify-center">
      <svg className="w-full h-full" viewBox="0 0 200 200" style={{ transform: `rotate(${rotation}deg)` }}>
        {/* Background Track */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="#1e293b"
          strokeWidth={strokeWidth}
          strokeDasharray={`${visibleCircumference} ${circumference}`}
          strokeLinecap="round"
        />
        {/* Progress Arc */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={`${visibleCircumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
          style={{ filter: `drop-shadow(0 0 8px ${color})` }}
        />
      </svg>

      {/* Center Text (Counter-rotated to stay upright) */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center text-center"
        style={{ transform: `rotate(0deg)` }}
      >
        <span className="font-share-tech text-4xl font-bold text-white drop-shadow-md">{value.toFixed(1)}</span>
        <span className="text-sm text-slate-400 font-rajdhani uppercase tracking-widest mt-1">{unit}</span>
        <span className="text-xs text-slate-600 font-mono mt-4">{label}</span>
      </div>
    </div>
  )
}
