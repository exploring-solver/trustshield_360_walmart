/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, XCircle, Loader2, Shield, Zap, Database, Brain, Lock } from "lucide-react"

// Enhanced StatusLog component with better styling
const StatusLog = ({ logs }: { logs: string[] }) => {
  const getStepInfo = (log: string, index: number) => {
    let Icon = Loader2
    let color = "text-blue-500 dark:text-blue-400"
    let bgColor = "bg-blue-50 dark:bg-blue-950/30"
    let borderColor = "border-blue-200 dark:border-blue-800"
    let stepIcon = Lock

    if (log.includes("✓")) {
      Icon = CheckCircle
      color = "text-green-600 dark:text-green-400"
      bgColor = "bg-green-50 dark:bg-green-950/30"
      borderColor = "border-green-200 dark:border-green-800"
    } else if (log.includes("✗")) {
      Icon = XCircle
      color = "text-red-600 dark:text-red-400"
      bgColor = "bg-red-50 dark:bg-red-950/30"
      borderColor = "border-red-200 dark:border-red-800"
    }

    // Assign step-specific icons
    if (log.includes("PQC Handshake")) stepIcon = Shield
    else if (log.includes("AI Fraud Cortex") || log.includes("AI Cortex")) stepIcon = Brain
    else if (log.includes("blockchain") || log.includes("ledger")) stepIcon = Database

    return { Icon, color, bgColor, borderColor, stepIcon }
  }

  if (logs.length === 0) {
    return (
      <div className="w-full p-8 mt-6 text-center border-2 border-dashed border-muted-foreground/25 rounded-lg">
        <Zap className="h-8 w-8 mx-auto mb-3 text-muted-foreground/50" />
        <p className="text-sm text-muted-foreground">Transaction log will appear here once processing begins</p>
      </div>
    )
  }

  return (
    <div className="w-full mt-6 space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <Database className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-medium text-muted-foreground">Transaction Log</h3>
      </div>

      {logs.map((log, index) => {
        const { Icon, color, bgColor, borderColor, stepIcon: StepIcon } = getStepInfo(log, index)

        return (
          <div key={index} className={`p-4 rounded-lg border ${bgColor} ${borderColor} transition-all duration-200`}>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 flex items-center gap-2">
                <div className={`p-1.5 rounded-full ${bgColor}`}>
                  <StepIcon className="h-3 w-3 text-muted-foreground" />
                </div>
                <Icon className={`h-4 w-4 ${color} ${Icon === Loader2 ? "animate-spin" : ""}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${color}`}>{log}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function SecureFlowPage() {
  const [amount, setAmount] = useState<string>("125.50")
  const [items, setItems] = useState<string>("Groceries and a bottle of wine")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [logs, setLogs] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [finalResult, setFinalResult] = useState<{ type: "success" | "failure"; message: string } | null>(null)

  const processSecureTransaction = async () => {
    setIsLoading(true)
    setError(null)
    setLogs([])
    setFinalResult(null)

    try {
      // --- STEP 1: PQC HANDSHAKE ---
      setLogs((prev) => [...prev, "1. Performing PQC Handshake..."])

      const handshakeRes = await fetch("/api/crypto/handshake", { method: "POST" })
      if (!handshakeRes.ok) throw new Error("PQC Handshake failed.")

      await handshakeRes.json()
      setLogs((prev) => [...prev.slice(0, -1), "1. PQC Handshake Complete ✓"])

      // --- STEP 2: AI CORTEX ANALYSIS ---
      setLogs((prev) => [...prev, "2. Sending transaction to AI Fraud Cortex..."])

      const transactionData = {
        amount: Number.parseFloat(amount),
        items: [{ name: items, quantity: 1 }],
        timestamp: new Date().toISOString(),
        shippingAddress: { city: "Bentonville" },
        billingAddress: { city: "Bentonville" },
      }

      const cortexRes = await fetch("/api/cortex", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transactionData),
      })

      if (!cortexRes.ok) throw new Error("AI Cortex analysis failed.")

      const cortexData = await cortexRes.json()
      setLogs((prev) => [
        ...prev.slice(0, -1),
        `2. AI Cortex Analysis Complete ✓ (Risk Score: ${cortexData.riskScore})`,
      ])

      // --- STEP 3: BLOCKCHAIN LOGGING (CONDITIONAL) ---
      if (cortexData.riskScore >= 0.8) {
        setLogs((prev) => [...prev, "3. High risk score detected. Transaction blocked by policy. ✗"])
        setFinalResult({
          type: "failure",
          message: `Transaction Blocked. The AI Cortex flagged this transaction with a high risk score of ${cortexData.riskScore}.`,
        })
        return
      }

      setLogs((prev) => [...prev, "3. Logging verified transaction to the immutable ledger..."])

      const blockchainRes = await fetch("/api/blockchain/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transactionId: cortexData.transactionId,
          amount: transactionData.amount,
          riskScore: cortexData.riskScore,
        }),
      })

      if (!blockchainRes.ok) throw new Error("Blockchain logging failed.")

      const blockchainData = await blockchainRes.json()
      const finalLogMessage = `3. Transaction logged to blockchain ✓`

      setLogs((prev) => [...prev.slice(0, -1), finalLogMessage])
      setFinalResult({
        type: "success",
        message: `Transaction successfully recorded on the blockchain with hash: ${blockchainData.transactionHash}`,
      })
    } catch (err: any) {
      const errorMessage = err.message || "An unknown error occurred."
      setError(errorMessage)
      setLogs((prev) => [...prev.slice(0, -1), `${prev.length}. Operation Failed ✗`])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="container mx-auto p-4 md:p-8 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="text-center space-y-2 mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="h-6 w-6 text-primary" />
            <Badge variant="secondary" className="text-xs font-medium">
              TrustShield 360
            </Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Secure Transaction Flow</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Experience the complete transaction lifecycle from quantum-safe handshake to immutable blockchain record
          </p>
        </div>

        {/* Main Card */}
        <Card className="w-full shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              Transaction Details
            </CardTitle>
            <CardDescription>Enter your transaction information to test the end-to-end security flow</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Form Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg border">
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-sm font-medium">
                  Transaction Amount
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="125.50"
                    className="pl-8"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="items" className="text-sm font-medium">
                  Item Description
                </Label>
                <Input
                  id="items"
                  value={items}
                  onChange={(e) => setItems(e.target.value)}
                  placeholder="Groceries and electronics"
                />
              </div>
            </div>

            <Separator />

            {/* Status Log Section */}
            <StatusLog logs={logs} />

            {/* Error Alert */}
            {error && (
              <Alert variant="destructive" className="border-red-200 dark:border-red-800">
                <XCircle className="h-4 w-4" />
                <AlertTitle className="font-semibold">Transaction Failed</AlertTitle>
                <AlertDescription className="mt-1">{error}</AlertDescription>
              </Alert>
            )}

            {/* Final Result Alert */}
            {finalResult && (
              <Alert
                variant={finalResult.type === "success" ? "default" : "destructive"}
                className={`${
                  finalResult.type === "success"
                    ? "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30"
                    : "border-red-200 dark:border-red-800"
                }`}
              >
                {finalResult.type === "success" ? (
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
                <AlertTitle className="font-semibold">
                  {finalResult.type === "success" ? "Transaction Complete" : "Transaction Blocked"}
                </AlertTitle>
                <AlertDescription className="mt-1 break-words">{finalResult.message}</AlertDescription>
              </Alert>
            )}
          </CardContent>

          <CardFooter className="pt-4">
            <Button
              className="w-full h-11 text-base font-medium"
              onClick={processSecureTransaction}
              disabled={isLoading}
              size="lg"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Processing Secure Transaction..." : "Process Secure Transaction"}
            </Button>
          </CardFooter>
        </Card>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <Card className="p-4 text-center">
            <Shield className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <h3 className="font-semibold text-sm">Quantum-Safe</h3>
            <p className="text-xs text-muted-foreground mt-1">Post-quantum cryptography</p>
          </Card>

          <Card className="p-4 text-center">
            <Brain className="h-8 w-8 mx-auto mb-2 text-purple-500" />
            <h3 className="font-semibold text-sm">AI-Powered</h3>
            <p className="text-xs text-muted-foreground mt-1">Real-time fraud detection</p>
          </Card>

          <Card className="p-4 text-center">
            <Database className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <h3 className="font-semibold text-sm">Blockchain Verified</h3>
            <p className="text-xs text-muted-foreground mt-1">Immutable transaction log</p>
          </Card>
        </div>
      </div>
    </main>
  )
}
