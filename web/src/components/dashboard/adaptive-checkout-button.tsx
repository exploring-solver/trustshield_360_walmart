/* eslint-disable @typescript-eslint/no-explicit-any */
// File: src/components/dashboard/adaptive-checkout-button.tsx
"use client"

import { useRef } from "react"
import { useState, useEffect, useCallback } from "react"
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Loader2, ShieldCheck, ShieldAlert, Shield, CheckCircle, XCircle, Zap, Lock } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"

// --- NEW: This component will hold the full transaction logic ---
export default function AdaptiveCheckoutButton() {
  const { user } = useUser()
  const [trustScore, setTrustScore] = useState(0.7)
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false) // For transaction flow
  const [status, setStatus] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null)

  // --- Behavioral Biometrics Simulation (Optimized) ---
  const [mouseSpeed, setMouseSpeed] = useState(0)
  const mouseSpeedRef = useRef(mouseSpeed)
  const lastUpdateRef = useRef(0)

  useEffect(() => {
    let lastPos = { x: 0, y: 0 }

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now()
      const speed = Math.sqrt(Math.pow(e.pageX - lastPos.x, 2) + Math.pow(e.pageY - lastPos.y, 2))
      lastPos = { x: e.pageX, y: e.pageY }

      // Only update if significant movement and not too frequent
      if (speed > 5 && now - lastUpdateRef.current > 1000) {
        setMouseSpeed(speed)
        mouseSpeedRef.current = speed
        lastUpdateRef.current = now
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // --- Trust Score Fetching Logic (No changes needed) ---
  const getTrustScore = useCallback(async () => {
    if (!user) return
    setIsLoading(true)
    const behavioralScoreAdjustment =
      mouseSpeedRef.current > 150 || (mouseSpeedRef.current < 2 && mouseSpeedRef.current > 0) ? -0.1 : 0.02

    const res = await fetch("/api/trust-score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, behavioralScoreAdjustment }),
    })
    if (res.ok) {
      const data = await res.json()
      setTrustScore(data.trustScore)
    }
    setIsLoading(false)
  }, [user])

  useEffect(() => {
    if (user) getTrustScore()
    const interval = setInterval(() => {
      if (user) getTrustScore()
    }, 30000) // Reduced from 5s to 30s
    return () => clearInterval(interval)
  }, [user, getTrustScore])

  // --- NEW: Full Transaction Flow Logic ---
  const executeTransactionFlow = async () => {
    setIsProcessing(true)
    setStatus({ type: "info", message: "Initiating secure transaction..." })
    // Dummy transaction data
    const transactionData = { amount: 125.5, items: [{ name: "Groceries", quantity: 1 }] }

    try {
      // Step 1: PQC Handshake (can be skipped for highest trust)
      if (trustScore < 0.8) {
        setStatus({ type: "info", message: "Performing PQC Handshake..." })
        const handshakeRes = await fetch("/api/crypto/handshake", { method: "POST" })
        if (!handshakeRes.ok) throw new Error("Handshake Failed")
      }

      // Step 2: AI Cortex Analysis
      setStatus({ type: "info", message: "Analyzing transaction with AI Cortex..." })
      const cortexRes = await fetch("/api/cortex", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...transactionData, timestamp: new Date().toISOString() }),
      })
      if (!cortexRes.ok) throw new Error("AI Cortex Failed")
      const cortexData = await cortexRes.json()

      // Step 3: Conditional Blockchain Logging
      if (cortexData.riskScore >= 0.8) {
        throw new Error(`Transaction Blocked by AI. High Risk Score: ${cortexData.riskScore}`)
      }

      setStatus({ type: "info", message: "Logging to immutable blockchain..." })
      const blockchainRes = await fetch("/api/blockchain/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transactionId: cortexData.transactionId,
          amount: transactionData.amount,
          riskScore: cortexData.riskScore,
        }),
      })
      if (!blockchainRes.ok) throw new Error("Blockchain Logging Failed")
      const blockchainData = await blockchainRes.json()

      setStatus({ type: "success", message: `Success! Tx Hash: ${blockchainData.transactionHash}` })
    } catch (error: any) {
      setStatus({ type: "error", message: error.message })
    } finally {
      setIsProcessing(false)
    }
  }

  // --- NEW: HandleClick with different paths based on trust score ---
  const handleClick = () => {
    setStatus(null) // Clear previous status
    if (trustScore < 0.5) {
      setStatus({ type: "error", message: "Security check failed. Please contact support." })
      return
    }
    executeTransactionFlow()
  }

  const getButtonState = () => {
    if (isLoading || isProcessing) {
      return {
        text: isProcessing ? "Processing Transaction..." : "Analyzing Trust Score...",
        color: "bg-slate-500 hover:bg-slate-600",
        icon: <Loader2 className="mr-2 h-4 w-4 animate-spin" />,
      }
    }
    if (trustScore > 0.8) {
      return {
        text: "Express Checkout",
        color: "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700",
        icon: <Zap className="mr-2 h-4 w-4" />,
      }
    }
    if (trustScore >= 0.5) {
      return {
        text: "Secure Checkout",
        color: "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700",
        icon: <Shield className="mr-2 h-4 w-4" />,
      }
    }
    return {
      text: "Enhanced Security Required",
      color: "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black",
      icon: <ShieldAlert className="mr-2 h-4 w-4" />,
    }
  }

  const { text, color, icon } = getButtonState()

  if (!user) {
    return (
      <Card className="w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-white/20 dark:border-slate-700/50 shadow-xl">
        <CardContent className="flex items-center justify-center h-32">
          <div className="text-center space-y-2">
            <Lock className="h-8 w-8 text-muted-foreground mx-auto" />
            <p className="text-muted-foreground">Please sign in to access adaptive checkout</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-white/20 dark:border-slate-700/50 shadow-xl">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <CardTitle>Adaptive Checkout System</CardTitle>
        </div>
        <CardDescription>
          Intelligent checkout flow powered by real-time trust scoring and behavioral analysis
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Trust Score Display */}
        <div className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-muted-foreground">Live Trust Score</span>
            <span className="text-lg font-bold font-mono">{trustScore.toFixed(3)}</span>
          </div>
          <Progress value={trustScore * 100} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>Low Trust</span>
            <span>High Trust</span>
          </div>
        </div>

        {/* Checkout Button */}
        <Button
          className={`w-full h-12 text-white font-medium text-base ${color} shadow-lg transition-all duration-200`}
          onClick={handleClick}
          disabled={isLoading || isProcessing}
        >
          {icon}
          {text}
        </Button>

        {/* Status Display */}
        {status && (
          <Alert
            className={`border-2 ${
              status.type === "error"
                ? "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30"
                : status.type === "success"
                  ? "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30"
                  : "border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30"
            }`}
          >
            {status.type === "success" && <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />}
            {status.type === "error" && <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />}
            {status.type === "info" && <Loader2 className="h-4 w-4 animate-spin text-blue-600 dark:text-blue-400" />}
            <AlertTitle className="font-semibold">
              {status.type === "success"
                ? "Transaction Complete"
                : status.type === "error"
                  ? "Transaction Failed"
                  : "Processing"}
            </AlertTitle>
            <AlertDescription className="break-words text-sm">{status.message}</AlertDescription>
          </Alert>
        )}

        {/* Security Features */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t">
          <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
            <Shield className="h-5 w-5 mx-auto mb-1 text-blue-600 dark:text-blue-400" />
            <div className="text-xs font-medium">Quantum-Safe</div>
          </div>
          <div className="text-center p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
            <Zap className="h-5 w-5 mx-auto mb-1 text-purple-600 dark:text-purple-400" />
            <div className="text-xs font-medium">AI-Powered</div>
          </div>
          <div className="text-center p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
            <CheckCircle className="h-5 w-5 mx-auto mb-1 text-green-600 dark:text-green-400" />
            <div className="text-xs font-medium">Blockchain</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
