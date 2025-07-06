"use client"
import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { 
  Shield, 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  Brain, 
  Database, 
  Eye, 
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Zap
} from 'lucide-react'

interface SecurityEvent {
  id: string
  type: 'fraud' | 'quantum' | 'blockchain' | 'biometric' | 'alert'
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  timestamp: Date
  userId?: string
  transactionId?: string
  details?: any
}

interface DashboardStats {
  totalTransactions: number
  blockedTransactions: number
  fraudDetectionRate: number
  averageProcessingTime: number
  activeUsers: number
  riskScore: number
}

export default function AdminDashboard() {
  const [events, setEvents] = useState<SecurityEvent[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalTransactions: 15847,
    blockedTransactions: 129,
    fraudDetectionRate: 99.7,
    averageProcessingTime: 1.2,
    activeUsers: 2341,
    riskScore: 0.12
  })
  const [isMonitoring, setIsMonitoring] = useState(false)

  // Simulate real-time events
  useEffect(() => {
    if (!isMonitoring) return

    const eventTemplates = [
      {
        type: 'quantum' as const,
        severity: 'low' as const,
        messages: [
          'PQC handshake completed successfully',
          'Quantum-safe session established',
          'CRYSTALS-Kyber key exchange verified'
        ]
      },
      {
        type: 'fraud' as const,
        severity: 'high' as const,
        messages: [
          'High-risk transaction flagged by AI Cortex',
          'Suspicious device pattern detected',
          'Multiple failed biometric attempts',
          'Unusual spending pattern identified'
        ]
      },
      {
        type: 'blockchain' as const,
        severity: 'low' as const,
        messages: [
          'Transaction successfully logged to blockchain',
          'Smart contract execution completed',
          'Block validation confirmed'
        ]
      },
      {
        type: 'biometric' as const,
        severity: 'medium' as const,
        messages: [
          'Biometric verification failed - retry required',
          'New device registered for user',
          'Face recognition confidence below threshold'
        ]
      },
      {
        type: 'alert' as const,
        severity: 'critical' as const,
        messages: [
          'Fraud ring detected - 4 connected accounts',
          'Account frozen due to suspicious activity',
          'Emergency protocol activated'
        ]
      }
    ]

    const interval = setInterval(() => {
      const template = eventTemplates[Math.floor(Math.random() * eventTemplates.length)]
      const message = template.messages[Math.floor(Math.random() * template.messages.length)]
      
      const newEvent: SecurityEvent = {
        id: Date.now().toString(),
        type: template.type,
        severity: template.severity,
        message,
        timestamp: new Date(),
        userId: `user-${Math.floor(Math.random() * 9999).toString().padStart(4, '0')}`,
        transactionId: `tx-${Math.floor(Math.random() * 99999).toString().padStart(5, '0')}`
      }

      setEvents(prev => [newEvent, ...prev.slice(0, 19)]) // Keep last 20 events

      // Update stats occasionally
      if (Math.random() > 0.7) {
        setStats(prev => ({
          ...prev,
          totalTransactions: prev.totalTransactions + Math.floor(Math.random() * 5) + 1,
          blockedTransactions: prev.blockedTransactions + (Math.random() > 0.8 ? 1 : 0),
          activeUsers: prev.activeUsers + Math.floor(Math.random() * 10) - 5
        }))
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [isMonitoring])

  const getEventIcon = (event: SecurityEvent) => {
    const iconMap = {
      quantum: Shield,
      fraud: AlertTriangle,
      blockchain: Database,
      biometric: Eye,
      alert: Zap
    }
    const Icon = iconMap[event.type]
    return <Icon className="h-4 w-4" />
  }

  const getEventColor = (event: SecurityEvent) => {
    const colorMap = {
      low: 'text-green-600 bg-green-50 border-green-200',
      medium: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      high: 'text-orange-600 bg-orange-50 border-orange-200',
      critical: 'text-red-600 bg-red-50 border-red-200'
    }
    return colorMap[event.severity]
  }

  const getSeverityBadge = (severity: string) => {
    const variants = {
      low: 'default',
      medium: 'secondary',
      high: 'destructive',
      critical: 'destructive'
    }
    return <Badge variant={variants[severity as keyof typeof variants] as any}>{severity.toUpperCase()}</Badge>
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto max-w-7xl p-4 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Shield className="h-8 w-8 text-primary" />
              TrustShield Admin Dashboard
            </h1>
            <p className="text-muted-foreground">Real-time security monitoring and threat analysis</p>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={isMonitoring ? "destructive" : "default"}
              onClick={() => setIsMonitoring(!isMonitoring)}
            >
              <Activity className="h-4 w-4 mr-2" />
              {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Transactions</p>
                  <p className="text-2xl font-bold">{stats.totalTransactions.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">+12% from yesterday</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Blocked Transactions</p>
                  <p className="text-2xl font-bold">{stats.blockedTransactions}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">0.8% of total</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Detection Rate</p>
                  <p className="text-2xl font-bold">{stats.fraudDetectionRate}%</p>
                </div>
                <Brain className="h-8 w-8 text-purple-500" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">AI Cortex accuracy</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                  <p className="text-2xl font-bold">{stats.activeUsers.toLocaleString()}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">Currently online</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Real-time Event Feed */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Real-time Security Events
                  {isMonitoring && (
                    <div className="flex items-center gap-2 ml-auto">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-green-600">Live</span>
                    </div>
                  )}
                </CardTitle>
                <CardDescription>
                  Live security events from the TrustShield platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {events.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>Start monitoring to see live security events</p>
                    </div>
                  ) : (
                    events.map(event => (
                      <div key={event.id} className={`p-3 rounded-lg border ${getEventColor(event)}`}>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 flex-1">
                            {getEventIcon(event)}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium">{event.message}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-muted-foreground">
                                  {event.timestamp.toLocaleTimeString()}
                                </span>
                                {event.userId && (
                                  <span className="text-xs text-muted-foreground">
                                    User: {event.userId}
                                  </span>
                                )}
                                {event.transactionId && (
                                  <span className="text-xs text-muted-foreground">
                                    TX: {event.transactionId}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            {getSeverityBadge(event.severity)}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Status and Controls */}
          <div className="space-y-6">
            {/* System Health */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  System Health
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">AI Cortex</span>
                  <Badge variant="default" className="bg-green-500">Online</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Quantum Handshake</span>
                  <Badge variant="default" className="bg-green-500">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Blockchain Network</span>
                  <Badge variant="default" className="bg-green-500">Synced</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">VisionGuard</span>
                  <Badge variant="default" className="bg-green-500">Monitoring</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Database</span>
                  <Badge variant="default" className="bg-green-500">Healthy</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Threat Level */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Current Threat Level
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/20 mb-4">
                    <span className="text-2xl font-bold text-green-600">LOW</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    All systems operating normally. No elevated threats detected.
                  </p>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span>Risk Score:</span>
                      <span className="font-medium">{stats.riskScore}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Processing Time:</span>
                      <span className="font-medium">{stats.averageProcessingTime}s</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Database className="h-4 w-4 mr-2" />
                  View Blockchain Explorer
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Brain className="h-4 w-4 mr-2" />
                  AI Model Performance
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  User Management
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Analytics Report
                </Button>
              </CardContent>
            </Card>

            {/* Recent Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  Critical Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle className="text-sm">Fraud Ring Detected</AlertTitle>
                    <AlertDescription className="text-xs">
                      4 connected accounts flagged - Investigation required
                    </AlertDescription>
                  </Alert>
                  
                  <Alert className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20">
                    <Clock className="h-4 w-4" />
                    <AlertTitle className="text-sm">High Volume Period</AlertTitle>
                    <AlertDescription className="text-xs">
                      Transaction volume 200% above normal - Monitor capacity
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}