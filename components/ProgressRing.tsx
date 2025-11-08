interface ProgressRingProps {
  completed: number
  total: number
}

export default function ProgressRing({ completed, total }: ProgressRingProps) {
  const percentage = (completed / total) * 100
  const radius = 45
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className="flex flex-col items-center">
      <svg width="120" height="120" className="transform -rotate-90">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="#334155" strokeWidth="8" />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="#f97316"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000"
        />
      </svg>
      <div className="text-center mt-4">
        <div className="text-3xl font-bold text-orange-500">{Math.round(percentage)}%</div>
        <div className="text-sm text-slate-400">Complete</div>
      </div>
    </div>
  )
}
