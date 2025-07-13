/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

import { 
  Shield, 
  ShoppingCart, 
  CreditCard, 
  User, 
  MapPin, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Loader2,
  Brain,
  Database,
  Fingerprint
} from 'lucide-react'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

interface CheckoutStep {
  id: number
  name: string
  status: 'pending' | 'processing' | 'complete' | 'failed'
  details?: string
  duration?: number
}

export default function CheckoutPage() {
  const searchParams = useSearchParams()
  const scenario = searchParams?.get('scenario') || 'legit'
  
  // User and cart state
  const [user] = useState({
    id: 'user-sarah-001',
    name: scenario === 'legit' ? 'Sarah Chen' : 'Unknown Device User',
    email: 'sarah.chen@email.com',
    verifiedCredential: scenario === 'legit',
    trustScore: scenario === 'legit' ? 0.95 : 0.12,
    biometricVerified: scenario === 'legit'
  })

  const [cartItems] = useState<CartItem[]>(
    scenario === 'fraud' 
      ? [
          { id: '1', name: 'Gaming Laptop', price: 1299.99, quantity: 1 },
          { id: '2', name: 'Gift Card - $500', price: 500.00, quantity: 3 },
          { id: '3', name: 'Wireless Headphones', price: 199.99, quantity: 2 }
        ]
      : [
          { id: '1', name: 'Organic Groceries', price: 45.30, quantity: 1 },
          { id: '2', name: 'Household Items', price: 23.70, quantity: 1 },
          { id: '3', name: 'Wine Bottle', price: 15.99, quantity: 1 }
        ]
  )

  const [isProcessing, setIsProcessing] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [steps, setSteps] = useState<CheckoutStep[]>([
    { id: 1, name: 'Biometric Verification', status: 'pending' },
    { id: 2, name: 'Quantum Handshake', status: 'pending' },
    { id: 3, name: 'AI Fraud Analysis', status: 'pending' },
    { id: 4, name: 'Zero Trust Validation', status: 'pending' },
    { id: 5, name: 'Blockchain Logging', status: 'pending' }
  ])
  const [finalResult, setFinalResult] = useState<{ type: 'success' | 'blocked' | null, message: string }>({ type: null, message: '' })
  const [riskAnalysis, setRiskAnalysis] = useState<any>(null)

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const currentTime = new Date().getHours()
  const isUnusualTime = currentTime >= 2 && currentTime <= 5

  const updateStep = (stepId: number, status: CheckoutStep['status'], details?: string, duration?: number) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId 
        ? { ...step, status, details, duration }
        : step
    ))
  }

  const simulateCheckout = async () => {
    setIsProcessing(true)
    setCurrentStep(1)
    setFinalResult({ type: null, message: '' })

    try {
      // Step 1: Biometric Verification
      updateStep(1, 'processing')
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      if (scenario === 'fraud') {
        updateStep(1, 'failed', 'Biometric verification failed - device not recognized', 1500)
        setFinalResult({ 
          type: 'blocked', 
          message: 'Transaction blocked: Biometric verification failed. Please verify your identity at customer service.' 
        })
        setIsProcessing(false)
        return
      }
      
      updateStep(1, 'complete', 'Biometric match confirmed', 1500)
      setCurrentStep(2)

      // Step 2: Quantum Handshake
      updateStep(2, 'processing')
      await new Promise(resolve => setTimeout(resolve, 1200))
      updateStep(2, 'complete', 'Post-quantum cryptography handshake established', 1200)
      setCurrentStep(3)

      // Step 3: AI Fraud Analysis
      updateStep(3, 'processing')
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const transactionData = {
        amount: totalAmount,
        items: cartItems,
        timestamp: new Date().toISOString(),
        userId: user.id,
        location: scenario === 'fraud' ? 'Miami, FL' : 'Bentonville, AR',
        deviceTrustScore: scenario === 'fraud' ? 0.1 : 0.9
      }

      // Simulate AI analysis
      const riskScore = scenario === 'fraud' ? 0.92 : 0.15
      const riskFactors = scenario === 'fraud' 
        ? [
            'High transaction amount ($2,899.97)',
            'Multiple gift cards detected',
            'Transaction at unusual hours (2:30 AM)',
            'Location mismatch: Miami vs. registered address',
            'Device not recognized',
            'Spending pattern anomaly'
          ]
        : [
            'Normal spending pattern',
            'Trusted device and location',
            'Low transaction amount',
            'Groceries and household items'
          ]

      setRiskAnalysis({
        riskScore,
        riskLevel: riskScore > 0.7 ? 'HIGH' : riskScore > 0.3 ? 'MEDIUM' : 'LOW',
        factors: riskFactors,
        recommendation: riskScore > 0.7 ? 'BLOCK TRANSACTION' : 'APPROVE'
      })

      if (scenario === 'fraud') {
        updateStep(3, 'failed', `High risk score detected: ${riskScore}`, 2000)
        setCurrentStep(4)
        
        // Step 4: Zero Trust - Additional verification required
        updateStep(4, 'processing')
        await new Promise(resolve => setTimeout(resolve, 1000))
        updateStep(4, 'failed', 'Additional verification required but not provided', 1000)
        
        setFinalResult({ 
          type: 'blocked', 
          message: `Transaction blocked by AI Fraud Cortex. Risk score: ${riskScore}. Multiple suspicious factors detected.` 
        })
        setIsProcessing(false)
        return
      }

      updateStep(3, 'complete', `Low risk score: ${riskScore} - Transaction approved`, 2000)
      setCurrentStep(4)

      // Step 4: Zero Trust Validation
      updateStep(4, 'processing')
      await new Promise(resolve => setTimeout(resolve, 800))
      updateStep(4, 'complete', 'User context validated, no step-up required', 800)
      setCurrentStep(5)

      // Step 5: Blockchain Logging
      updateStep(5, 'processing')
      await new Promise(resolve => setTimeout(resolve, 1500))
      const txHash = `0x${Math.random().toString(16).substr(2, 64)}`
      updateStep(5, 'complete', `Transaction logged to blockchain: ${txHash.substr(0, 10)}...`, 1500)

      setFinalResult({ 
        type: 'success', 
        message: `Payment successful! Transaction recorded on blockchain with hash: ${txHash}` 
      })

    } catch (error) {
      setFinalResult({ 
        type: 'blocked', 
        message: 'An error occurred during processing. Please try again.' 
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const getStepIcon = (step: CheckoutStep) => {
    const iconMap = {
      'Biometric Verification': Fingerprint,
      'Quantum Handshake': Shield,
      'AI Fraud Analysis': Brain,
      'Zero Trust Validation': User,
      'Blockchain Logging': Database
    }
    
    const IconComponent = iconMap[step.name as keyof typeof iconMap] || CheckCircle
    
    if (step.status === 'processing') return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
    if (step.status === 'complete') return <CheckCircle className="h-4 w-4 text-green-500" />
    if (step.status === 'failed') return <XCircle className="h-4 w-4 text-red-500" />
    return <IconComponent className="h-4 w-4 text-gray-400" />
  }

  const getStepColor = (step: CheckoutStep) => {
    if (step.status === 'complete') return 'border-green-200 bg-green-50 dark:bg-green-950/20'
    if (step.status === 'failed') return 'border-red-200 bg-red-50 dark:bg-red-950/20'
    if (step.status === 'processing') return 'border-blue-200 bg-blue-50 dark:bg-blue-950/20'
    return 'border-gray-200 bg-gray-50 dark:bg-gray-950/20'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto max-w-6xl p-4 md:p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="h-8 w-8 text-primary" />
            <Badge variant="secondary" className="text-sm font-medium">
              TrustShield 360 Checkout
            </Badge>
          </div>
          
          {scenario === 'fraud' && (
            <Alert className="mb-4 border-orange-200 bg-orange-50 dark:bg-orange-950/20">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Demo Mode: Fraud Simulation</AlertTitle>
              <AlertDescription>
                This checkout is simulating a fraudulent transaction attempt to demonstrate TrustShield&apos;s security features.
              </AlertDescription>
            </Alert>
          )}
          
          <h1 className="text-3xl font-bold tracking-tight">Secure Checkout</h1>
          <p className="text-muted-foreground">
            Protected by quantum-safe encryption, AI fraud detection, and blockchain verification
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Cart and User Info */}
          <div className="space-y-6">
            {/* User Verification Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Customer Verification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Identity Verification</span>
                  <Badge variant={user.verifiedCredential ? "default" : "destructive"}>
                    {user.verifiedCredential ? "Verified" : "Unverified"}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Biometric Status</span>
                  <Badge variant={user.biometricVerified ? "default" : "destructive"}>
                    {user.biometricVerified ? "Authenticated" : "Failed"}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Trust Score</span>
                  <Badge variant={user.trustScore > 0.7 ? "default" : "destructive"}>
                    {(user.trustScore * 100).toFixed(0)}%
                  </Badge>
                </div>

                <div className="pt-2 border-t">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>Location: {scenario === 'fraud' ? 'Miami, FL' : 'Bentonville, AR'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm mt-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Time: {new Date().toLocaleTimeString()}</span>
                    {isUnusualTime && <Badge variant="outline" className="text-xs">Unusual Time</Badge>}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shopping Cart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Shopping Cart
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                      <div>
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                  
                  <div className="pt-3 border-t">
                    <div className="flex justify-between items-center font-bold">
                      <span>Total:</span>
                      <span className="text-lg">${totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Middle Column - Security Pipeline */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Pipeline</CardTitle>
                <CardDescription>
                  Real-time security validation steps
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {steps.map((step, index) => (
                  <div key={step.id} className={`p-4 rounded-lg border ${getStepColor(step)}`}>
                    <div className="flex items-center gap-3">
                      {getStepIcon(step)}
                      <div className="flex-1">
                        <p className="font-medium text-sm">{step.name}</p>
                        {step.details && (
                          <p className="text-xs text-muted-foreground mt-1">{step.details}</p>
                        )}
                        {step.duration && (
                          <p className="text-xs text-muted-foreground">Duration: {step.duration}ms</p>
                        )}
                      </div>
                      {step.status === 'processing' && currentStep === step.id && (
                        <Badge variant="outline" className="text-xs">Processing...</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Risk Analysis */}
            {riskAnalysis && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    AI Risk Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className={`text-2xl font-bold ${
                          riskAnalysis.riskScore > 0.7 ? 'text-red-500' : 
                          riskAnalysis.riskScore > 0.3 ? 'text-yellow-500' : 'text-green-500'
                        }`}>
                          {riskAnalysis.riskScore}
                        </div>
                        <div className="text-xs text-muted-foreground">Risk Score</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className={`text-lg font-semibold ${
                          riskAnalysis.riskLevel === 'HIGH' ? 'text-red-500' : 
                          riskAnalysis.riskLevel === 'MEDIUM' ? 'text-yellow-500' : 'text-green-500'
                        }`}>
                          {riskAnalysis.riskLevel}
                        </div>
                        <div className="text-xs text-muted-foreground">Risk Level</div>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium mb-2">
                        {riskAnalysis.riskScore > 0.7 ? 'Risk Factors:' : 'Analysis Results:'}
                      </p>
                      <ul className="space-y-1">
                        {riskAnalysis.factors.map((factor: string, i: number) => (
                          <li key={i} className="text-xs flex items-start gap-2">
                            <span className={riskAnalysis.riskScore > 0.7 ? 'text-red-500' : 'text-green-500'}>
                              {riskAnalysis.riskScore > 0.7 ? '⚠' : '✓'}
                            </span>
                            <span>{factor}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Payment and Results */}
          <div className="space-y-6">
            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">W</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">Walmart Pay</p>
                      <p className="text-xs text-muted-foreground">••••1234</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>${(totalAmount * 0.08).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold pt-2 border-t">
                    <span>Total:</span>
                    <span>${(totalAmount * 1.08).toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pay Button */}
            <Button
              onClick={simulateCheckout}
              disabled={isProcessing}
              className="w-full h-12 text-lg font-semibold"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing Secure Payment...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-5 w-5" />
                  Pay with TrustShield
                </>
              )}
            </Button>

            {/* Result Alert */}
            {finalResult.type && (
              <Alert 
                variant={finalResult.type === 'success' ? 'default' : 'destructive'}
                className={finalResult.type === 'success' 
                  ? 'border-green-200 bg-green-50 dark:bg-green-950/30' 
                  : 'border-red-200 bg-red-50 dark:bg-red-950/30'
                }
              >
                {finalResult.type === 'success' ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
                <AlertTitle>
                  {finalResult.type === 'success' ? 'Payment Successful!' : 'Transaction Blocked'}
                </AlertTitle>
                <AlertDescription className="mt-2 break-words">
                  {finalResult.message}
                </AlertDescription>
              </Alert>
            )}

            {/* Security Features */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Security Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="h-4 w-4 text-blue-500" />
                    <span>Post-Quantum Cryptography</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Brain className="h-4 w-4 text-purple-500" />
                    <span>AI Fraud Detection</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Database className="h-4 w-4 text-green-500" />
                    <span>Blockchain Verification</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Fingerprint className="h-4 w-4 text-orange-500" />
                    <span>Biometric Authentication</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Scenario Toggle for Demo */}
        <div className="mt-8 text-center">
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-4">Demo Controls</p>
              <div className="flex gap-2">
                <Button 
                  variant={scenario === 'legit' ? 'default' : 'outline'}
                  onClick={() => window.location.href = '?scenario=legit'}
                  className="flex-1"
                >
                  Legitimate User (Sarah)
                </Button>
                <Button 
                  variant={scenario === 'fraud' ? 'default' : 'outline'}
                  onClick={() => window.location.href = '?scenario=fraud'}
                  className="flex-1"
                >
                  Fraud Attempt
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}