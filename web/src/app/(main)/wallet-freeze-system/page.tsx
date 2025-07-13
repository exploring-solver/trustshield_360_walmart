/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { 
  Wallet, 
  Lock, 
  Unlock, 
  AlertTriangle, 
  Shield, 
  Clock, 
  User, 
  CreditCard,
  Eye,
  FileText,
  CheckCircle,
  XCircle
} from 'lucide-react'

interface FraudAlert {
  id: string
  timestamp: Date
  severity: 'HIGH' | 'CRITICAL'
  reason: string
  transactionId: string
  riskScore: number
  details: string[]
}

interface WalletStatus {
  userId: string
  userName: string
  isFrozen: boolean
  freezeReason: string | null
  freezeTimestamp: Date | null
  balance: number
  lastActivity: Date
  fraudAlerts: FraudAlert[]
  allowedOperations: string[]
  restrictionLevel: 'NONE' | 'PARTIAL' | 'FULL'
}

interface WalletFreezeSystemProps {
  userId?: string
  onWalletStatusChange?: (status: WalletStatus) => void
}

export default function WalletFreezeSystem({ userId = 'user-demo-001', onWalletStatusChange }: WalletFreezeSystemProps) {
  const [walletStatus, setWalletStatus] = useState<WalletStatus>({
    userId,
    userName: 'Sarah Chen',
    isFrozen: false,
    freezeReason: null,
    freezeTimestamp: null,
    balance: 247.83,
    lastActivity: new Date(Date.now() - 3600000),
    fraudAlerts: [],
    allowedOperations: ['view_balance', 'view_history', 'small_transactions'],
    restrictionLevel: 'NONE'
  })

  const [isUnfreezing, setIsUnfreezing] = useState(false)
  const [unfreezeReason, setUnfreezeReason] = useState('')
  const [showUnfreezeDialog, setShowUnfreezeDialog] = useState(false)

  // Simulate real-time fraud detection
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly trigger fraud alerts for demo
      if (Math.random() > 0.95 && !walletStatus.isFrozen) {
        triggerFraudAlert()
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [walletStatus.isFrozen])

  const triggerFraudAlert = () => {
    const alerts: Omit<FraudAlert, 'id' | 'timestamp'>[] = [
      {
        severity: 'HIGH',
        reason: 'Unusual spending pattern detected',
        transactionId: 'TX-' + Math.random().toString(36).substr(2, 8),
        riskScore: 0.87,
        details: [
          'Transaction amount 300% above normal',
          'Purchase at unusual time (2:30 AM)',
          'New merchant category'
        ]
      },
      {
        severity: 'CRITICAL',
        reason: 'Multiple failed biometric attempts',
        transactionId: 'TX-' + Math.random().toString(36).substr(2, 8),
        riskScore: 0.94,
        details: [
          'Device not recognized',
          'Location mismatch (Miami vs. Arkansas)',
          'Failed biometric verification 3 times'
        ]
      },
      {
        severity: 'CRITICAL',
        reason: 'Fraud ring association detected',
        transactionId: 'TX-' + Math.random().toString(36).substr(2, 8),
        riskScore: 0.91,
        details: [
          'Shared device with known fraudulent accounts',
          'Similar transaction patterns to blocked users',
          'Connected through suspicious IP range'
        ]
      }
    ]

    const alert = alerts[Math.floor(Math.random() * alerts.length)]
    const newAlert: FraudAlert = {
      ...alert,
      id: Date.now().toString(),
      timestamp: new Date()
    }

    setWalletStatus(prev => {
      const newStatus = {
        ...prev,
        fraudAlerts: [newAlert, ...prev.fraudAlerts].slice(0, 5),
        isFrozen: alert.severity === 'CRITICAL' || alert.riskScore > 0.9,
        freezeReason: alert.severity === 'CRITICAL' || alert.riskScore > 0.9 ? alert.reason : prev.freezeReason,
        freezeTimestamp: alert.severity === 'CRITICAL' || alert.riskScore > 0.9 ? new Date() : prev.freezeTimestamp,
        restrictionLevel: alert.riskScore > 0.9 ? 'FULL' as const : alert.riskScore > 0.7 ? 'PARTIAL' as const : 'NONE' as const,
        allowedOperations: alert.riskScore > 0.9 ? ['view_balance'] : ['view_balance', 'view_history']
      }
      
      onWalletStatusChange?.(newStatus)
      return newStatus
    })
  }

  const handleUnfreeze = async () => {
    if (!unfreezeReason.trim()) return

    setIsUnfreezing(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    setWalletStatus(prev => {
      const newStatus = {
        ...prev,
        isFrozen: false,
        freezeReason: null,
        freezeTimestamp: null,
        restrictionLevel: 'NONE' as const,
        allowedOperations: ['view_balance', 'view_history', 'small_transactions', 'large_transactions']
      }
      
      onWalletStatusChange?.(newStatus)
      return newStatus
    })

    setIsUnfreezing(false)
    setShowUnfreezeDialog(false)
    setUnfreezeReason('')
  }

  const getRestrictionBadge = (level: string) => {
    switch (level) {
      case 'FULL':
        return <Badge variant="destructive">FULLY RESTRICTED</Badge>
      case 'PARTIAL':
        return <Badge variant="secondary">PARTIALLY RESTRICTED</Badge>
      default:
        return <Badge variant="default" className="bg-green-500">UNRESTRICTED</Badge>
    }
  }

  const getSeverityBadge = (severity: string) => {
    return severity === 'CRITICAL' ? (
      <Badge variant="destructive">CRITICAL</Badge>
    ) : (
      <Badge variant="secondary">HIGH</Badge>
    )
  }

  return (
    <div className="space-y-6">
      {/* Wallet Status Card */}
      <Card className={walletStatus.isFrozen ? 'border-red-500 bg-red-50/50 dark:bg-red-950/20' : ''}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Wallet Security Status
            </CardTitle>
            <div className="flex items-center gap-2">
              {walletStatus.isFrozen ? (
                <Lock className="h-5 w-5 text-red-500" />
              ) : (
                <Unlock className="h-5 w-5 text-green-500" />
              )}
              {getRestrictionBadge(walletStatus.restrictionLevel)}
            </div>
          </div>
          <CardDescription>
            Real-time fraud monitoring and wallet protection system
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* User Info */}
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{walletStatus.userName}</span>
            </div>
            <div className="text-right">
              <div className="font-medium">${walletStatus.balance.toFixed(2)}</div>
              <div className="text-xs text-muted-foreground">Available Balance</div>
            </div>
          </div>

          {/* Freeze Alert */}
          {walletStatus.isFrozen && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle className="flex items-center justify-between">
                <span>Wallet Frozen</span>
                <Badge variant="outline" className="text-xs">
                  {walletStatus.freezeTimestamp && 
                    new Date(walletStatus.freezeTimestamp).toLocaleString()
                  }
                </Badge>
              </AlertTitle>
              <AlertDescription className="mt-2">
                <p className="mb-2">{walletStatus.freezeReason}</p>
                <p className="text-xs">
                  This wallet has been automatically frozen due to suspicious activity. 
                  All transactions are blocked pending manual review.
                </p>
              </AlertDescription>
            </Alert>
          )}

          {/* Allowed Operations */}
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Allowed Operations
            </h4>
            <div className="flex flex-wrap gap-2">
              {walletStatus.allowedOperations.map(op => (
                <Badge key={op} variant="outline" className="text-xs">
                  {op.replace('_', ' ').toUpperCase()}
                </Badge>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 border-t">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={triggerFraudAlert}
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Simulate Fraud Alert
            </Button>
            
            {walletStatus.isFrozen && (
              <Dialog open={showUnfreezeDialog} onOpenChange={setShowUnfreezeDialog}>
                <DialogTrigger asChild>
                  <Button variant="default" className="flex-1">
                    <Unlock className="h-4 w-4 mr-2" />
                    Unfreeze Wallet
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Unfreeze Wallet</DialogTitle>
                    <DialogDescription>
                      Please provide a reason for unfreezing this wallet. This action will be logged for audit purposes.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="unfreeze-reason">Reason for Unfreezing</Label>
                      <Textarea
                        id="unfreeze-reason"
                        placeholder="e.g., Customer identity verified, false positive confirmed..."
                        value={unfreezeReason}
                        onChange={(e:any) => setUnfreezeReason(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        onClick={handleUnfreeze}
                        disabled={!unfreezeReason.trim() || isUnfreezing}
                        className="flex-1"
                      >
                        {isUnfreezing ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Processing...
                          </>
                        ) : (
                          'Unfreeze Wallet'
                        )}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowUnfreezeDialog(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Fraud Alerts History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Recent Fraud Alerts
          </CardTitle>
          <CardDescription>
            Real-time fraud detection events for this wallet
          </CardDescription>
        </CardHeader>
        <CardContent>
          {walletStatus.fraudAlerts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Shield className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No fraud alerts detected</p>
              <p className="text-xs">Wallet is operating normally</p>
            </div>
          ) : (
            <div className="space-y-3">
              {walletStatus.fraudAlerts.map(alert => (
                <div key={alert.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getSeverityBadge(alert.severity)}
                      <span className="font-medium">{alert.reason}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {alert.timestamp.toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{alert.transactionId}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Risk Score: {(alert.riskScore * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-1">Risk Factors:</p>
                    <ul className="space-y-1">
                      {alert.details.map((detail, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-red-500 mt-1">•</span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transaction Attempt Blocker */}
      {walletStatus.isFrozen && (
        <Card className="border-red-500 bg-red-50/50 dark:bg-red-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-500" />
              Transaction Blocked
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <Lock className="h-4 w-4" />
              <AlertTitle>All Transactions Blocked</AlertTitle>
              <AlertDescription className="space-y-2">
                <p>This wallet is currently frozen and cannot process any transactions.</p>
                <div className="text-xs space-y-1">
                  <p>• Payment attempts will be automatically declined</p>
                  <p>• Account balance is protected but not accessible</p>
                  <p>• Contact customer support or wait for manual review</p>
                </div>
              </AlertDescription>
            </Alert>
            
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <div className="flex items-start gap-2">
                <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div className="text-xs text-muted-foreground">
                  <p className="font-medium mb-1">Fraud Protection Active</p>
                  <p>Your funds are secure. This freeze protects against unauthorized access while our security team investigates the suspicious activity.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}