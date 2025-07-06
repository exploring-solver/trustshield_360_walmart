import { NextResponse } from 'next/server';

export async function GET() {
  // Real-time events endpoint for monitoring dashboard
  const events = Array.from({ length: 20 }, (_, i) => {
    const eventTypes = ['quantum', 'fraud', 'blockchain', 'biometric', 'alert'];
    const severities = ['low', 'medium', 'high', 'critical'];
    const type = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    
    const messages = {
      quantum: ['PQC handshake completed', 'Quantum session established', 'Key exchange verified'],
      fraud: ['High-risk transaction flagged', 'Suspicious pattern detected', 'Account frozen'],
      blockchain: ['Transaction logged to ledger', 'Block validated', 'Smart contract executed'],
      biometric: ['Face recognition failed', 'New device registered', 'Biometric verified'],
      alert: ['Fraud ring detected', 'Emergency protocol activated', 'System alert triggered']
    };

    return {
      id: `event_${Date.now()}_${i}`,
      type,
      severity: severities[Math.floor(Math.random() * severities.length)],
      message: messages[type as keyof typeof messages][Math.floor(Math.random() * 3)],
      timestamp: new Date(Date.now() - i * 30000).toISOString(), // 30 seconds apart
      userId: `user-${Math.floor(Math.random() * 9999).toString().padStart(4, '0')}`,
      transactionId: `tx-${Math.floor(Math.random() * 99999).toString().padStart(5, '0')}`
    };
  });

  return NextResponse.json({ events });
}