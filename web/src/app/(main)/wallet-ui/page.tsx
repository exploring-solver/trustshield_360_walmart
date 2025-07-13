/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { 
  Wallet, 
  CreditCard, 
  Shield, 
  Star, 
  Lock, 
  Unlock,
  AlertTriangle,
  CheckCircle,
  QrCode,
  Fingerprint,
  Eye,
  EyeOff,
  Copy
} from 'lucide-react'

interface VerifiableCredential {
  id: string
  type: string
  status: 'active' | 'revoked' | 'expired'
  issuedAt: string
  expiresAt: string
  issuer: string
}

interface WalletData {
  userId: string
  balance: number
  loyaltyPoints: number
  isFrozen: boolean
  verificationLevel: 'BASIC' | 'VERIFIED' | 'PREMIUM'
  trustScore: number
  credentials: VerifiableCredential[]
  lastActivity: string
  freezeReason?: string
}

export default function WalletUI() {
  const [walletData, setWalletData] = useState<WalletData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showBalance, setShowBalance] = useState(false)
  const [showCredentials, setShowCredentials] = useState(false)

  useEffect(() => {
    // Simulate loading wallet data
    setTimeout(() => {
      setWalletData({
        userId: 'user-sarah-001',
        balance: 247.83,
        loyaltyPoints: 3420,
        isFrozen: false,
        verificationLevel: 'VERIFIED',
        trustScore: 0.95,
        credentials: [
          {
            id: 'vc_identity_001',
            type: 'IdentityCredential',
            status: 'active',
            issuedAt: '2024-01-15T10:30:00Z',
            expiresAt: '2025-01-15T10:30:00Z',
            issuer: 'Walmart TrustShield'
          },
          {
            id: 'vc_loyalty_001',
            type: 'LoyaltyCredential',
            status: 'active',
            issuedAt: '2024-01-15T10:35:00Z',
            expiresAt: '2025-01-15T10:35:00Z',
            issuer: 'Walmart Rewards'
          }
        ],
        lastActivity: new Date(Date.now() - 3600000).toISOString()
      })
      setIsLoading(false)
    }, 1000)
  }, [])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const getVerificationBadge = (level: string) => {
    const variants = {
      BASIC: 'secondary',
      VERIFIED: 'default',
      PREMIUM: 'default'
    }
    const colors = {
      BASIC: 'bg-gray-500',
      VERIFIED: 'bg-green-500',
      PREMIUM: 'bg-purple-500'
    }
    return (
      <Badge variant={variants[level as keyof typeof variants] as any} className={colors[level as keyof typeof colors]}>
        {level}
      </Badge>
    )
  }

  const getCredentialStatusBadge = (status: string) => {
    const variants = {
      active: 'default',
      revoked: 'destructive',
      expired: 'secondary'
    }
    const colors = {
      active: 'bg-green-500',
      revoked: 'bg-red-500',
      expired: 'bg-gray-500'
    }
    return (
      <Badge variant={variants[status as keyof typeof variants] as any} className={colors[status as keyof typeof colors]}>
        {status.toUpperCase()}
      </Badge>
    )
  }

  const getTrustScoreColor = (score: number) => {
    if (score >= 0.9) return 'text-green-600'
    if (score >= 0.7) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <Wallet className="h-8 w-8 animate-pulse text-primary mx-auto mb-2" />
            <p className="text-muted-foreground">Loading wallet...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!walletData) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-muted-foreground">Failed to load wallet data</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Digital Wallet
          </CardTitle>
          {walletData.isFrozen ? (
            <Badge variant="destructive" className="flex items-center gap-1">
              <Lock className="h-3 w-3" />
              FROZEN
            </Badge>
          ) : (
            <Badge variant="default" className="flex items-center gap-1 bg-green-500">
              <Unlock className="h-3 w-3" />
              ACTIVE
            </Badge>
          )}
        </div>
        <CardDescription>
          Secure digital identity and payment wallet powered by verifiable credentials
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Freeze Alert */}
        {walletData.isFrozen && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Wallet Frozen</AlertTitle>
            <AlertDescription>
              {walletData.freezeReason || 'This wallet has been frozen due to security concerns. Contact support for assistance.'}
            </AlertDescription>
          </Alert>
        )}

        {/* User Verification Status */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Fingerprint className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Identity Verification</span>
            </div>
            {getVerificationBadge(walletData.verificationLevel)}
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">User ID:</span>
              <div className="flex items-center gap-1">
                <span className="font-mono text-xs">{walletData.userId}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(walletData.userId)}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <div>
              <span className="text-muted-foreground">Trust Score:</span>
              <div className={`font-bold ${getTrustScoreColor(walletData.trustScore)}`}>
                {(walletData.trustScore * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        </div>

        {/* Balance and Loyalty */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Balance</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowBalance(!showBalance)}
              >
                {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <div className="text-2xl font-bold">
              {showBalance ? `$${walletData.balance.toFixed(2)}` : '••••••'}
            </div>
            <div className="text-xs text-muted-foreground">Available to spend</div>
          </div>

          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="font-medium">Loyalty Points</span>
            </div>
            <div className="text-2xl font-bold text-yellow-600">
              {walletData.loyaltyPoints.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">
              Worth ~${(walletData.loyaltyPoints * 0.01).toFixed(2)}
            </div>
          </div>
        </div>

        {/* Verifiable Credentials */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Verifiable Credentials
            </h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCredentials(!showCredentials)}
            >
              {showCredentials ? 'Hide' : 'Show'}
            </Button>
          </div>

          {showCredentials && (
            <div className="space-y-3">
              {walletData.credentials.map(credential => (
                <div key={credential.id} className="p-3 border rounded-lg bg-muted/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{credential.type}</span>
                    {getCredentialStatusBadge(credential.status)}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <div>
                      <span className="font-medium">Issued:</span> {new Date(credential.issuedAt).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="font-medium">Expires:</span> {new Date(credential.expiresAt).toLocaleDateString()}
                    </div>
                    <div className="md:col-span-2">
                      <span className="font-medium">Issuer:</span> {credential.issuer}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-2">
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <QrCode className="h-3 w-3" />
                      Show QR
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(credential.id)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!showCredentials && (
            <div className="text-center p-4 border-2 border-dashed border-muted-foreground/25 rounded-lg">
              <Shield className="h-6 w-6 mx-auto mb-2 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                {walletData.credentials.length} credential(s) available
              </p>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="pt-4 border-t">
          <h4 className="font-semibold mb-2">Recent Activity</h4>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>
              Last activity: {new Date(walletData.lastActivity).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4 border-t">
          <Button className="flex-1" disabled={walletData.isFrozen}>
            <CreditCard className="h-4 w-4 mr-2" />
            Add Payment Method
          </Button>
          <Button variant="outline" className="flex-1">
            <Shield className="h-4 w-4 mr-2" />
            Request Credential
          </Button>
        </div>

        {/* Security Notice */}
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertTitle>Security Notice</AlertTitle>
          <AlertDescription className="text-xs">
            Your wallet is protected by quantum-safe encryption and verifiable credentials. 
            Never share your private keys or credentials with anyone.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}