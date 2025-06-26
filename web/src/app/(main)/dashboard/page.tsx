/* eslint-disable @typescript-eslint/no-unused-vars */
// src/app/dashboard/page.tsx
import { getSecurityData } from "@/lib/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";

import { RiskScoreIndicator } from "@/components/dashboard/risk-score-indicator";
import { SecurityAlerts } from "@/components/dashboard/security-alerts";
import { ActivityLogTable } from "@/components/dashboard/activity-log-table";
import { ActiveSessions } from "@/components/dashboard/active-sessions";

export default async function DashboardPage() {
  const data = await getSecurityData();

  return (
    <div className="min-h-screen">
      <div className="container mx-auto max-w-5xl p-4 md:p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Security Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back, {data.user.name}. Review your account security status and recent activity.
          </p>
        </header>

        <div className="space-y-6">
          <SecurityAlerts alerts={data.alerts} />

          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Risk Overview</CardTitle>
                <CardDescription>Based on AI analysis</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center space-y-4">
                <RiskScoreIndicator score={data.riskScore.value} level={data.riskScore.level} />
                <p className="text-center text-sm text-muted-foreground">{data.riskScore.assessment}</p>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your authentication and privacy.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <h4 className="font-semibold">Multi-Factor Authentication (MFA)</h4>
                    <p className="text-sm text-muted-foreground">Your account is protected with MFA.</p>
                  </div>
                  <Button variant="secondary">Manage</Button>
                </div>
                 <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <h4 className="font-semibold">Privacy Controls</h4>
                    <p className="text-sm text-muted-foreground">Control how your data is used.</p>
                  </div>
                  <Button variant="secondary">Adjust</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Active Sessions</CardTitle>
              <CardDescription>Devices currently logged into your account. Revoke any you don&apos;t recognize.</CardDescription>
            </CardHeader>
            <CardContent>
              <ActiveSessions sessions={data.activeSessions} />
            </CardContent>
          </Card>

          <Card>
                <CardHeader>
                    <CardTitle>Recent Activity Log</CardTitle>
                    <CardDescription>
                        A log of recent security-related events on your account. Click &quo;Analyze&quo; to check IP reputation.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {/* This now renders the interactive client component */}
                    <ActivityLogTable activities={data.activityLog} />
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
