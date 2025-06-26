// src/components/dashboard/security-alerts.tsx
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { SecurityAlert as SecurityAlertType } from "@/lib/data";

interface SecurityAlertsProps {
  alerts: SecurityAlertType[];
}

export function SecurityAlerts({ alerts }: SecurityAlertsProps) {
  if (alerts.length === 0) {
    return null;
  }

  return (
    <div>
      {alerts.map((alert) => (
        <Alert key={alert.id} variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Security Alert!</AlertTitle>
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      ))}
    </div>
  );
}
