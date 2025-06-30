/* eslint-disable @typescript-eslint/no-explicit-any */
// File: components/fraud-graph.tsx

"use client"

import { useEffect, useRef, useState } from "react"
import { Network } from "vis-network/standalone/esm/vis-network"
import "vis-network/styles/vis-network.css"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Loader2, NetworkIcon, AlertTriangle } from "lucide-react"

export default function FraudGraph() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [graphData, setGraphData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchGraphData() {
      try {
        const res = await fetch("/api/fraud-rings")
        if (!res.ok) throw new Error("Failed to fetch fraud ring data")
        const data = await res.json()
        setGraphData(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchGraphData()
  }, [])

  useEffect(() => {
    if (containerRef.current && graphData) {
      const options = {
        layout: {
          hierarchical: false,
          randomSeed: 2,
        },
        edges: {
          color: {
            color: "#64748b",
            highlight: "#ef4444",
            hover: "#f97316",
          },
          width: 2,
          smooth: {
            enabled: true,
            type: "continuous",
            roundness: 0.5,
          },
        },
        nodes: {
          shape: "dot",
          size: 25,
          font: {
            size: 12,
            color: "#ffffff",
          },
          borderWidth: 2,
          shadow: true,
        },
        groups: {
          user: {
            color: {
              background: "#3b82f6",
              border: "#1e40af",
              highlight: { background: "#2563eb", border: "#1d4ed8" },
            },
            font: { color: "white" },
          },
          device: {
            color: {
              background: "#ef4444",
              border: "#b91c1c",
              highlight: { background: "#dc2626", border: "#991b1b" },
            },
            font: { color: "white" },
            shape: "square",
          },
        },
        height: "500px",
        physics: {
          enabled: true,
          stabilization: { iterations: 100 },
        },
        interaction: {
          hover: true,
          tooltipDelay: 200,
        },
      }

      const network = new Network(containerRef.current, graphData, options)

      return () => network.destroy()
    }
  }, [graphData])

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center gap-2">
            <NetworkIcon className="h-5 w-5 text-primary" />
            <CardTitle>Fraud Ring Network Analysis</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
              <p className="text-muted-foreground">Analyzing fraud network patterns...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center gap-2">
            <NetworkIcon className="h-5 w-5 text-primary" />
            <CardTitle>Fraud Ring Network Analysis</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Network Analysis Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <NetworkIcon className="h-5 w-5 text-primary" />
          <CardTitle>Fraud Ring Network Analysis</CardTitle>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-500"></div>
            <span className="text-sm text-muted-foreground">Users</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500"></div>
            <span className="text-sm text-muted-foreground">Devices</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-gray-400"></div>
            <span className="text-sm text-muted-foreground">Connections</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="p-6 pt-0">
          <div
            ref={containerRef}
            className="border rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"
            style={{ height: "500px" }}
          />
        </div>

        <Separator />

        <div className="p-4 bg-muted/30">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-medium">Network Insights</span>
          </div>
          <p className="text-sm text-muted-foreground">
            This visualization shows potential fraud rings detected by analyzing user behavior patterns, device
            fingerprints, and transaction relationships. Hover over nodes to explore connections.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
