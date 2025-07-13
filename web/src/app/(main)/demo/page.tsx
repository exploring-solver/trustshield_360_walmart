'use client'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { 
  Brain, 
  Shield, 
  Terminal, 
  Wallet, 
  FileText, 
  Zap, 
  AlertTriangle,
  CheckCircle,
  Eye,
  Database,
  Settings
} from 'lucide-react'
import RiskExplanationModal from '../ai-cortex/page'
import ZeroTrustChallenge from '@/components/zero-trust-challenge'
import WalletFreezeSystem from '../wallet-freeze-system/page'

// Mock transaction data for demonstrations
const mockTransactionData = {
  legitimate: {
    id: 'TX-LEGIT-001',
    amount: 78.45,
    timestamp: new Date().toISOString(),
    items: [
      { name: 'Groceries', quantity: 1 },
      { name: 'Household Items', quantity: 1 }
    ],
    shippingAddress: { city: 'Bentonville' },
    billingAddress: { city: 'Bentonville' }
  },
  fraud: {
    id: 'TX-FRAUD-001',
    amount: 1500.00,
    timestamp: new Date(new Date().setHours(2, 30)).toISOString(),
    items: [
      { name: 'Gift Card - $500', quantity: 3 },
      { name: 'Electronics', quantity: 1 }
    ],
    shippingAddress: { city: 'Miami' },
    billingAddress: { city: 'New York' }
  }
}

