/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/fraud-rings/route.ts
import { NextResponse } from "next/server";
import neo4j from "neo4j-driver";

const driver = neo4j.driver(
    process.env.NEO4J_URI!,
    neo4j.auth.basic(process.env.NEO4J_USERNAME!, process.env.NEO4J_PASSWORD!)
);

// This query finds users who have shared a device. This is a common pattern in fraud rings.
const fraudRingQuery = `
  MATCH (u1:User)-[:USED]->(d:Device)<-[:USED]-(u2:User)
  WHERE id(u1) < id(u2) // Avoid duplicate pairs and self-loops
  RETURN u1, d, u2
  LIMIT 25
`;

export async function GET() {
    const session = driver.session();
    try {
        const result = await session.run(fraudRingQuery);

        const nodes: any[] = [];
        const edges: any[] = [];
        const nodeIds = new Set();

        result.records.forEach(record => {
            const u1 = record.get('u1').properties;
            const d = record.get('d').properties;
            const u2 = record.get('u2').properties;

            // Add nodes if they haven't been added yet
            if (!nodeIds.has(u1.id)) {
                nodes.push({ id: u1.id, label: u1.name, group: 'user' });
                nodeIds.add(u1.id);
            }
            if (!nodeIds.has(u2.id)) {
                nodes.push({ id: u2.id, label: u2.name, group: 'user' });
                nodeIds.add(u2.id);
            }
            if (!nodeIds.has(d.id)) {
                nodes.push({ id: d.id, label: `Device: ${d.id}`, group: 'device' });
                nodeIds.add(d.id);
            }

            // Add edges
            edges.push({ from: u1.id, to: d.id });
            edges.push({ from: u2.id, to: d.id });
        });

        return NextResponse.json({ nodes, edges });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch fraud ring data" }, { status: 500 });
    } finally {
        await session.close();
    }
}