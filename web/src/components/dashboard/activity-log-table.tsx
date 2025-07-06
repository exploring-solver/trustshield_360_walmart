/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/dashboard/activity-log-table.tsx
"use client" // This component is now interactive

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import type { ActivityEvent } from "@/lib/data" // Assuming this is your data type
import { AlertCircle, Loader2, ShieldCheck, Search, Globe, Server } from "lucide-react"

// Define a type for the API response data for better type-safety
interface IpCheckResult {
  data: {
    ipAddress: string
    isPublic: boolean
    abuseConfidenceScore: number
    countryName: string
    usageType: string
    isp: string
    domain: string
    totalReports: number
    lastReportedAt: string
  }
}

export function ActivityLogTable({ activities }: { activities: ActivityEvent[] }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedIp, setSelectedIp] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [ipData, setIpData] = useState<IpCheckResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleCheckIp = async (ip: string) => {
    setSelectedIp(ip)
    setIsDialogOpen(true)
    setIsLoading(true)
    setError(null)
    setIpData(null)

    try {
      const response = await fetch("/api/check-ip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ipAddress: ip }),
      })

      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.error || "An unknown error occurred")
      }

      setIpData(result)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const getRiskBadgeVariant = (level: "Low" | "Medium" | "High") => {
    switch (level) {
      case "High":
        return "destructive"
      case "Medium":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getRiskColor = (level: "Low" | "Medium" | "High") => {
    switch (level) {
      case "High":
        return "text-red-600 dark:text-red-400"
      case "Medium":
        return "text-yellow-600 dark:text-yellow-400"
      default:
        return "text-green-600 dark:text-green-400"
    }
  }

  return (
    <>
      <div className="rounded-lg border bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-slate-200 dark:border-slate-700">
              <TableHead className="font-semibold">Security Event</TableHead>
              <TableHead className="hidden md:table-cell font-semibold">Device Info</TableHead>
              <TableHead className="font-semibold">IP Address</TableHead>
              <TableHead className="text-right font-semibold">Risk Level</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activities.map((activity) => (
              <TableRow key={activity.id} className="hover:bg-white/80 dark:hover:bg-slate-800/80 transition-colors">
                <TableCell className="py-4">
                  <div className="space-y-1">
                    <div className="font-medium text-foreground">{activity.event}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {activity.date}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell py-4">
                  <div className="flex items-center gap-2">
                    <Server className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{activity.device}</span>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 font-mono text-sm bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                      <Globe className="h-3 w-3 text-muted-foreground" />
                      {activity.ipAddress}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCheckIp(activity.ipAddress)}
                      className="hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700"
                    >
                      <Search className="mr-1 h-3 w-3" />
                      Analyze
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="text-right py-4">
                  <Badge variant={getRiskBadgeVariant(activity.riskLevel)} className={getRiskColor(activity.riskLevel)}>
                    {activity.riskLevel}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              IP Reputation Analysis
            </DialogTitle>
            <DialogDescription>
              Live threat intelligence analysis from AbuseIPDB for IP:{" "}
              <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-sm">{selectedIp}</code>
            </DialogDescription>
          </DialogHeader>

          {isLoading && (
            <div className="flex items-center justify-center p-12">
              <div className="text-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
                <div>
                  <p className="font-medium">Analyzing IP Reputation...</p>
                  <p className="text-sm text-muted-foreground">Checking against global threat databases</p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="p-6 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center gap-3 text-red-700 dark:text-red-300">
                <AlertCircle className="h-6 w-6 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Analysis Failed</p>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          {ipData && (
            <div className="space-y-6">
              {/* Threat Score */}
              <div
                className={`p-6 rounded-xl flex items-center gap-4 ${
                  ipData.data.abuseConfidenceScore > 50
                    ? "bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800"
                    : "bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800"
                }`}
              >
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center ${
                    ipData.data.abuseConfidenceScore > 50
                      ? "bg-red-100 dark:bg-red-900"
                      : "bg-green-100 dark:bg-green-900"
                  }`}
                >
                  <ShieldCheck
                    className={`h-8 w-8 ${
                      ipData.data.abuseConfidenceScore > 50
                        ? "text-red-600 dark:text-red-400"
                        : "text-green-600 dark:text-green-400"
                    }`}
                  />
                </div>
                <div>
                  <p className="text-2xl font-bold mb-1">Threat Score: {ipData.data.abuseConfidenceScore}%</p>
                  <p className="text-sm">
                    {ipData.data.abuseConfidenceScore > 50
                      ? "⚠️ This IP address is flagged as suspicious"
                      : "✅ This IP address appears to be safe"}
                  </p>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <h4 className="font-semibold text-foreground">Location & Network</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Country:</span>
                      <span className="font-medium">{ipData.data.countryName || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ISP:</span>
                      <span className="font-medium">{ipData.data.isp || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Usage Type:</span>
                      <span className="font-medium">{ipData.data.usageType || "N/A"}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-foreground">Threat Intelligence</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Reports:</span>
                      <span className="font-medium">{ipData.data.totalReports}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Reported:</span>
                      <span className="font-medium">
                        {ipData.data.lastReportedAt
                          ? new Date(ipData.data.lastReportedAt).toLocaleDateString()
                          : "Never"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Public IP:</span>
                      <span className="font-medium">{ipData.data.isPublic ? "Yes" : "No"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
