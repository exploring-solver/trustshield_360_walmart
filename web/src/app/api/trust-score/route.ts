/* eslint-disable @typescript-eslint/no-explicit-any */
// File: src/app/api/trust-score/route.ts

import { NextResponse } from 'next/server';
import neo4j from 'neo4j-driver';
import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';

// --- Helper: Get IP Reputation from IPQS (No changes needed) ---
async function getIpReputation(ip: string): Promise<number> {
    // ... (This function remains the same as the previous implementation)
    const apiKey = process.env.IPQS_API_KEY;
    if (!apiKey) return 0;
    const url = `https://www.ipqualityscore.com/api/json/ip/${apiKey}/${ip}`;
    try {
        const res = await fetch(url);
        if (!res.ok) return 0;
        const data = await res.json();
        if (data.fraud_score > 75 || data.proxy || data.vpn || data.tor) return -0.5;
        if (data.fraud_score > 50) return -0.2;
        return 0.1;
    } catch (error) {
        console.error("IPQS Error:", error);
        return 0;
    }
}

// --- NEW: Real Decentralized Reputation Ledger with 4EVERLAND (S3-compatible) ---
const s3Client = new S3Client({
    endpoint: "https://endpoint.4everland.co",
    region: "us-west-1", // This can be any region, it's a required field
    credentials: {
        accessKeyId: process.env.FOUReverland_KEY!,
        secretAccessKey: process.env.FOUReverland_SECRET!,
    },
});

async function updateReputationLedger(userId: string, event: { type: string, timestamp: string }): Promise<number> {
    const bucketName = process.env.FOUReverland_BUCKET_NAME!;
    const fileName = `${userId}-reputation.json`;
    let reputationData: { events: any[], trustBonus: number } = { events: [], trustBonus: 0 };

    try {
        // 1. Fetch existing ledger from IPFS via 4EVERLAND
        const command = new GetObjectCommand({ Bucket: bucketName, Key: fileName });
        const response = await s3Client.send(command);
        const strData = await response.Body?.transformToString();
        if (strData) {
            reputationData = JSON.parse(strData);
        }
    } catch (error: any) {
        if (error.name !== 'NoSuchKey') {
           console.error("4EVERLAND Get Error:", error);
        }
        // If file doesn't exist, we'll create it.
    }

    // 2. Add the new event and update the bonus
    reputationData.events.push(event);
    reputationData.trustBonus += 0.01; // Each positive event adds a small, permanent bonus

    // 3. Upload the updated ledger back to IPFS
    try {
        const putCommand = new PutObjectCommand({
            Bucket: bucketName,
            Key: fileName,
            Body: JSON.stringify(reputationData, null, 2),
            ContentType: 'application/json'
        });
        await s3Client.send(putCommand);
        console.log(`Successfully updated reputation for ${userId} on IPFS.`);
    } catch (error) {
        console.error("4EVERLAND Put Error:", error);
        return 0; // Don't grant bonus if upload fails
    }

    return 0.01; // Return the small bonus
}


// --- Main API Handler ---
export async function POST(request: Request) {
    const driver = neo4j.driver(
    process.env.NEO4J_URI!,
    neo4j.auth.basic(process.env.NEO4J_USERNAME!, process.env.NEO4J_PASSWORD!)
);
    const session = driver.session();

    try {
        const { userId, behavioralScoreAdjustment } = await request.json();
        const ip = request.headers.get('x-forwarded-for') ?? '8.8.8.8';

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required.' }, { status: 400 });
        }

        // --- NEW: Fetch current score from Neo4j ---
        const readResult = await session.executeWrite(tx =>
            tx.run(
                'MERGE (u:User {userId: $userId}) ON CREATE SET u.trustScore = 0.7, u.lastUpdated = timestamp() RETURN u.trustScore AS score',
                { userId }
            )
        );
        let currentScore = readResult.records[0].get('score');

        // 1. Get IP Reputation
        const ipAdjustment = await getIpReputation(ip);
        currentScore += ipAdjustment;

        // 2. Add behavioral adjustment
        currentScore += behavioralScoreAdjustment;
        
        // 3. Update decentralized reputation on positive behavior
        if (behavioralScoreAdjustment > 0) {
            const reputationAdjustment = await updateReputationLedger(userId, {
                type: 'positive_behavior_detected',
                timestamp: new Date().toISOString()
            });
            currentScore += reputationAdjustment;
        }

        const finalScore = Math.max(0, Math.min(1, currentScore));

        // --- NEW: Persist the updated score back to Neo4j ---
        await session.executeWrite(tx =>
            tx.run(
                'MATCH (u:User {userId: $userId}) SET u.trustScore = $score, u.lastUpdated = timestamp()',
                { userId, score: finalScore }
            )
        );

        return NextResponse.json({
            userId: userId,
            trustScore: parseFloat(finalScore.toFixed(2)),
        });

    } catch (error) {
        console.error("Trust Score API Error:", error);
        return NextResponse.json({ error: "Failed to update trust score." }, { status: 500 });
    } finally {
        await session.close();
        await driver.close();
    }
}