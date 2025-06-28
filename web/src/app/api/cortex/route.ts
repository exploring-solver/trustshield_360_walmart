/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/cortex/route.ts

import { NextResponse } from "next/server";

// A simplified rule-based engine to mock a TabTransformer model.
function getRiskScore(transaction: any) {
  let riskScore = 0;
  const explanations: string[] = [];

  // Rule 1: High transaction amount
  if (transaction.amount > 1000) {
    riskScore += 0.3;
    explanations.push("High transaction amount detected.");
  }

  // Rule 2: Unusual purchase items (e.g., multiple gift cards)
  const giftCardCount = transaction.items.filter((item: any) =>
    item.name.toLowerCase().includes("gift card")
  ).length;
  if (giftCardCount > 2) {
    riskScore += 0.4;
    explanations.push("Unusual purchase of multiple gift cards.");
  }

  // Rule 3: Transaction at an odd time (e.g., 2-5 AM)
  const transactionHour = new Date(transaction.timestamp).getUTCHours();
  if (transactionHour >= 2 && transactionHour <= 5) {
    riskScore += 0.2;
    explanations.push("Transaction occurred during unusual hours (2-5 AM).");
  }

  // Rule 4: Mismatch between shipping and billing location (simplified)
  if (transaction.shippingAddress?.city !== transaction.billingAddress?.city) {
      riskScore += 0.25;
      explanations.push("Shipping and billing city do not match.");
  }

  // Cap the risk score at 1.0
  const finalScore = Math.min(riskScore, 1.0);

  return {
    score: parseFloat(finalScore.toFixed(2)),
    explanations: explanations.length > 0 ? explanations : ["Normal activity detected."],
  };
}

export async function POST(request: Request) {
  try {
    const transaction = await request.json();

    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction data is required." },
        { status: 400 }
      );
    }

    const { score, explanations } = getRiskScore(transaction);

    return NextResponse.json({
      riskScore: score,
      explanations: explanations,
      transactionId: transaction.id || `txn_${Date.now()}`,
      status: score > 0.7 ? "Flagged for Review" : "Approved",
    });

  } catch (error) {
    console.error("Error in AI Cortex:", error);
    return NextResponse.json(
      { error: "An internal error occurred." },
      { status: 500 }
    );
  }
}