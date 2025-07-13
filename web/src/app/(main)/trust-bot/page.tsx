/* eslint-disable @typescript-eslint/no-unused-vars */
// File: src/app/copilot-demo/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CopilotTrigger } from "@/components/ai/copilot-trigger"
import { Shield, Activity, AlertTriangle, Clock, User, Globe } from "lucide-react"

// --- Mock Data for Demonstration ---
const securityEvents = [
  {
    type: "High-Risk Transaction Blocked",
    user: "alex.doe@example.com",
    riskScore: 0.92,
    timestamp: "2025-07-07T22:10:00Z",
  },
  {
    type: "Suspicious Login Attempt",
    ip: "103.22.14.88",
    abuseConfidence: 85,
    user: "unknown",
    device: "Chrome on Windows",
    timestamp: "2025-07-07T21:55:12Z",
  },
  {
    type: "Password Changed",
    user: "sarah.jones@example.com",
    ip: "203.0.113.15",
    timestamp: "2025-07-07T18:30:45Z",
  },
]

export default function CopilotDemoPage() {
  const getEventSeverity = (event: (typeof securityEvents)[0]) => {
    if (event.riskScore && event.riskScore > 0.8) return "high"
    if (event.abuseConfidence && event.abuseConfidence > 70) return "high"
    if (event.type.toLowerCase().includes("suspicious") || event.type.toLowerCase().includes("blocked")) return "medium"
    return "low"
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-red-600 dark:text-red-400"
      case "medium":
        return "text-yellow-600 dark:text-yellow-400"
      default:
        return "text-green-600 dark:text-green-400"
    }
  }

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800"
      case "medium":
        return "bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800"
      default:
        return "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
    }
  }

  return (
    <div className="min-h-screen ">
      <main className="container mx-auto p-4 md:p-8">
        {/* Enhanced Header */}
        <div className="mb-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent-foreground rounded-xl flex items-center justify-center shadow-lg">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent-foreground bg-clip-text text-transparent">
                Security Event Monitor
              </h1>
              <p className="text-lg text-muted-foreground">
                Real-time security events with AI-powered analysis and insights
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl border border-white/20 dark:border-slate-700/50 text-center">
              <Activity className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="text-lg font-bold">{securityEvents.length}</div>
              <div className="text-xs text-muted-foreground">Total Events</div>
            </div>
            <div className="p-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl border border-white/20 dark:border-slate-700/50 text-center">
              <AlertTriangle className="h-6 w-6 mx-auto mb-2 text-red-600" />
              <div className="text-lg font-bold">
                {securityEvents.filter((e) => getEventSeverity(e) === "high").length}
              </div>
              <div className="text-xs text-muted-foreground">High Risk</div>
            </div>
            <div className="p-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl border border-white/20 dark:border-slate-700/50 text-center">
              <Shield className="h-6 w-6 mx-auto mb-2 text-accent-foreground" />
              <div className="text-lg font-bold">
                {securityEvents.filter((e) => getEventSeverity(e) === "low").length}
              </div>
              <div className="text-xs text-muted-foreground">Resolved</div>
            </div>
            <div className="p-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl border border-white/20 dark:border-slate-700/50 text-center">
              <Clock className="h-6 w-6 mx-auto mb-2 text-purple-600" />
              <div className="text-lg font-bold">24/7</div>
              <div className="text-xs text-muted-foreground">Monitoring</div>
            </div>
          </div>
        </div>

        {/* Enhanced Event Table */}
        <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-white/20 dark:border-slate-700/50 shadow-xl">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              <CardTitle>Recent Security Events</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground">
              Click &ldquo;Ask AI&ldquo; to get detailed analysis and recommendations for any security event
            </p>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-slate-200 dark:border-slate-700">
                    <TableHead className="font-semibold">Security Event</TableHead>
                    <TableHead className="font-semibold">Source</TableHead>
                    <TableHead className="font-semibold">Timestamp</TableHead>
                    <TableHead className="text-right font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {securityEvents.map((event, index) => {
                    const severity = getEventSeverity(event)
                    return (
                      <TableRow key={index} className="hover:bg-white/80 dark:hover:bg-slate-800/80 transition-colors">
                        <TableCell className="py-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-3 h-3 rounded-full ${
                                  severity === "high"
                                    ? "bg-red-500"
                                    : severity === "medium"
                                      ? "bg-yellow-500"
                                      : "bg-green-500"
                                }`}
                              />
                              <span className="font-medium text-foreground">{event.type}</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {event.riskScore && (
                                <Badge
                                  variant={event.riskScore > 0.8 ? "destructive" : "secondary"}
                                  className="text-xs"
                                >
                                  Risk Score: {event.riskScore}
                                </Badge>
                              )}
                              {event.abuseConfidence && (
                                <Badge
                                  variant={event.abuseConfidence > 70 ? "destructive" : "secondary"}
                                  className="text-xs"
                                >
                                  Abuse: {event.abuseConfidence}%
                                </Badge>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="space-y-1">
                            {event.user && (
                              <div className="flex items-center gap-1 text-sm">
                                <User className="h-3 w-3 text-muted-foreground" />
                                <span>{event.user}</span>
                              </div>
                            )}
                            {event.ip && (
                              <div className="flex items-center gap-1 text-sm font-mono">
                                <Globe className="h-3 w-3 text-muted-foreground" />
                                <span>{event.ip}</span>
                              </div>
                            )}
                            {event.device && <div className="text-xs text-muted-foreground">{event.device}</div>}
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center gap-1 text-sm">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span>{new Date(event.timestamp).toLocaleString()}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right py-4">
                          {/* Here is our trigger component, passing the event data as a prop */}
                          <CopilotTrigger event={event} />
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Empty State */}
            {securityEvents.length === 0 && (
              <div className="text-center py-12">
                <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="font-semibold text-foreground mb-2">No Security Events</h3>
                <p className="text-sm text-muted-foreground">All systems are secure and operating normally.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Assistant Info */}
        <div className="mt-8 p-6 bg-gradient-to-r from-accent to-accent/50 dark:from-accent/30 dark:to-accent/20 rounded-xl border border-accent-foreground dark:border-accent-foreground">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent-foreground rounded-xl flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-accent-foreground dark:text-accent-foreground mb-2">TrustShield AI Assistant</h3>
              <p className="text-sm text-accent-foreground/80 dark:text-accent-foreground/80 mb-3">
                Get instant, contextual analysis of any security event. Our AI assistant can explain threats, suggest
                remediation steps, and provide risk assessments in real-time.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className="text-xs bg-accent border-accent-foreground"
                >
                  Real-time Analysis
                </Badge>
                <Badge
                  variant="outline"
                  className="text-xs bg-accent border-accent-foreground"
                >
                  Threat Intelligence
                </Badge>
                <Badge
                  variant="outline"
                  className="text-xs bg-accent border-accent-foreground"
                >
                  Risk Assessment
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
