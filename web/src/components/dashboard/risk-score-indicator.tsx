// src/components/dashboard/risk-score-indicator.tsx
import { cn } from "@/lib/utils";

interface RiskScoreIndicatorProps {
  score: number;
  level: 'Low' | 'Medium' | 'High';
}

export function RiskScoreIndicator({ score, level }: RiskScoreIndicatorProps) {
  const levelStyles = {
    Low: "bg-green-100 text-green-800 border-green-300",
    Medium: "bg-yellow-100 text-yellow-800 border-yellow-300",
    High: "bg-red-100 text-red-800 border-red-300",
  };

  return (
    <div className={cn("rounded-full border px-4 py-2 text-center", levelStyles[level])}>
      <p className="text-sm font-medium">Account Risk Score</p>
      <p className="text-3xl font-bold">{score}</p>
      <p className="text-xs font-semibold">{level}</p>
    </div>
  );
}
