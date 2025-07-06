import { NextResponse } from 'next/server';

export async function GET() {
  const systemHealth = {
    overall: 'healthy',
    uptime: '99.97%',
    lastIncident: '2024-01-10T15:30:00Z',
    services: {
      aiCortex: { status: 'online', responseTime: 45, errorRate: 0.01 },
      quantumHandshake: { status: 'online', responseTime: 120, errorRate: 0.03 },
      blockchain: { status: 'online', responseTime: 1200, errorRate: 0.00 },
      visionGuard: { status: 'online', responseTime: 200, errorRate: 0.05 },
      database: { status: 'online', responseTime: 15, errorRate: 0.00 },
      apiGateway: { status: 'online', responseTime: 25, errorRate: 0.02 }
    },
    resources: {
      cpu: { usage: 67, threshold: 80, status: 'normal' },
      memory: { usage: 54, threshold: 85, status: 'normal' },
      storage: { usage: 43, threshold: 90, status: 'normal' },
      network: { usage: 23, threshold: 70, status: 'normal' }
    },
    alerts: [
      {
        id: 'alert_001',
        severity: 'medium',
        message: 'High transaction volume detected',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        resolved: false
      }
    ]
  };

  return NextResponse.json(systemHealth);
}