'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { 
  Shield, 
  AlertTriangle, 
  Clock, 
  User,
  MapPin,
  Smartphone,
  CreditCard
} from 'lucide-react'
import ZeroTrustChallenge from '@/components/zero-trust-challenge'

export default function ZeroTrustDemoPage() {
  const [showChallenge, setShowChallenge] = useState(false)
  const [selectedScenario, setSelectedScenario] = useState<'high' | 'critical'>('high')
  const [challengeResult, setChallengeResult] = useState<{success: boolean, method?: string} | null>(null)

  const scenarios = {
    high: {
      riskLevel: 'HIGH' as const,
      transactionAmount: 850.00,
      challengeReason: 'Unusual purchase pattern detected: Electronics purchase at unusual hours with unrecognized device',
      description: 'High-risk scenario with multiple suspicious factors',
      riskFactors: [
        'Transaction at 2:30 AM',
        'Unrecognized device',
        'High-value electronics',
        'Location variance detected'
      ]
    },
    critical: {
      riskLevel: 'CRITICAL' as const,
      transactionAmount: 2100.00,
      challengeReason: 'Multiple critical security violations: Failed biometric verification, location mismatch (1,200 miles), and device sharing with known fraudulent accounts',
      description: 'Critical risk scenario requiring enhanced verification',
      riskFactors: [
        'Failed biometric verification (3 attempts)',
        'Extreme location mismatch (Miami vs Arkansas)',
        'Device associated with fraud ring',
        'Multiple high-value gift cards',
        'Velocity abuse pattern detected'
      ]
    }
  }

  const handleChallengeClose = (success: boolean, method?: string) => {
    setShowChallenge(false)
    setChallengeResult({ success, method })
  }

  const currentScenario = scenarios[selectedScenario]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto max-w-4xl p-4 md:p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="h-8 w-8 text-primary" />
            <Badge variant="secondary" className="text-sm font-medium">
              TrustShield 360
            </Badge>
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Zero Trust Challenge System
          </h1>
          <p className="text-xl text-muted-foreground">
            Step-up authentication for high-risk transactions
          </p>
        </div>

        {/* Scenario Selection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Demo Scenarios
            </CardTitle>
            <CardDescription>
              Choose a risk scenario to test the Zero Trust challenge system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card 
                className={`cursor-pointer transition-colors ${
                  selectedScenario === 'high' 
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/20' 
                    : 'hover:bg-muted/50'
                }`}
                onClick={() => setSelectedScenario('high')}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                      HIGH RISK
                    </Badge>
                    <span className="font-bold text-lg">$850.00</span>
                  </div>
                  <h4 className="font-medium mb-2">Suspicious Electronics Purchase</h4>
                  <p className="text-sm text-muted-foreground">
                    Late night purchase with unrecognized device
                  </p>
                </CardContent>
              </Card>

              <Card 
                className={`cursor-pointer transition-colors ${
                  selectedScenario === 'critical' 
                    ? 'border-red-500 bg-red-50 dark:bg-red-950/20' 
                    : 'hover:bg-muted/50'
                }`}
                onClick={() => setSelectedScenario('critical')}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="destructive">
                      CRITICAL RISK
                    </Badge>
                    <span className="font-bold text-lg">$2,100.00</span>
                  </div>
                  <h4 className="font-medium mb-2">Multiple Security Violations</h4>
                  <p className="text-sm text-muted-foreground">
                    Failed biometric + location mismatch + fraud ring
                  </p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Current Scenario Details */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Current Scenario: {currentScenario.riskLevel} Risk
            </CardTitle>
            <CardDescription>
              {currentScenario.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Transaction Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">${currentScenario.transactionAmount.toFixed(2)}</div>
                  <div className="text-xs text-muted-foreground">Transaction Amount</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">2:30 AM</div>
                  <div className="text-xs text-muted-foreground">Transaction Time</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">Miami, FL</div>
                  <div className="text-xs text-muted-foreground">Purchase Location</div>
                </div>
              </div>
            </div>

            {/* Risk Factors */}
            <div>
              <h4 className="font-medium mb-3">Detected Risk Factors:</h4>
              <div className="space-y-2">
                {currentScenario.riskFactors.map((factor, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 border rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <span className="text-sm">{factor}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trigger Button */}
            <Alert className={currentScenario.riskLevel === 'CRITICAL' ? 'border-red-200 bg-red-50 dark:bg-red-950/20' : 'border-orange-200 bg-orange-50 dark:bg-orange-950/20'}>
              <Shield className="h-4 w-4" />
              <AlertTitle>Zero Trust Challenge Required</AlertTitle>
              <AlertDescription className="mt-2">
                {currentScenario.challengeReason}
              </AlertDescription>
            </Alert>

            <Button 
              onClick={() => setShowChallenge(true)}
              className="w-full h-12 text-lg font-semibold"
              variant={currentScenario.riskLevel === 'CRITICAL' ? 'destructive' : 'default'}
            >
              <Shield className="h-5 w-5 mr-2" />
              Initiate Zero Trust Challenge
            </Button>
          </CardContent>
        </Card>

        {/* Challenge Result */}
        {challengeResult && (
          <Card className={challengeResult.success ? 'border-green-500 bg-green-50 dark:bg-green-950/20' : 'border-red-500 bg-red-50 dark:bg-red-950/20'}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {challengeResult.success ? (
                  <Shield className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                )}
                Challenge Result
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert variant={challengeResult.success ? 'default' : 'destructive'}>
                <AlertTitle>
                  {challengeResult.success ? 'Authentication Successful' : 'Authentication Failed'}
                </AlertTitle>
                <AlertDescription>
                  {challengeResult.success ? (
                    <>
                      Zero Trust challenge completed successfully using {challengeResult.method} verification. 
                      Transaction can proceed with enhanced monitoring.
                    </>
                  ) : (
                    'Zero Trust challenge failed. Transaction has been blocked for security reasons.'
                  )}
                </AlertDescription>
              </Alert>

              <Button 
                onClick={() => setChallengeResult(null)}
                variant="outline"
                className="mt-4"
              >
                Reset Demo
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Info Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>About Zero Trust Challenge</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">When It Triggers</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• High or Critical risk score detected</li>
                  <li>• Unusual transaction patterns</li>
                  <li>• Failed biometric verification</li>
                  <li>• Unrecognized device or location</li>
                  <li>• Connection to known fraud rings</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Verification Methods</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• SMS verification code</li>
                  <li>• Email verification link</li>
                  <li>• Authenticator app (TOTP)</li>
                  <li>• Enhanced biometric scan (Critical only)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Zero Trust Challenge Modal */}
        <ZeroTrustChallenge
          isOpen={showChallenge}
          onClose={handleChallengeClose}
          riskLevel={currentScenario.riskLevel}
          transactionAmount={currentScenario.transactionAmount}
          challengeReason={currentScenario.challengeReason}
        />
      </div>
    </div>
  )
}