import type React from "react"
import { Card, CardContent } from "@/components/ui/card"

interface StatCardProps {
  label: string
  value: string | number
  subtext?: string
  icon?: React.ReactNode
  trend?: { value: number; direction: "up" | "down" }
  color: "blue" | "teal" | "orange" | "green" | "purple"
}

const colorConfig = {
  blue: {
    bg: "bg-blue-50 dark:bg-blue-950/30",
    text: "text-blue-700 dark:text-blue-300",
    icon: "bg-blue-100 dark:bg-blue-900/50",
  },
  teal: {
    bg: "bg-teal-50 dark:bg-teal-950/30",
    text: "text-teal-700 dark:text-teal-300",
    icon: "bg-teal-100 dark:bg-teal-900/50",
  },
  orange: {
    bg: "bg-orange-50 dark:bg-orange-950/30",
    text: "text-orange-700 dark:text-orange-300",
    icon: "bg-orange-100 dark:bg-orange-900/50",
  },
  green: {
    bg: "bg-green-50 dark:bg-green-950/30",
    text: "text-green-700 dark:text-green-300",
    icon: "bg-green-100 dark:bg-green-900/50",
  },
  purple: {
    bg: "bg-purple-50 dark:bg-purple-950/30",
    text: "text-purple-700 dark:text-purple-300",
    icon: "bg-purple-100 dark:bg-purple-900/50",
  },
}

export function StatCard({ label, value, subtext, icon, trend, color }: StatCardProps) {
  const config = colorConfig[color]

  return (
    <Card className={`${config.bg} border-0`}>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
            <div className="mt-3 flex items-baseline gap-2">
              <span className={`text-3xl font-bold ${config.text}`}>{value}</span>
              {trend && (
                <span
                  className={`text-xs font-semibold ${trend.direction === "up" ? "text-green-600" : "text-red-600"}`}
                >
                  {trend.direction === "up" ? "↑" : "↓"} {trend.value}%
                </span>
              )}
            </div>
            {subtext && <p className="text-xs text-muted-foreground mt-2">{subtext}</p>}
          </div>
          {icon && <div className={`${config.icon} p-3 rounded-lg text-lg`}>{icon}</div>}
        </div>
      </CardContent>
    </Card>
  )
}
