/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Suspense, useEffect } from "react"
import FraudGraphWrapper from "@/components/fraud-graph-wrapper"
import VisionGuardUI from "@/components/vision-guard-ui"
import WalletUI from "@/components/wallet-ui"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Info, Shield, Brain, Eye, TrendingUp } from "lucide-react"
import React from "react"

// Mock Cortex Caller component for demonstration
function CortexDemo() {
  // A normal transaction
  const normalTransaction = {
    id: "txn_123",
    amount: 85.5,
    items: [{ name: "Groceries", quantity: 5 }],
    timestamp: new Date().toISOString(),
    shippingAddress: { city: "Bentonville" },
    billingAddress: { city: "Bentonville" },
  }

  // A fraudulent transaction
  const fraudTransaction = {
    id: "txn_456",
    amount: 1500.0,
    items: [
      { name: "Laptop", quantity: 1 },
      { name: "Gift Card", quantity: 3 },
    ],
    timestamp: new Date(new Date().setUTCHours(3)).toISOString(), // 3 AM
    shippingAddress: { city: "Miami" },
    billingAddress: { city: "New York" },
  }

  const analyze = async (transaction: any) => {
    // Use absolute URL for server-side fetch
    const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000"
    const res = await fetch(`${baseUrl}/api/cortex`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(transaction),
      cache: "no-store",
    })
    return res.json()
  }

  const [normalResult, setNormalResult] = React.useState<any>(null)
  const [fraudResult, setFraudResult] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const normal = await analyze(normalTransaction)
        const fraud = await analyze(fraudTransaction)
        setNormalResult(normal)
        setFraudResult(fraud)
      } catch (error) {
        console.error("Error analyzing transactions:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [])

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <Brain className="h-8 w-8 animate-pulse text-primary mx-auto mb-2" />
            <p className="text-muted-foreground">Loading AI Cortex Analysis...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <CardTitle>AI Fraud Cortex Analysis</CardTitle>
        </div>
        <Alert className="mt-4">
          <Info className="h-4 w-4" />
          <AlertTitle>Live Simulation Results</AlertTitle>
          <AlertDescription>
            The following are real-time results from the AI Fraud Cortex API analyzing transaction patterns.
          </AlertDescription>
        </Alert>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Normal Transaction */}
        <div className="p-6 border rounded-lg bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-green-800 dark:text-green-200">Normal Transaction Analysis</h4>
            <Badge variant="secondary" className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
              Low Risk
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{normalResult?.riskScore}</div>
              <div className="text-sm text-muted-foreground">Risk Score</div>
            </div>
            <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border">
              <div className="text-lg font-semibold text-green-600 dark:text-green-400">{normalResult?.status}</div>
              <div className="text-sm text-muted-foreground">Status</div>
            </div>
            <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border">
              <div className="text-lg font-semibold">$85.50</div>
              <div className="text-sm text-muted-foreground">Amount</div>
            </div>
          </div>

          <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border">
            <p className="text-sm font-medium mb-2">Analysis Summary:</p>
            <p className="text-sm text-muted-foreground">{normalResult?.explanations?.join(" ")}</p>
          </div>
        </div>

        {/* Fraudulent Transaction */}
        <div className="p-6 border rounded-lg bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-red-800 dark:text-red-200">Suspicious Transaction Analysis</h4>
            <Badge variant="destructive">High Risk</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">{fraudResult?.riskScore}</div>
              <div className="text-sm text-muted-foreground">Risk Score</div>
            </div>
            <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border">
              <div className="text-lg font-semibold text-red-600 dark:text-red-400">{fraudResult?.status}</div>
              <div className="text-sm text-muted-foreground">Status</div>
            </div>
            <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border">
              <div className="text-lg font-semibold">$1,500.00</div>
              <div className="text-sm text-muted-foreground">Amount</div>
            </div>
          </div>

          <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border">
            <p className="text-sm font-medium mb-2">Risk Factors Detected:</p>
            <ul className="space-y-1">
              {fraudResult?.explanations?.map((exp: string, i: number) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  {exp}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function DashboardPage() {
  useEffect(() => {
    const seedGraph = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000"
        const response = await fetch(`${baseUrl}/api/seed-graph`, {
          method: "GET",
          cache: "no-store",
        })
        
        if (response.ok) {
          console.log("Graph seeded successfully")
        } else {
          console.error("Failed to seed graph")
        }
      } catch (error) {
        console.error("Error seeding graph:", error)
      }
    }

    seedGraph()
  }, [])

  return (
    <main className="container mx-auto p-4 md:p-8 min-h-screen">
      {/* Header Section */}
      <div className="mb-8 text-center space-y-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Shield className="h-8 w-8 text-primary" />
          <Badge variant="secondary" className="text-sm font-medium">
            TrustShield 360
          </Badge>
        </div>
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          ShopLifter&apos;s 360
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          A unified view of next-generation retail security powered by quantum-safe cryptography, AI fraud detection,
          and blockchain verification.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-4 text-center">
          <Brain className="h-6 w-6 mx-auto mb-2 text-blue-500" />
          <div className="text-2xl font-bold">99.7%</div>
          <div className="text-sm text-muted-foreground">Fraud Detection Rate</div>
        </Card>
        <Card className="p-4 text-center">
          <Shield className="h-6 w-6 mx-auto mb-2 text-green-500" />
          <div className="text-2xl font-bold">256-bit</div>
          <div className="text-sm text-muted-foreground">Quantum-Safe Encryption</div>
        </Card>
        <Card className="p-4 text-center">
          <Eye className="h-6 w-6 mx-auto mb-2 text-purple-500" />
          <div className="text-2xl font-bold">24/7</div>
          <div className="text-sm text-muted-foreground">Vision Monitoring</div>
        </Card>
        <Card className="p-4 text-center">
          <TrendingUp className="h-6 w-6 mx-auto mb-2 text-orange-500" />
          <div className="text-2xl font-bold">$2.3M</div>
          <div className="text-sm text-muted-foreground">Fraud Prevented</div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* AI Cortex Demo - Full Width */}
        <div className="xl:col-span-3">
          <Suspense
            fallback={
              <Card className="w-full">
                <CardContent className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <Brain className="h-8 w-8 animate-pulse text-primary mx-auto mb-2" />
                    <p className="text-muted-foreground">Loading AI Cortex Analysis...</p>
                  </div>
                </CardContent>
              </Card>
            }
          >
            <CortexDemo />
          </Suspense>
        </div>

        {/* Left Column */}
        <div className="space-y-8">
          <WalletUI />
          <VisionGuardUI />
        </div>

        {/* Right Column - Fraud Graph */}
        <div className="xl:col-span-2">
          <Suspense
            fallback={
              <Card className="w-full">
                <CardContent className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <TrendingUp className="h-8 w-8 animate-pulse text-primary mx-auto mb-2" />
                    <p className="text-muted-foreground">Loading Fraud Network Analysis...</p>
                  </div>
                </CardContent>
              </Card>
            }
          >
            <FraudGraphWrapper />
          </Suspense>
        </div>
      </div>
    </main>
  )
}
