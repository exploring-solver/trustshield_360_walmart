// src/components/dashboard/risk-score-indicator.tsx
import { cn } from "@/lib/utils"
import { Shield, AlertTriangle, CheckCircle } from "lucide-react"

interface RiskScoreIndicatorProps {
  score: number
  level: "Low" | "Medium" | "High"
}

export function RiskScoreIndicator({ score, level }: RiskScoreIndicatorProps) {
  const levelConfig = {
    Low: {
      styles:
        "bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-950/30 dark:to-emerald-950/30 text-green-800 dark:text-green-200 border-green-300 dark:border-green-700",
      icon: CheckCircle,
      color: "text-green-600 dark:text-green-400",
    },
    Medium: {
      styles:
        "bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-950/30 dark:to-orange-950/30 text-yellow-800 dark:text-yellow-200 border-yellow-300 dark:border-yellow-700",
      icon: AlertTriangle,
      color: "text-yellow-600 dark:text-yellow-400",
    },
    High: {
      styles:
        "bg-gradient-to-br from-red-100 to-rose-100 dark:from-red-950/30 dark:to-rose-950/30 text-red-800 dark:text-red-200 border-red-300 dark:border-red-700",
      icon: Shield,
      color: "text-red-600 dark:text-red-400",
    },
  }

  const config = levelConfig[level]
  const IconComponent = config.icon

  return (
    <div className={cn("relative rounded-2xl border-2 p-6 text-center shadow-lg", config.styles)}>
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px] rounded-2xl opacity-30" />

      {/* Content */}
      <div className="relative space-y-3">
        <div className="flex items-center justify-center">
          <IconComponent className={cn("h-8 w-8", config.color)} />
        </div>

        <div>
          <p className="text-sm font-medium opacity-80">Account Risk Score</p>
          <p className="text-4xl font-bold tracking-tight">{score}</p>
          <p className="text-lg font-semibold">{level} Risk</p>
        </div>

        {/* Risk Level Indicator */}
        <div className="flex justify-center">
          <div className={cn("px-3 py-1 rounded-full text-xs font-medium border", config.styles)}>
            {level === "Low" && "✓ Secure"}
            {level === "Medium" && "⚠ Monitor"}
            {level === "High" && "⚡ Alert"}
          </div>
        </div>
      </div>
    </div>
  )
}