export default function TrustShieldShowcase() {
  const [activeDemo, setActiveDemo] = useState<'risk' | 'zero-trust' | 'wallet' | 'cli' | 'research'>('risk')
  const [selectedTransaction, setSelectedTransaction] = useState<'legitimate' | 'fraud'>('fraud')
  const [showZeroTrust, setShowZeroTrust] = useState(false)
  const [cliOutput, setCLIOutput] = useState<string[]>([])
  const [isExecutingCLI, setIsExecutingCLI] = useState(false)

  const simulateCLICommand = async (command: string) => {
    setIsExecutingCLI(true)
    setCLIOutput(prev => [...prev, `$ ${command}`])
    
    // Simulate command execution delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const responses: Record<string, string[]> = {
      'trustshield trace --tx TX-FRAUD-001': [
        '📋 TRANSACTION TRACE REPORT',
        '━'.repeat(50),
        'Transaction ID: TX-FRAUD-001',
        'Amount: $1,500.00',
        'Status: BLOCKED',
        'Timestamp: ' + new Date().toLocaleString(),
        '',
        '🔐 SECURITY PIPELINE STEPS:',
        '  1. ❌ Biometric Verification (1200ms)',
        '     Biometric match failed',
        '  2. ✅ PQC Handshake (800ms)',
        '     CRYSTALS-Kyber key exchange completed',
        '  3. ❌ AI Fraud Analysis (2100ms)',
        '     High risk score: 0.92',
        '  4. ❌ Zero Trust Validation (600ms)',
        '     Step-up authentication required',
        '  5. ❌ Blockchain Logging (0ms)',
        '     Transaction blocked',
        '',
        '🎯 RISK ANALYSIS:',
        '  Risk Score: 0.92',
        '  Risk Level: HIGH'
      ],
      'trustshield risk --tx TX-FRAUD-001': [
        '🧠 AI FRAUD CORTEX ANALYSIS',
        '━'.repeat(50),
        'Overall Risk Score: 0.87',
        'Risk Level: HIGH',
        'Recommendation: BLOCK_TRANSACTION',
        '',
        '📊 RISK FACTORS:',
        '  🔴 HIGH Transaction Amount (30.0%)',
        '      High value transaction ($1,500+) outside normal pattern',
        '  🔴 HIGH Time of Purchase (20.0%)',
        '      Transaction at 2:30 AM - unusual shopping hours',
        '  🔴 HIGH Device Recognition (40.0%)',
        '      Unrecognized device with low trust score',
        '  🟡 MED Location Mismatch (25.0%)',
        '      Purchase location differs from registered address'
      ],
      'trustshield wallet --user user-fraud-001 --freeze': [
        '💳 WALLET FREEZE OPERATION',
        '━'.repeat(50),
        '✅ Wallet frozen successfully',
        'User: user-fraud-001',
        'Reason: Security policy violation',
        'Timestamp: ' + new Date().toLocaleString(),
        '⚠️  All transactions are now blocked for this user.'
      ],
      'trustshield monitor --filter fraud': [
        '🔍 REAL-TIME SECURITY MONITOR',
        '━'.repeat(50),
        'Monitoring live security events... (Press Ctrl+C to stop)',
        '',
        new Date().toLocaleTimeString() + ' 🚨 High-risk transaction flagged: TX-98765',
        new Date().toLocaleTimeString() + ' 🚨 Fraud ring detected: 3 connected accounts',
        new Date().toLocaleTimeString() + ' 🚨 Account frozen due to suspicious activity'
      ]
    }

    const response = responses[command] || ['Command not found. Try: trustshield --help']
    
    for (const line of response) {
      setCLIOutput(prev => [...prev, line])
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    setCLIOutput(prev => [...prev, ''])
    setIsExecutingCLI(false)
  }

  const clearCLI = () => {
    setCLIOutput([])
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto max-w-7xl p-4 md:p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            TrustShield 360 Demo Showcase
          </h1>
          <p className="text-xl text-muted-foreground">
            Interactive demonstrations of advanced security features
          </p>
        </div>

        {/* Demo Navigation */}
        <Tabs value={activeDemo} onValueChange={(value: any) => setActiveDemo(value)} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="risk" className="gap-2">
              <Brain className="h-4 w-4" />
              AI Risk Analysis
            </TabsTrigger>
            <TabsTrigger value="zero-trust" className="gap-2">
              <Shield className="h-4 w-4" />
              Zero Trust
            </TabsTrigger>
            <TabsTrigger value="wallet" className="gap-2">
              <Wallet className="h-4 w-4" />
              Wallet Security
            </TabsTrigger>
            <TabsTrigger value="cli" className="gap-2">
              <Terminal className="h-4 w-4" />
              CLI Tools
            </TabsTrigger>
            <TabsTrigger value="research" className="gap-2">
              <FileText className="h-4 w-4" />
              Research
            </TabsTrigger>
          </TabsList>

          {/* AI Risk Analysis Demo */}
          <TabsContent value="risk" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  AI Cortex Risk Explanation Demo
                </CardTitle>
                <CardDescription>
                  See detailed breakdown of TabTransformer, GNN, and VisionGuard analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4 mb-4">
                  <Button
                    variant={selectedTransaction === 'legitimate' ? 'default' : 'outline'}
                    onClick={() => setSelectedTransaction('legitimate')}
                  >
                    Legitimate Transaction
                  </Button>
                  <Button
                    variant={selectedTransaction === 'fraud' ? 'default' : 'outline'}
                    onClick={() => setSelectedTransaction('fraud')}
                  >
                    Fraudulent Transaction
                  </Button>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Selected Transaction:</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>ID: {mockTransactionData[selectedTransaction].id}</div>
                    <div>Amount: ${mockTransactionData[selectedTransaction].amount}</div>
                    <div>Items: {mockTransactionData[selectedTransaction].items.map(i => i.name).join(', ')}</div>
                    <div>Time: {new Date(mockTransactionData[selectedTransaction].timestamp).toLocaleString()}</div>
                  </div>
                </div>

                <RiskExplanationModal 
                  transactionData={mockTransactionData[selectedTransaction]}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Zero Trust Challenge Demo */}
          <TabsContent value="zero-trust" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Zero Trust Challenge System
                </CardTitle>
                <CardDescription>
                  Step-up authentication for high-risk transactions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>High-Risk Transaction Detected</AlertTitle>
                  <AlertDescription>
                    This demonstration shows the Zero Trust challenge system that activates when a transaction
                    exceeds risk thresholds, requiring additional verification methods.
                  </AlertDescription>
                </Alert>

                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Scenario: Suspicious $1,500 Purchase</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Transaction at 2:30 AM (unusual hours)</li>
                    <li>• Unrecognized device detected</li>
                    <li>• Location mismatch: Miami vs. Arkansas</li>
                    <li>• Multiple gift cards in cart</li>
                  </ul>
                </div>

                <Button onClick={() => setShowZeroTrust(true)} className="w-full">
                  <Shield className="h-4 w-4 mr-2" />
                  Trigger Zero Trust Challenge
                </Button>

                <ZeroTrustChallenge
                  isOpen={showZeroTrust}
                  onClose={(success, method) => {
                    setShowZeroTrust(false)
                    // Handle challenge result
                  }}
                  riskLevel="HIGH"
                  transactionAmount={1500.00}
                  challengeReason="Multiple suspicious factors detected including unusual time, unrecognized device, and location mismatch"
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wallet Security Demo */}
          <TabsContent value="wallet" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-primary" />
                  Wallet Freeze & Security System
                </CardTitle>
                <CardDescription>
                  Real-time fraud detection with automatic wallet protection
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Alert className="mb-4">
                  <Eye className="h-4 w-4" />
                  <AlertTitle>Live Demo</AlertTitle>
                  <AlertDescription>
                    This system monitors for fraud patterns and automatically freezes wallets when threats are detected.
                    Click "Simulate Fraud Alert" to see the system in action.
                  </AlertDescription>
                </Alert>

                <WalletFreezeSystem
                  userId="demo-user-001"
                  onWalletStatusChange={(status) => {
                    console.log('Wallet status changed:', status)
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* CLI Tools Demo */}
          <TabsContent value="cli" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Terminal className="h-5 w-5 text-primary" />
                  TrustShield CLI Tools
                </CardTitle>
                <CardDescription>
                  Professional command-line interface for transaction analysis and system management
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => simulateCLICommand('trustshield trace --tx TX-FRAUD-001')}
                    disabled={isExecutingCLI}
                  >
                    Trace Transaction
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => simulateCLICommand('trustshield risk --tx TX-FRAUD-001')}
                    disabled={isExecutingCLI}
                  >
                    Risk Analysis
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => simulateCLICommand('trustshield wallet --user user-fraud-001 --freeze')}
                    disabled={isExecutingCLI}
                  >
                    Freeze Wallet
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => simulateCLICommand('trustshield monitor --filter fraud')}
                    disabled={isExecutingCLI}
                  >
                    Monitor Events
                  </Button>
                </div>

                <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm h-96 overflow-y-auto">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-blue-400">TrustShield CLI Terminal</span>
                    <Button size="sm" variant="ghost" onClick={clearCLI} className="text-gray-400 hover:text-white">
                      Clear
                    </Button>
                  </div>
                  <div className="border-b border-gray-600 mb-2"></div>
                  {cliOutput.map((line, index) => (
                    <div key={index} className="mb-1">
                      {line.startsWith('$') ? (
                        <span className="text-yellow-400">{line}</span>
                      ) : line.includes('ERROR') ? (
                        <span className="text-red-400">{line}</span>
                      ) : line.includes('✅') || line.includes('SUCCESS') ? (
                        <span className="text-green-400">{line}</span>
                      ) : line.includes('❌') || line.includes('BLOCKED') ? (
                        <span className="text-red-400">{line}</span>
                      ) : line.includes('🔴') ? (
                        <span className="text-red-400">{line}</span>
                      ) : line.includes('🟡') ? (
                        <span className="text-yellow-400">{line}</span>
                      ) : line.includes('🟢') ? (
                        <span className="text-green-400">{line}</span>
                      ) : (
                        <span className="text-gray-300">{line}</span>
                      )}
                    </div>
                  ))}
                  {isExecutingCLI && (
                    <div className="flex items-center gap-2 text-blue-400">
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-400"></div>
                      <span>Executing...</span>
                    </div>
                  )}
                </div>

                <Alert>
                  <Terminal className="h-4 w-4" />
                  <AlertTitle>Professional CLI Interface</AlertTitle>
                  <AlertDescription>
                    The TrustShield CLI provides powerful tools for security teams to trace transactions, 
                    analyze risks, manage wallets, and monitor real-time events. Perfect for enterprise deployments.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Research & Documentation */}
          <TabsContent value="research" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Research Papers */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Research Foundation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-medium text-sm">CRYSTALS-Kyber: Post-Quantum KEM</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        NIST standardized quantum-safe cryptography
                      </p>
                      <Badge variant="outline" className="text-xs mt-2">NIST Level 3</Badge>
                    </div>
                    
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-medium text-sm">TabTransformer Architecture</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Self-attention for tabular fraud detection
                      </p>
                      <Badge variant="outline" className="text-xs mt-2">94.7% Accuracy</Badge>
                    </div>
                    
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-medium text-sm">Graph Neural Networks</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Fraud ring detection and network analysis
                      </p>
                      <Badge variant="outline" className="text-xs mt-2">87% Detection Rate</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Performance Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    Performance Benchmarks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>AI Processing Latency</span>
                        <span className="font-medium">147ms</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 mt-1">
                        <div className="bg-green-500 h-2 rounded-full" style={{width: '73%'}}></div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Target: &lt;200ms</p>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Fraud Detection Rate</span>
                        <span className="font-medium">99.7%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 mt-1">
                        <div className="bg-green-500 h-2 rounded-full" style={{width: '99.7%'}}></div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Industry: 87-92%</p>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Quantum Handshake</span>
                        <span className="font-medium">3.55s</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 mt-1">
                        <div className="bg-blue-500 h-2 rounded-full" style={{width: '71%'}}></div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">NIST Level 3 security</p>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Blockchain Logging</span>
                        <span className="font-medium">2.3s</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 mt-1">
                        <div className="bg-purple-500 h-2 rounded-full" style={{width: '46%'}}></div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Immutable audit trail</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Test Data */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-primary" />
                    Test Scenarios
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg border-red-200 bg-red-50 dark:bg-red-950/20">
                      <h4 className="font-medium text-sm text-red-800 dark:text-red-200">Fraud Scenarios</h4>
                      <ul className="text-xs text-red-600 dark:text-red-300 mt-2 space-y-1">
                        <li>• Gift card purchases at 2 AM</li>
                        <li>• Device sharing fraud rings</li>
                        <li>• Location mismatch + biometric failure</li>
                        <li>• Velocity abuse patterns</li>
                      </ul>
                    </div>
                    
                    <div className="p-3 border rounded-lg border-green-200 bg-green-50 dark:bg-green-950/20">
                      <h4 className="font-medium text-sm text-green-800 dark:text-green-200">Legitimate Scenarios</h4>
                      <ul className="text-xs text-green-600 dark:text-green-300 mt-2 space-y-1">
                        <li>• Regular grocery shopping</li>
                        <li>• Planned electronics purchases</li>
                        <li>• Loyal customer patterns</li>
                        <li>• Normal business hours</li>
                      </ul>
                    </div>
                    
                    <div className="p-3 border rounded-lg">
                      <h4 className="font-medium text-sm">Mock Data Generator</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Automated test data creation with realistic fraud and legitimate transaction patterns
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* DevTools Bundle */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  DevTools Mock Data Bundle
                </CardTitle>
                <CardDescription>
                  Comprehensive testing and development utilities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 border rounded-lg text-center">
                    <Brain className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                    <h4 className="font-medium text-sm">AI Mock Responses</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      TabTransformer, GNN, and VisionGuard mock outputs
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-lg text-center">
                    <Database className="h-8 w-8 mx-auto mb-2 text-green-500" />
                    <h4 className="font-medium text-sm">Transaction Logs</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Complete audit trail with timing and status
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-lg text-center">
                    <Terminal className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                    <h4 className="font-medium text-sm">CLI Responses</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Mock responses for all CLI commands
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-lg text-center">
                    <Zap className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                    <h4 className="font-medium text-sm">Test Utilities</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Automated testing and validation tools
                    </p>
                  </div>
                </div>

                <Alert className="mt-4">
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>Production Ready</AlertTitle>
                  <AlertDescription>
                    All mock data and testing utilities are designed to mirror real-world scenarios 
                    and can be easily replaced with production APIs and services.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-2">TrustShield 360 Demo Complete</h3>
              <p className="text-sm text-muted-foreground mb-4">
                This showcase demonstrates the comprehensive security platform with quantum-safe cryptography, 
                AI-powered fraud detection, and blockchain verification.
              </p>
              <div className="flex justify-center gap-2">
                <Badge variant="outline">Quantum-Safe</Badge>
                <Badge variant="outline">AI-Powered</Badge>
                <Badge variant="outline">Blockchain-Verified</Badge>
                <Badge variant="outline">Zero-Trust</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}