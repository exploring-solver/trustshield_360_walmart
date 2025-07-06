import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Database, 
  Search, 
  ExternalLink, 
  Clock, 
  Shield, 
  CheckCircle, 
  Hash,
  Users,
  DollarSign,
  Zap,
  Copy,
  Eye
} from 'lucide-react'

interface Transaction {
  hash: string
  blockNumber: number
  timestamp: Date
  from: string
  to: string
  amount: number
  riskScore: number
  status: 'confirmed' | 'pending' | 'failed'
  gasUsed: number
  transactionFee: number
  type: 'payment' | 'verification' | 'credential'
}

interface Block {
  number: number
  hash: string
  timestamp: Date
  transactions: number
  miner: string
  gasUsed: number
  gasLimit: number
  size: number
}

export default function BlockchainExplorer() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'transactions' | 'blocks'>('transactions')
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [blocks, setBlocks] = useState<Block[]>([])
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Mock data generation
  useEffect(() => {
    generateMockData()
  }, [])

  const generateMockData = () => {
    const mockTransactions: Transaction[] = []
    const mockBlocks: Block[] = []

    // Generate transactions
    for (let i = 0; i < 25; i++) {
      const timestamp = new Date(Date.now() - Math.random() * 86400000 * 7) // Last 7 days
      const riskScore = Math.random()
      
      mockTransactions.push({
        hash: `0x${Math.random().toString(16).substr(2, 64)}`,
        blockNumber: 45820 + Math.floor(Math.random() * 100),
        timestamp,
        from: `0x${Math.random().toString(16).substr(2, 40)}`,
        to: `0x${Math.random().toString(16).substr(2, 40)}`,
        amount: Math.random() * 1000 + 10,
        riskScore,
        status: riskScore > 0.8 ? 'failed' : Math.random() > 0.1 ? 'confirmed' : 'pending',
        gasUsed: Math.floor(Math.random() * 50000) + 21000,
        transactionFee: Math.random() * 0.01 + 0.001,
        type: ['payment', 'verification', 'credential'][Math.floor(Math.random() * 3)] as any
      })
    }

    // Generate blocks
    for (let i = 0; i < 15; i++) {
      const blockNumber = 45920 - i
      const timestamp = new Date(Date.now() - i * 15000) // 15 seconds between blocks
      
      mockBlocks.push({
        number: blockNumber,
        hash: `0x${Math.random().toString(16).substr(2, 64)}`,
        timestamp,
        transactions: Math.floor(Math.random() * 50) + 10,
        miner: `0x${Math.random().toString(16).substr(2, 40)}`,
        gasUsed: Math.floor(Math.random() * 8000000) + 2000000,
        gasLimit: 10000000,
        size: Math.floor(Math.random() * 50000) + 10000
      })
    }

    setTransactions(mockTransactions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()))
    setBlocks(mockBlocks.sort((a, b) => b.number - a.number))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const truncateHash = (hash: string, length: number = 8) => {
    return `${hash.slice(0, length)}...${hash.slice(-6)}`
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      confirmed: 'default',
      pending: 'secondary',
      failed: 'destructive'
    }
    const colors = {
      confirmed: 'bg-green-500',
      pending: 'bg-yellow-500',
      failed: 'bg-red-500'
    }
    return (
      <Badge variant={variants[status as keyof typeof variants] as any} className={colors[status as keyof typeof colors]}>
        {status.toUpperCase()}
      </Badge>
    )
  }

  const getRiskBadge = (riskScore: number) => {
    if (riskScore >= 0.8) return <Badge variant="destructive">HIGH RISK</Badge>
    if (riskScore >= 0.5) return <Badge variant="secondary">MEDIUM</Badge>
    return <Badge variant="default" className="bg-green-500">LOW RISK</Badge>
  }

  const getTypeBadge = (type: string) => {
    const colors = {
      payment: 'bg-blue-500',
      verification: 'bg-purple-500',
      credential: 'bg-orange-500'
    }
    return <Badge className={colors[type as keyof typeof colors]}>{type.toUpperCase()}</Badge>
  }

  const filteredTransactions = transactions.filter(tx => 
    tx.hash.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tx.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tx.to.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredBlocks = blocks.filter(block => 
    block.hash.toLowerCase().includes(searchQuery.toLowerCase()) ||
    block.number.toString().includes(searchQuery)
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto max-w-7xl p-4 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2 mb-2">
            <Database className="h-8 w-8 text-primary" />
            TrustShield Blockchain Explorer
          </h1>
          <p className="text-muted-foreground">
            Explore transactions and blocks on the TrustShield security ledger
          </p>
        </div>

        {/* Network Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Latest Block</p>
                  <p className="text-2xl font-bold">{blocks[0]?.number.toLocaleString()}</p>
                </div>
                <Database className="h-8 w-8 text-blue-500" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {blocks[0] && `${Math.floor((Date.now() - blocks[0].timestamp.getTime()) / 1000)}s ago`}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Transactions</p>
                  <p className="text-2xl font-bold">{transactions.length.toLocaleString()}</p>
                </div>
                <Zap className="h-8 w-8 text-green-500" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">Last 24 hours</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Network Health</p>
                  <p className="text-2xl font-bold text-green-600">100%</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">All nodes operational</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Block Time</p>
                  <p className="text-2xl font-bold">15.2s</p>
                </div>
                <Clock className="h-8 w-8 text-purple-500" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">Last 100 blocks</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Tabs */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant={activeTab === 'transactions' ? 'default' : 'outline'}
                onClick={() => setActiveTab('transactions')}
              >
                Transactions
              </Button>
              <Button
                variant={activeTab === 'blocks' ? 'default' : 'outline'}
                onClick={() => setActiveTab('blocks')}
              >
                Blocks
              </Button>
            </div>
            
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by hash, address, or block number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === 'transactions' ? (
              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>
                    Latest transactions on the TrustShield network
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredTransactions.slice(0, 15).map(tx => (
                      <div 
                        key={tx.hash} 
                        className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                        onClick={() => setSelectedTransaction(tx)}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <Hash className="h-4 w-4 text-muted-foreground" />
                              <span className="font-mono text-sm">{truncateHash(tx.hash)}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  copyToClipboard(tx.hash)
                                }}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-muted-foreground">
                              <div>
                                <span className="font-medium">From:</span> {truncateHash(tx.from, 6)}
                              </div>
                              <div>
                                <span className="font-medium">To:</span> {truncateHash(tx.to, 6)}
                              </div>
                              <div>
                                <span className="font-medium">Block:</span> {tx.blockNumber}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2 mt-2">
                              <DollarSign className="h-3 w-3" />
                              <span className="text-sm font-medium">${tx.amount.toFixed(2)}</span>
                              <span className="text-xs text-muted-foreground">
                                {tx.timestamp.toLocaleTimeString()}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex flex-col gap-2 items-end">
                            {getStatusBadge(tx.status)}
                            {getRiskBadge(tx.riskScore)}
                            {getTypeBadge(tx.type)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Recent Blocks</CardTitle>
                  <CardDescription>
                    Latest blocks mined on the TrustShield network
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredBlocks.map(block => (
                      <div key={block.number} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Database className="h-4 w-4 text-muted-foreground" />
                              <span className="font-bold">Block #{block.number}</span>
                              <Badge variant="outline">{block.transactions} txns</Badge>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-muted-foreground mb-2">
                              <div>
                                <span className="font-medium">Hash:</span> {truncateHash(block.hash)}
                              </div>
                              <div>
                                <span className="font-medium">Miner:</span> {truncateHash(block.miner, 6)}
                              </div>
                              <div>
                                <span className="font-medium">Gas Used:</span> {block.gasUsed.toLocaleString()}
                              </div>
                              <div>
                                <span className="font-medium">Size:</span> {(block.size / 1024).toFixed(1)} KB
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Clock className="h-3 w-3" />
                              <span className="text-xs text-muted-foreground">
                                {block.timestamp.toLocaleString()}
                              </span>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-sm font-medium">
                              {((block.gasUsed / block.gasLimit) * 100).toFixed(1)}%
                            </div>
                            <div className="text-xs text-muted-foreground">Utilization</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Transaction Details */}
            {selectedTransaction && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Transaction Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-1">Transaction Hash</p>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs break-all">{selectedTransaction.hash}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(selectedTransaction.hash)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Amount</p>
                      <p className="text-lg font-bold">${selectedTransaction.amount.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Risk Score</p>
                      <p className="text-lg font-bold">{selectedTransaction.riskScore.toFixed(3)}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-2">Status</p>
                    {getStatusBadge(selectedTransaction.status)}
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-2">Type</p>
                    {getTypeBadge(selectedTransaction.type)}
                  </div>
                  
                  <div className="space-y-2 pt-2 border-t">
                    <div className="flex justify-between text-sm">
                      <span>Block Number:</span>
                      <span className="font-mono">{selectedTransaction.blockNumber}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Gas Used:</span>
                      <span>{selectedTransaction.gasUsed.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Transaction Fee:</span>
                      <span>${selectedTransaction.transactionFee.toFixed(6)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Timestamp:</span>
                      <span>{selectedTransaction.timestamp.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Network Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Network Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Confirmed Transactions</span>
                  <Badge variant="default" className="bg-green-500">
                    {transactions.filter(tx => tx.status === 'confirmed').length}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Pending Transactions</span>
                  <Badge variant="secondary">
                    {transactions.filter(tx => tx.status === 'pending').length}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Failed Transactions</span>
                  <Badge variant="destructive">
                    {transactions.filter(tx => tx.status === 'failed').length}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-sm">Average Risk Score</span>
                  <span className="font-medium">
                    {(transactions.reduce((sum, tx) => sum + tx.riskScore, 0) / transactions.length).toFixed(3)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Volume</span>
                  <span className="font-medium">
                    ${transactions.reduce((sum, tx) => sum + tx.amount, 0).toFixed(2)}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle>Explorer Tools</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Raw Block Data
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Address Analytics
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="h-4 w-4 mr-2" />
                  Security Audit Log
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Database className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}