import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { txId: string } }) {
  const { txId } = params;
  
  const isFraud = txId.includes('fraud') || Math.random() > 0.8;
  
  const mockRiskAnalysis = {
    transactionId: txId,
    overallScore: isFraud ? 0.87 : 0.23,
    riskLevel: isFraud ? 'HIGH' : 'LOW',
    recommendation: isFraud ? 'BLOCK_TRANSACTION' : 'APPROVE',
    factors: isFraud ? [
      {
        name: 'Transaction Amount',
        impact: 0.3,
        description: 'High value transaction ($1,500+) outside normal pattern'
      },
      {
        name: 'Time of Purchase',
        impact: 0.2,
        description: 'Transaction at 2:30 AM - unusual shopping hours'
      },
      {
        name: 'Device Recognition',
        impact: 0.4,
        description: 'Unrecognized device with low trust score'
      },
      {
        name: 'Location Mismatch',
        impact: 0.25,
        description: 'Purchase location differs from registered address'
      }
    ] : [
      {
        name: 'User History',
        impact: 0.1,
        description: 'Consistent shopping pattern, verified customer'
      },
      {
        name: 'Transaction Type',
        impact: 0.05,
        description: 'Normal grocery and household items'
      },
      {
        name: 'Device Trust',
        impact: 0.08,
        description: 'Recognized device with high trust score'
      }
    ],
    tabTransformerScore: isFraud ? 0.91 : 0.12,
    featureImportance: ['amount', 'time', 'location', 'device_trust'],
    gnnScore: isFraud ? 0.78 : 0.05,
    connectedEntities: isFraud ? 4 : 0
  };

  return NextResponse.json(mockRiskAnalysis);
}
