/* eslint-disable @typescript-eslint/no-unused-vars */
// src/app/dashboard/page.tsx
import { getSecurityData } from "@/lib/data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RiskScoreIndicator } from "@/components/dashboard/risk-score-indicator"
import { SecurityAlerts } from "@/components/dashboard/security-alerts"
import { ActivityLogTable } from "@/components/dashboard/activity-log-table"
import { ActiveSessions } from "@/components/dashboard/active-sessions"
import AdaptiveCheckoutButton from "@/components/dashboard/adaptive-checkout-button"
import { Shield, Settings, Activity, Users, Lock, Eye, Zap } from "lucide-react"

export default async function DashboardPage() {
  const data = await getSecurityData()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
      <div className="container mx-auto max-w-7xl p-4 md:p-8">
        {/* Enhanced Header */}
        <header className="mb-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Security Dashboard
              </h1>
              <p className="text-lg text-muted-foreground">
                Welcome back, <span className="font-semibold text-foreground">{data.user.name}</span>. Your security
                status at a glance.
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl border border-white/20 dark:border-slate-700/50 text-center">
              <Shield className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <div className="text-lg font-bold">Active</div>
              <div className="text-xs text-muted-foreground">Protection Status</div>
            </div>
            <div className="p-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl border border-white/20 dark:border-slate-700/50 text-center">
              <Users className="h-6 w-6 mx-auto mb-2 text-blue-600" />
              <div className="text-lg font-bold">{data.activeSessions.length}</div>
              <div className="text-xs text-muted-foreground">Active Sessions</div>
            </div>
            <div className="p-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl border border-white/20 dark:border-slate-700/50 text-center">
              <Activity className="h-6 w-6 mx-auto mb-2 text-purple-600" />
              <div className="text-lg font-bold">{data.activityLog.length}</div>
              <div className="text-xs text-muted-foreground">Recent Events</div>
            </div>
            <div className="p-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl border border-white/20 dark:border-slate-700/50 text-center">
              <Eye className="h-6 w-6 mx-auto mb-2 text-orange-600" />
              <div className="text-lg font-bold">{data.alerts.length}</div>
              <div className="text-xs text-muted-foreground">Security Alerts</div>
            </div>
          </div>
        </header>

        <div className="space-y-8">
          {/* Security Alerts */}
          <SecurityAlerts alerts={data.alerts} />

          {/* Main Grid */}
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Risk Overview Card */}
            <Card className="lg:col-span-1 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-white/20 dark:border-slate-700/50 shadow-xl">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  <CardTitle>Risk Assessment</CardTitle>
                </div>
                <CardDescription>AI-powered security analysis of your account</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center space-y-6">
                <RiskScoreIndicator score={data.riskScore.value} level={data.riskScore.level} />
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground font-medium">{data.riskScore.assessment}</p>
                  <Badge variant="outline" className="text-xs">
                    Last Updated: {new Date().toLocaleDateString()}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Security Settings Card */}
            <Card className="lg:col-span-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-white/20 dark:border-slate-700/50 shadow-xl">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  <CardTitle>Security Controls</CardTitle>
                </div>
                <CardDescription>Manage your authentication and privacy settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <Lock className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-800 dark:text-green-200">Multi-Factor Authentication</h4>
                      <p className="text-sm text-green-600 dark:text-green-400">
                        Your account is secured with quantum-safe MFA
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    className="bg-green-100 dark:bg-green-900 hover:bg-green-200 dark:hover:bg-green-800"
                  >
                    Manage
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <Eye className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-800 dark:text-blue-200">Privacy Controls</h4>
                      <p className="text-sm text-blue-600 dark:text-blue-400">
                        Control how your data is processed and shared
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    className="bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800"
                  >
                    Adjust
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Active Sessions */}
          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-white/20 dark:border-slate-700/50 shadow-xl">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <CardTitle>Active Sessions</CardTitle>
              </div>
              <CardDescription>
                Devices currently logged into your account. Revoke access for any unrecognized devices immediately.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ActiveSessions sessions={data.activeSessions} />
            </CardContent>
          </Card>

          {/* Activity Log */}
          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-white/20 dark:border-slate-700/50 shadow-xl">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                <CardTitle>Security Activity Log</CardTitle>
              </div>
              <CardDescription>
                Recent security events on your account. Click "Analyze" to check IP reputation using live threat
                intelligence.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ActivityLogTable activities={data.activityLog} />
            </CardContent>
          </Card>

          {/* Adaptive Checkout */}
          <div className="space-y-8">
            <AdaptiveCheckoutButton />
          </div>
        </div>
      </div>
    </div>
  )
}
