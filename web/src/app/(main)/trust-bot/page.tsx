// File: src/app/copilot-demo/page.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CopilotTrigger } from "@/components/ai/copilot-trigger";

// --- Mock Data for Demonstration ---
const securityEvents = [
  {
    type: 'High-Risk Transaction Blocked',
    user: 'alex.doe@example.com',
    riskScore: 0.92,
    timestamp: '2025-07-07T22:10:00Z',
  },
  {
    type: 'Suspicious Login Attempt',
    ip: '103.22.14.88',
    abuseConfidence: 85,
    user: 'unknown',
    device: 'Chrome on Windows',
    timestamp: '2025-07-07T21:55:12Z',
  },
  {
    type: 'Password Changed',
    user: 'sarah.jones@example.com',
    ip: '203.0.113.15',
    timestamp: '2025-07-07T18:30:45Z',
  },
];

export default function CopilotDemoPage() {
  return (
    <main className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Security Event Log</h1>
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event Type</TableHead>
                <TableHead>User / IP</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {securityEvents.map((event, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="font-medium">{event.type}</div>
                    {event.riskScore && <Badge variant="destructive">Risk: {event.riskScore}</Badge>}
                    {event.abuseConfidence && <Badge variant="destructive">Abuse Score: {event.abuseConfidence}</Badge>}
                  </TableCell>
                  <TableCell>{event.user || event.ip}</TableCell>
                  <TableCell>{new Date(event.timestamp).toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    {/* Here is our trigger component, passing the event data as a prop */}
                    <CopilotTrigger event={event} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}