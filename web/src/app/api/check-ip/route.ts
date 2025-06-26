// src/app/api/check-ip/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { ipAddress } = await request.json();

  if (!ipAddress) {
    return NextResponse.json({ error: 'IP address is required' }, { status: 400 });
  }

  const ABUSEIPDB_KEY = process.env.ABUSEIPDB_API_KEY;
  if (!ABUSEIPDB_KEY) {
    return NextResponse.json({ error: 'API key is not configured' }, { status: 500 });
  }

  const API_URL = `https://api.abuseipdb.com/api/v2/check`;

  try {
    const response = await fetch(`${API_URL}?ipAddress=${ipAddress}&maxAgeInDays=90&verbose`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Key': ABUSEIPDB_KEY,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      // Forward the error from AbuseIPDB
      return NextResponse.json({ error: errorData.errors[0].detail }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Failed to fetch from AbuseIPDB:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
