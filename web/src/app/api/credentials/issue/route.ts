import { NextResponse } from 'next/server';

export async function GET() {
  // Mock fraud analytics data
  const trends = {
    daily: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      fraudAttempts: Math.floor(Math.random() * 50) + 10,
      blockedTransactions: Math.floor(Math.random() * 45) + 5,
      riskScore: Math.random() * 0.3 + 0.1
    })),
    hourly: Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      fraudAttempts: Math.floor(Math.random() * 20) + (i >= 2 && i <= 5 ? 30 : 0), // Higher at night
      riskScore: Math.random() * 0.5 + (i >= 2 && i <= 5 ? 0.3 : 0.1)
    })),
    topRiskFactors: [
      { factor: 'Unusual Hours (2-5 AM)', count: 156, percentage: 23.4 },
      { factor: 'High Transaction Amount', count: 134, percentage: 20.1 },
      { factor: 'Unrecognized Device', count: 98, percentage: 14.7 },
      { factor: 'Location Mismatch', count: 87, percentage: 13.1 },
      { factor: 'Multiple Gift Cards', count: 73, percentage: 11.0 },
      { factor: 'Velocity Check Failed', count: 52, percentage: 7.8 }
    ],
    fraudRings: [
      {
        id: 'ring_001',
        accounts: 4,
        sharedDevices: 2,
        totalAttempts: 23,
        riskScore: 0.94,
        status: 'active'
      },
      {
        id: 'ring_002',
        accounts: 3,
        sharedDevices: 1,
        totalAttempts: 15,
        riskScore: 0.87,
        status: 'monitored'
      }
    ]
  };

  return NextResponse.json(trends);
}
