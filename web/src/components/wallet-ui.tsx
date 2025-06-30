// File: components/wallet-ui.tsx

"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Shield, Wine, Wallet, User, Lock, Zap } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function WalletUI() {
  const { user } = useUser()
  const [isAgeVerified, setIsAgeVerified] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  // This simulates presenting a Verifiable Credential from the user's wallet.
  const handleVerifyAge = () => {
    setShowSuccess(false)
    // In a real scenario, this would trigger a cryptographic handshake
    // with the user's digital wallet app (e.g., via QR code or NFC).
    // For this mock, we'll just simulate a successful verification.
    setTimeout(() => {
      setIsAgeVerified(true)
      setShowSuccess(true)
    }, 1000)
  }

  if (!user) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center space-y-2">
            <Lock className="h-8 w-8 text-muted-foreground mx-auto" />
            <p className="text-muted-foreground">Please sign in to access your TrustShield Wallet</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-primary" />
          <CardTitle>TrustShield Digital Wallet</CardTitle>
        </div>
        <CardDescription>
          Welcome back, {user.firstName}! Manage your secure credentials and transactions.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* User Profile Section */}
        <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <div className="font-medium">
              {user.firstName} {user.lastName}
            </div>
            <div className="text-sm text-muted-foreground">{user.emailAddresses[0]?.emailAddress}</div>
          </div>
          <Badge variant="secondary" className="text-xs">
            Verified
          </Badge>
        </div>

        <Separator />

        {/* Verifiable Credentials Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">My Verifiable Credentials</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between p-4 border rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="font-semibold text-green-800 dark:text-green-200">Digital Identity</p>
                  <p className="text-xs text-green-600 dark:text-green-400">Issued by Walmart TrustShield</p>
                </div>
              </div>
              <div className="text-right">
                <Badge
                  variant="secondary"
                  className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                >
                  Active
                </Badge>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">Quantum-Safe</p>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Age Verification Demo */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Live Transaction Demo</span>
          </div>

          <div className="p-4 border rounded-lg bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-3 mb-3">
              <Wine className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              <div>
                <p className="font-medium">Age-Restricted Purchase</p>
                <p className="text-sm text-muted-foreground">Attempting to purchase: Premium Wine Collection</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Verification Required:</span>
              <Badge variant="outline" className="text-xs">
                21+ Years
              </Badge>
            </div>
          </div>
        </div>

        {/* Success Alert */}
        {showSuccess && (
          <Alert className="bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800">
            <CheckCircle className="h-4 w-4 text-green-700 dark:text-green-400" />
            <AlertTitle className="text-green-800 dark:text-green-200">Verification Successful!</AlertTitle>
            <AlertDescription className="text-green-700 dark:text-green-300">
              Age confirmed as &quot;Over 21&quot; using zero-knowledge proof. Your privacy was preserved - no personal
              data was shared.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>

      <CardFooter>
        <Button className="w-full h-11" onClick={handleVerifyAge} disabled={isAgeVerified} size="lg">
          {isAgeVerified ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Age Successfully Verified
            </>
          ) : (
            <>
              <Shield className="mr-2 h-4 w-4" />
              Verify Age with Digital Credential
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
