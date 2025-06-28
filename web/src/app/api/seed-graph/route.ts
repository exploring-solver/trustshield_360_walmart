// src/app/api/seed-graph/route.ts
import { NextResponse } from "next/server";
import neo4j from "neo4j-driver";

const driver = neo4j.driver(
    process.env.NEO4J_URI!,
    neo4j.auth.basic(process.env.NEO4J_USERNAME!, process.env.NEO4J_PASSWORD!)
);

const seedQuery = `
  MERGE (u1:User {id: 'user-001', name: 'Alice'})
  MERGE (u2:User {id: 'user-002', name: 'Bob'})
  MERGE (u3:User {id: 'user-fraud-A', name: 'Charlie (Fraud)'})
  MERGE (u4:User {id: 'user-fraud-B', name: 'David (Fraud)'})
  MERGE (u5:User {id: 'user-fraud-C', name: 'Eve (Fraud)'})

  MERGE (d1:Device {id: 'device-A'})
  MERGE (d2:Device {id: 'device-B'})
  MERGE (d3:Device {id: 'device-C'})
  MERGE (d_fraud:Device {id: 'device-SHARED-FRAUD'}) // Shared device

  MERGE (ip1:IP {address: '192.168.1.1'})
  MERGE (ip2:IP {address: '10.0.0.1'})
  MERGE (ip_fraud:IP {address: '203.0.113.55'}) // Fraudulent IP

  MERGE (u1)-[:USED]->(d1)
  MERGE (u1)-[:LOGGED_IN_FROM]->(ip1)
  MERGE (u2)-[:USED]->(d2)
  MERGE (u2)-[:LOGGED_IN_FROM]->(ip2)

  // Fraud Ring
  MERGE (u3)-[:USED]->(d_fraud)
  MERGE (u4)-[:USED]->(d_fraud)
  MERGE (u5)-[:USED]->(d_fraud)
  MERGE (u3)-[:LOGGED_IN_FROM]->(ip_fraud)
  MERGE (u4)-[:LOGGED_IN_FROM]->(ip_fraud)
`;

export async function GET() {
    const session = driver.session();
    try {
        await session.run('MATCH (n) DETACH DELETE n'); // Clear existing graph
        await session.run(seedQuery);
        return NextResponse.json({ message: "Graph seeded successfully!" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to seed graph" }, { status: 500 });
    } finally {
        await session.close();
    }
}
