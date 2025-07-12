'use client'
import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    Brain,
    Network,
    Eye,
    AlertTriangle,
    TrendingUp,
    Users,
    Clock,
    MapPin,
    CreditCard,
    Target,
    Zap
} from 'lucide-react'

interface RiskAnalysis {
    transactionId: string
    overallRiskScore: number
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
    recommendation: string
    tabTransformer: {
        score: number
        confidence: number
        topFeatures: Array<{
            name: string
            importance: number
            value: string
            risk: 'low' | 'medium' | 'high'
        }>
    }
    gnn: {
        score: number
        fraudRingProbability: number
        connectedEntities: number
        suspiciousConnections: Array<{
            type: string
            count: number
            riskLevel: string
        }>
    }
    visionGuard: {
        score: number
        behaviorAnalysis: string
        confidenceLevel: number
        detectedObjects: string[]
        anomalies: string[]
    }
    riskFactors: Array<{
        factor: string
        impact: number
        description: string
        category: string
    }>
}

interface RiskExplanationModalProps {
    transactionData: any
    onClose?: () => void
}

export default function RiskExplanationModal({ transactionData = {
    id: 'TX-007',
    amount: 1500,
    timestamp: new Date().toISOString(),
    items: [{ name: 'Gift Card' }],
    shippingAddress: { city: 'Chicago' },
    billingAddress: { city: 'New York' }
}, onClose }: RiskExplanationModalProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [riskAnalysis, setRiskAnalysis] = useState<RiskAnalysis | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const generateMockRiskAnalysis = (transaction: any): RiskAnalysis => {
        // Provide defaults to avoid undefined errors
        const amount = transaction.amount ?? 0
        const items = transaction.items ?? []
        const timestamp = transaction.timestamp ?? new Date().toISOString()
        const shippingAddress = transaction.shippingAddress ?? {}
        const billingAddress = transaction.billingAddress ?? {}

        const isHighRisk = amount > 1000 ||
            items.some((item: any) => item.name?.toLowerCase().includes('gift card')) ||
            new Date(timestamp).getHours() < 6

        const overallRiskScore = isHighRisk ? 0.87 : 0.23

        return {
            transactionId: transaction.id || 'TX-' + Date.now(),
            overallRiskScore,
            riskLevel: overallRiskScore > 0.8 ? 'HIGH' : overallRiskScore > 0.5 ? 'MEDIUM' : 'LOW',
            recommendation: isHighRisk ? 'BLOCK_TRANSACTION' : 'APPROVE',
            tabTransformer: {
                score: isHighRisk ? 0.89 : 0.15,
                confidence: 0.94,
                topFeatures: [
                    {
                        name: 'Transaction Amount',
                        importance: 0.32,
                        value: `$${amount}`,
                        risk: amount > 1000 ? 'high' : 'low'
                    },
                    {
                        name: 'Time of Day',
                        importance: 0.28,
                        value: new Date(timestamp).toLocaleTimeString(),
                        risk: new Date(timestamp).getHours() < 6 ? 'high' : 'low'
                    },
                    {
                        name: 'Item Categories',
                        importance: 0.25,
                        value: items.map((i: any) => i.name).join(', ') || 'Unknown',
                        risk: items.some((item: any) => item.name?.toLowerCase().includes('gift card')) ? 'high' : 'low'
                    },
                    {
                        name: 'Location Match',
                        importance: 0.15,
                        value: shippingAddress.city || 'Unknown',
                        risk: shippingAddress.city !== billingAddress.city ? 'medium' : 'low'
                    }
                ]
            },
            gnn: {
                score: isHighRisk ? 0.76 : 0.08,
                fraudRingProbability: isHighRisk ? 0.82 : 0.05,
                connectedEntities: isHighRisk ? 4 : 0,
                suspiciousConnections: isHighRisk ? [
                    { type: 'Shared Device', count: 3, riskLevel: 'HIGH' },
                    { type: 'Common IP Address', count: 2, riskLevel: 'MEDIUM' },
                    { type: 'Similar Purchase Pattern', count: 4, riskLevel: 'HIGH' }
                ] : []
            },
            visionGuard: {
                score: isHighRisk ? 0.72 : 0.12,
                behaviorAnalysis: isHighRisk ? 'Suspicious movement patterns detected' : 'Normal shopping behavior',
                confidenceLevel: 0.91,
                detectedObjects: ['person', 'shopping_cart', 'product_items'],
                anomalies: isHighRisk ? ['rapid_movement', 'concealment_behavior'] : []
            },
            riskFactors: isHighRisk ? [
                {
                    factor: 'High Transaction Value',
                    impact: 0.3,
                    description: 'Transaction amount significantly above user average',
                    category: 'Financial'
                },
                {
                    factor: 'Unusual Time Pattern',
                    impact: 0.25,
                    description: 'Transaction occurring outside normal business hours',
                    category: 'Temporal'
                },
                {
                    factor: 'Gift Card Purchase',
                    impact: 0.4,
                    description: 'Multiple gift cards often indicate fraudulent activity',
                    category: 'Product'
                }
            ] : [
                {
                    factor: 'Normal Purchase Pattern',
                    impact: 0.1,
                    description: 'Transaction aligns with typical user behavior',
                    category: 'Behavioral'
                }
            ]
        }
    }

    const handleAnalyze = async () => {
        setIsLoading(true)
        setIsOpen(true)

        // Defensive: check transactionData before using
        if (!transactionData || typeof transactionData.amount === 'undefined') {
            setRiskAnalysis(null)
            setIsLoading(false)
            alert('Transaction data is missing or invalid.')
            return
        }

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000))

        const analysis = generateMockRiskAnalysis(transactionData)
        setRiskAnalysis(analysis)
        setIsLoading(false)
    }

    const getRiskColor = (level: string) => {
        switch (level) {
            case 'HIGH':
            case 'CRITICAL':
                return 'text-red-600 bg-red-50 border-red-200'
            case 'MEDIUM':
                return 'text-yellow-600 bg-yellow-50 border-yellow-200'
            default:
                return 'text-green-600 bg-green-50 border-green-200'
        }
    }

    const getFeatureRiskColor = (risk: string) => {
        switch (risk) {
            case 'high': return 'text-red-600'
            case 'medium': return 'text-yellow-600'
            default: return 'text-green-600'
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <div className='flex items-center justify-center h-72'>
                    <Button variant="outline" onClick={handleAnalyze} className="gap-2  text-center ">
                        <Brain className="h-4 w-4" />
                        Analyze Risk Factors
                    </Button>
                </div>
            </DialogTrigger>

            <DialogContent className=" max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Brain className="h-5 w-5 text-primary" />
                        AI Cortex Risk Analysis
                    </DialogTitle>
                    <DialogDescription>
                        Comprehensive breakdown of transaction risk assessment using multiple AI models
                    </DialogDescription>
                </DialogHeader>

                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center space-y-4">
                            <Brain className="h-12 w-12 animate-pulse text-primary mx-auto" />
                            <p className="text-lg font-medium">Analyzing Transaction...</p>
                            <p className="text-sm text-muted-foreground">Running TabTransformer, GNN, and VisionGuard models</p>
                        </div>
                    </div>
                ) : riskAnalysis ? (
                    <div className="space-y-6">
                        {/* Overall Risk Score */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <span>Overall Risk Assessment</span>
                                    <Badge className={getRiskColor(riskAnalysis.riskLevel)}>
                                        {riskAnalysis.riskLevel} RISK
                                    </Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                    <div className="text-center">
                                        <div className="text-3xl font-bold mb-1" style={{
                                            color: riskAnalysis.overallRiskScore > 0.7 ? '#dc2626' :
                                                riskAnalysis.overallRiskScore > 0.3 ? '#d97706' : '#16a34a'
                                        }}>
                                            {(riskAnalysis.overallRiskScore * 100).toFixed(0)}%
                                        </div>
                                        <div className="text-sm text-muted-foreground">Risk Score</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-lg font-semibold mb-1">{riskAnalysis.recommendation}</div>
                                        <div className="text-sm text-muted-foreground">Recommendation</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-lg font-semibold mb-1">{riskAnalysis.transactionId}</div>
                                        <div className="text-sm text-muted-foreground">Transaction ID</div>
                                    </div>
                                </div>
                                <Progress
                                    value={riskAnalysis.overallRiskScore * 100}
                                    className="h-3"
                                />
                            </CardContent>
                        </Card>

                        {/* AI Model Breakdown */}
                        <Tabs defaultValue="tabtransformer" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="tabtransformer" className="gap-2">
                                    <Target className="h-4 w-4" />
                                    TabTransformer
                                </TabsTrigger>
                                <TabsTrigger value="gnn" className="gap-2">
                                    <Network className="h-4 w-4" />
                                    Graph Neural Network
                                </TabsTrigger>
                                <TabsTrigger value="vision" className="gap-2">
                                    <Eye className="h-4 w-4" />
                                    VisionGuard
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="tabtransformer" className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Target className="h-5 w-5" />
                                            TabTransformer Analysis
                                        </CardTitle>
                                        <CardDescription>
                                            Tabular data analysis using transformer architecture for feature importance
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                            <div className="text-center p-4 bg-muted rounded-lg">
                                                <div className="text-2xl font-bold">{(riskAnalysis.tabTransformer.score * 100).toFixed(1)}%</div>
                                                <div className="text-sm text-muted-foreground">Model Score</div>
                                            </div>
                                            <div className="text-center p-4 bg-muted rounded-lg">
                                                <div className="text-2xl font-bold">{(riskAnalysis.tabTransformer.confidence * 100).toFixed(1)}%</div>
                                                <div className="text-sm text-muted-foreground">Confidence</div>
                                            </div>
                                        </div>

                                        <h4 className="font-semibold mb-3">Feature Importance</h4>
                                        <div className="space-y-3">
                                            {riskAnalysis.tabTransformer.topFeatures.map((feature, index) => (
                                                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                                    <div className="flex-1">
                                                        <div className="font-medium">{feature.name}</div>
                                                        <div className="text-sm text-muted-foreground">{feature.value}</div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-24">
                                                            <Progress value={feature.importance * 100} className="h-2" />
                                                        </div>
                                                        <Badge variant="outline" className={getFeatureRiskColor(feature.risk)}>
                                                            {feature.risk.toUpperCase()}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="gnn" className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Network className="h-5 w-5" />
                                            Graph Neural Network Analysis
                                        </CardTitle>
                                        <CardDescription>
                                            Network analysis for fraud ring detection and entity relationships
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-3 gap-4 mb-6">
                                            <div className="text-center p-4 bg-muted rounded-lg">
                                                <div className="text-2xl font-bold">{(riskAnalysis.gnn.score * 100).toFixed(1)}%</div>
                                                <div className="text-sm text-muted-foreground">GNN Score</div>
                                            </div>
                                            <div className="text-center p-4 bg-muted rounded-lg">
                                                <div className="text-2xl font-bold">{(riskAnalysis.gnn.fraudRingProbability * 100).toFixed(1)}%</div>
                                                <div className="text-sm text-muted-foreground">Fraud Ring Probability</div>
                                            </div>
                                            <div className="text-center p-4 bg-muted rounded-lg">
                                                <div className="text-2xl font-bold">{riskAnalysis.gnn.connectedEntities}</div>
                                                <div className="text-sm text-muted-foreground">Connected Entities</div>
                                            </div>
                                        </div>

                                        {riskAnalysis.gnn.suspiciousConnections.length > 0 && (
                                            <>
                                                <h4 className="font-semibold mb-3">Suspicious Connections</h4>
                                                <div className="space-y-2">
                                                    {riskAnalysis.gnn.suspiciousConnections.map((connection, index) => (
                                                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                                            <div className="flex items-center gap-2">
                                                                <Users className="h-4 w-4 text-muted-foreground" />
                                                                <span className="font-medium">{connection.type}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-sm text-muted-foreground">{connection.count} instances</span>
                                                                <Badge variant="destructive">{connection.riskLevel}</Badge>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="vision" className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Eye className="h-5 w-5" />
                                            VisionGuard Analysis
                                        </CardTitle>
                                        <CardDescription>
                                            Computer vision analysis of customer behavior and shopping patterns
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                            <div className="text-center p-4 bg-muted rounded-lg">
                                                <div className="text-2xl font-bold">{(riskAnalysis.visionGuard.score * 100).toFixed(1)}%</div>
                                                <div className="text-sm text-muted-foreground">Vision Score</div>
                                            </div>
                                            <div className="text-center p-4 bg-muted rounded-lg">
                                                <div className="text-2xl font-bold">{(riskAnalysis.visionGuard.confidenceLevel * 100).toFixed(1)}%</div>
                                                <div className="text-sm text-muted-foreground">Confidence Level</div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <h4 className="font-semibold mb-2">Behavior Analysis</h4>
                                                <p className="text-sm text-muted-foreground p-3 bg-muted rounded-lg">
                                                    {riskAnalysis.visionGuard.behaviorAnalysis}
                                                </p>
                                            </div>

                                            <div>
                                                <h4 className="font-semibold mb-2">Detected Objects</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {riskAnalysis.visionGuard.detectedObjects.map((obj, index) => (
                                                        <Badge key={index} variant="outline">{obj}</Badge>
                                                    ))}
                                                </div>
                                            </div>

                                            {riskAnalysis.visionGuard.anomalies.length > 0 && (
                                                <div>
                                                    <h4 className="font-semibold mb-2">Detected Anomalies</h4>
                                                    <div className="space-y-2">
                                                        {riskAnalysis.visionGuard.anomalies.map((anomaly, index) => (
                                                            <div key={index} className="flex items-center gap-2 p-2 border rounded-lg border-red-200 text-black bg-red-50">
                                                                <AlertTriangle className="h-4 w-4 text-red-500" />
                                                                <span className="text-sm">{anomaly.replace('_', ' ').toUpperCase()}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>

                        {/* Risk Factors Summary */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Risk Factors Summary</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {riskAnalysis.riskFactors.map((factor, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                            <div className="flex-1">
                                                <div className="font-medium">{factor.factor}</div>
                                                <div className="text-sm text-muted-foreground">{factor.description}</div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline">{factor.category}</Badge>
                                                <div className="w-16 text-right">
                                                    <span className="text-sm font-medium">{(factor.impact * 100).toFixed(0)}%</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                ) : null}
            </DialogContent>
        </Dialog>
    )
}