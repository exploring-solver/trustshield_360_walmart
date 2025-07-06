import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { txId: string } }) {
  const { txId } = params;
  
  // Mock trace data
  const mockTrace = {
    transactionId: txId,
    amount: 125.50,
    status: txId.includes('fraud') ? 'blocked' : 'approved',
    timestamp: new Date().toISOString(),
    steps: [
      {
        name: 'Biometric Verification',
        success: !txId.includes('fraud'),
        duration: 1200,
        details: txId.includes('fraud') ? 'Biometric match failed' : 'Face recognition successful'
      },
      {
        name: 'PQC Handshake',
        success: true,
        duration: 800,
        details: 'CRYSTALS-Kyber key exchange completed'
      },
      {
        name: 'AI Fraud Analysis',
        success: !txId.includes('fraud'),
        duration: 2100,
        details: txId.includes('fraud') ? 'High risk score: 0.92' : 'Low risk score: 0.15'
      },
  {
        name: 'Zero Trust Validation',
        success: !txId.includes('fraud'),
        duration: 600,
        details: txId.includes('fraud') ? 'Step-up authentication required' : 'Context validated'
      },
      {
        name: 'Blockchain Logging',
        success: !txId.includes('fraud'),
        duration: 1500,
        details: txId.includes('fraud') ? 'Transaction blocked' : 'Logged to immutable ledger'
      }
    ],
    riskScore: txId.includes('fraud') ? 0.92 : 0.15,
    riskLevel: txId.includes('fraud') ? 'HIGH' : 'LOW',
    blockchainHash: txId.includes('fraud') ? null : `0x${Math.random().toString(16).substr(2, 64)}`,
    blockHeight: txId.includes('fraud') ? null : 45821
  };

  return NextResponse.json(mockTrace);
}
