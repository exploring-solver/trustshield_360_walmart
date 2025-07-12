'use client'
import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Shield, 
  Smartphone, 
  Mail, 
  KeyRound, 
  AlertTriangle, 
  Clock, 
  CheckCircle,
  XCircle,
  Fingerprint,
  QrCode
} from 'lucide-react'

interface ZeroTrustChallengeProps {
  isOpen: boolean
  onClose: (success: boolean, method?: string) => void
  riskLevel: 'HIGH' | 'CRITICAL'
  transactionAmount: number
  challengeReason: string
}

type ChallengeMethod = 'sms' | 'email' | 'authenticator' | 'biometric'

interface Challenge {
  method: ChallengeMethod
  icon: any
  name: string
  description: string
  timeLimit: number
  available: boolean
}

export default function ZeroTrustChallenge({ 
  isOpen, 
  onClose, 
  riskLevel, 
  transactionAmount, 
  challengeReason 
}: ZeroTrustChallengeProps) {
  const [selectedMethod, setSelectedMethod] = useState<ChallengeMethod | null>(null)
  const [step, setStep] = useState<'select' | 'verify' | 'result'>('select')
  const [verificationCode, setVerificationCode] = useState('')
  const [timeRemaining, setTimeRemaining] = useState(300) // 5 minutes
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationResult, setVerificationResult] = useState<'success' | 'failed' | null>(null)
  const [attempts, setAttempts] = useState(0)
  const [sentCode, setSentCode] = useState('')

  const challenges: Challenge[] = [
    {
      method: 'sms',
      icon: Smartphone,
      name: 'SMS Verification',
      description: 'Send verification code to your registered phone number ending in ***-1234',
      timeLimit: 300,
      available: true
    },
    {
      method: 'email',
      icon: Mail,
      name: 'Email Verification',
      description: 'Send verification link to your registered email address',
      timeLimit: 600,
      available: true
    },
    {
      method: 'authenticator',
      icon: KeyRound,
      name: 'Authenticator App',
      description: 'Use your authenticator app to generate a 6-digit code',
      timeLimit: 180,
      available: true
    },
    {
      method: 'biometric',
      icon: Fingerprint,
      name: 'Biometric Verification',
      description: 'Additional biometric scan required for high-risk transactions',
      timeLimit: 120,
      available: riskLevel === 'CRITICAL'
    }
  ]

  // Timer countdown
  useEffect(() => {
    if (step === 'verify' && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setVerificationResult('failed')
            setStep('result')
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [step, timeRemaining])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  const handleMethodSelect = (method: ChallengeMethod) => {
    setSelectedMethod(method)
    const challenge = challenges.find(c => c.method === method)
    if (challenge) {
      setTimeRemaining(challenge.timeLimit)
      
      // Generate and "send" verification code
      const code = generateVerificationCode()
      setSentCode(code)
      
      setStep('verify')
    }
  }

  const handleVerification = async () => {
    if (!verificationCode || !selectedMethod) return

    setIsVerifying(true)
    setAttempts(prev => prev + 1)

    // Simulate verification delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Check verification code (for demo purposes)
    const isCorrect = selectedMethod === 'biometric' ? 
      Math.random() > 0.3 : // 70% success rate for biometric
      verificationCode === sentCode || verificationCode === '123456' // Demo codes

    if (isCorrect) {
      setVerificationResult('success')
      setTimeout(() => {
        onClose(true, selectedMethod)
      }, 2000)
    } else {
      if (attempts >= 2) {
        setVerificationResult('failed')
        setTimeout(() => {
          onClose(false)
        }, 2000)
      } else {
        setVerificationResult('failed')
        setTimeout(() => {
          setVerificationResult(null)
          setVerificationCode('')
        }, 2000)
      }
    }

    setStep('result')
    setIsVerifying(false)
  }

  const handleBiometricScan = async () => {
    setIsVerifying(true)
    
    // Simulate biometric scan
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    const success = Math.random() > 0.2 // 80% success rate
    setVerificationResult(success ? 'success' : 'failed')
    setIsVerifying(false)
    setStep('result')
    
    setTimeout(() => {
      onClose(success, 'biometric')
    }, 2000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose(false)}>
      <DialogContent className="max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-orange-500" />
            Zero Trust Challenge Required
          </DialogTitle>
          <DialogDescription>
            Additional verification needed for this high-risk transaction
          </DialogDescription>
        </DialogHeader>

        {/* Risk Alert */}
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="flex items-center justify-between">
            <span>{riskLevel} Risk Transaction</span>
            <Badge variant="destructive">${transactionAmount.toFixed(2) }</Badge>
          </AlertTitle>
          <AlertDescription className="text-xs mt-1">
            {challengeReason}
          </AlertDescription>
        </Alert>

        {step === 'select' && (
          <div className="space-y-4">
            <div className="text-center py-2">
              <p className="text-sm text-muted-foreground">
                Choose a verification method to continue with this transaction
              </p>
            </div>

            <div className="space-y-3">
              {challenges.filter(c => c.available).map((challenge) => (
                <Card 
                  key={challenge.method}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleMethodSelect(challenge.method)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <challenge.icon className="h-5 w-5 text-primary mt-1" />
                      <div className="flex-1">
                        <h4 className="font-medium">{challenge.name}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {challenge.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {Math.floor(challenge.timeLimit / 60)} minute time limit
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {step === 'verify' && selectedMethod && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-orange-500" />
                <span className="font-mono text-lg">
                  {formatTime(timeRemaining)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">Time remaining</p>
            </div>

            {selectedMethod === 'biometric' ? (
              <div className="text-center space-y-4">
                <div className="mx-auto w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <Fingerprint className="h-12 w-12 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Biometric Scan Required</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Place your finger on the scanner or look at the camera
                  </p>
                </div>
                <Button 
                  onClick={handleBiometricScan}
                  disabled={isVerifying}
                  className="w-full"
                >
                  {isVerifying ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Scanning...
                    </>
                  ) : (
                    'Start Biometric Scan'
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-sm mb-2">
                    {selectedMethod === 'sms' && 'Verification code sent to ***-1234'}
                    {selectedMethod === 'email' && 'Verification link sent to your email'}
                    {selectedMethod === 'authenticator' && 'Enter code from your authenticator app'}
                  </p>
                  {(selectedMethod === 'sms' || selectedMethod === 'email') && (
                    <p className="text-xs text-muted-foreground">
                      Demo code: {sentCode}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="verification-code">Verification Code</Label>
                  <Input
                    id="verification-code"
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="text-center text-lg tracking-widest"
                    maxLength={6}
                  />
                </div>

                {attempts > 0 && verificationResult === 'failed' && (
                  <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertDescription>
                      Invalid code. {3 - attempts} attempts remaining.
                    </AlertDescription>
                  </Alert>
                )}

                <Button 
                  onClick={handleVerification}
                  disabled={verificationCode.length !== 6 || isVerifying}
                  className="w-full"
                >
                  {isVerifying ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Verifying...
                    </>
                  ) : (
                    'Verify Code'
                  )}
                </Button>

                <Button 
                  variant="outline" 
                  onClick={() => setStep('select')}
                  className="w-full"
                >
                  Choose Different Method
                </Button>
              </div>
            )}
          </div>
        )}

        {step === 'result' && (
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center">
              {verificationResult === 'success' ? (
                <CheckCircle className="h-16 w-16 text-green-500" />
              ) : (
                <XCircle className="h-16 w-16 text-red-500" />
              )}
            </div>
            
            <div>
              <h3 className="font-medium text-lg">
                {verificationResult === 'success' ? 'Verification Successful' : 'Verification Failed'}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {verificationResult === 'success' 
                  ? 'Transaction can proceed with additional monitoring'
                  : attempts >= 3 
                    ? 'Maximum attempts exceeded. Transaction blocked.'
                    : 'Please try again with a different method'
                }
              </p>
            </div>

            {verificationResult === 'failed' && attempts < 3 && (
              <Button 
                variant="outline"
                onClick={() => {
                  setStep('select')
                  setVerificationResult(null)
                  setVerificationCode('')
                }}
                className="w-full"
              >
                Try Different Method
              </Button>
            )}
          </div>
        )}

        {/* Security Notice */}
        <div className="mt-6 p-3 bg-muted rounded-lg">
          <div className="flex items-start gap-2">
            <Shield className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div className="text-xs text-muted-foreground">
              <p className="font-medium mb-1">Zero Trust Security</p>
              <p>This additional verification helps protect against unauthorized transactions and ensures account security.</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}