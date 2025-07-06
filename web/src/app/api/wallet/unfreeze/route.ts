import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { userId, reason } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Mock unfreeze process
    await new Promise(resolve => setTimeout(resolve, 500));

    return NextResponse.json({
      success: true,
      userId,
      action: 'unfreeze',
      reason: reason || 'Manual review completed',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Wallet unfreeze error:', error);
    return NextResponse.json({ error: 'Failed to unfreeze wallet' }, { status: 500 });
  }
}