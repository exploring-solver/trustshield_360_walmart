// src/components/dashboard/security-alerts.tsx
import { AlertTriangle, Shield, Info } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import type { SecurityAlert as SecurityAlertType } from "@/lib/data"

interface SecurityAlertsProps {
  alerts: SecurityAlertType[]
}

export function SecurityAlerts({ alerts }: SecurityAlertsProps) {
  if (alerts.length === 0) {
    return (
      <div className="p-6 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
            <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="font-semibold text-green-800 dark:text-green-200">All Clear</h3>
            <p className="text-sm text-green-600 dark:text-green-400">
              No security alerts detected. Your account is secure.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <Alert
          key={alert.id}
          variant="destructive"
          className="border-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
            </div>
            <div className="flex-1 space-y-2 min-w-screen">
              <div className="flex items-center justify-between">
                <AlertTitle className="text-red-800 dark:text-red-200 font-semibold">Security Alert</AlertTitle>
                <Badge variant="destructive" className="text-xs">
                  High Priority
                </Badge>
              </div>
              <AlertDescription className="text-red-700 dark:text-red-300">{alert.message}</AlertDescription>
              <div className="flex items-center gap-2 text-xs text-red-600 dark:text-red-400">
                <Info className="h-3 w-3" />
                <span>Detected: {new Date().toLocaleString()}</span>
              </div>
            </div>
          </div>
        </Alert>
      ))}
    </div>
  )
}
