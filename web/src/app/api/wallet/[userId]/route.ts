import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  const { userId } = params;

  // Mock wallet data
  const mockWallet = {
    userId,
    isFrozen: userId.includes('fraud'),
    balance: Math.random() * 1000 + 100,
    loyaltyPoints: Math.floor(Math.random() * 5000) + 500,
    lastActivity: new Date(Date.now() - Math.random() * 86400000).toISOString(),
    freezeReason: userId.includes('fraud') ? 'Suspicious transaction pattern detected' : null,
    verificationLevel: userId.includes('fraud') ? 'BASIC' : 'VERIFIED',
    credentials: [
      {
        id: `vc_${userId}_identity`,
        type: 'IdentityCredential',
        status: userId.includes('fraud') ? 'REVOKED' : 'ACTIVE',
        issuedAt: '2024-01-15T10:30:00Z'
      }
    ]
  };

  return NextResponse.json(mockWallet);
}