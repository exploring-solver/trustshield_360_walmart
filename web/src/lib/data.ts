// src/lib/data.ts
import { currentUser } from "@clerk/nextjs/server";

// --- TYPE DEFINITIONS ---
export interface User {
  name: string;
}

export interface RiskScore {
  value: number;
  level: 'Low' | 'Medium' | 'High';
  assessment: string;
}

export interface ActivityEvent {
  id: string;
  date: string;
  event: string;
  status: 'Success' | 'Failed' | 'Blocked';
  device: string;
  ipAddress: string;
  riskLevel: 'Low' | 'Medium' | 'High';
}

export interface ActiveSession {
  id: string;
  device: string;
  location: string;
  lastSeen: string;
  isCurrent: boolean;
}

export interface SecurityAlert {
  id: string;
  message: string;
  timestamp: string;
}

export interface SecurityData {
  user: User;
  riskScore: RiskScore;
  activityLog: ActivityEvent[];
  activeSessions: ActiveSession[];
  alerts: SecurityAlert[];
}

// This function simulates an API call to a secure backend.
export const getSecurityData = async (clientIp: string): Promise<SecurityData> => {
  const user = await currentUser();

  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    user: {
      name: user?.firstName || 'Guest',
    },
    riskScore: {
      value: 78,
      level: 'Medium',
      assessment: 'Unusual login location detected. Review active sessions.',
    },
    alerts: [
      {
        id: 'alert-1',
        message: 'A login attempt from an unrecognized device in Dublin, Ireland was blocked.',
        timestamp: '2025-06-26T22:10:00Z',
      },
    ],
    activityLog: [
      {
        id: 'evt-1',
        date: '2025-06-26 20:30 PM',
        event: 'Login',
        status: 'Success',
        device: 'Windows',
        ipAddress: `${clientIp}`, // Injected IP
        riskLevel: 'Low',
      },
      {
        id: 'evt-2',
        date: '2025-06-26 22:10 PM',
        event: 'Login Attempt',
        status: 'Blocked',
        device: 'Unknown Chrome on Windows',
        ipAddress: '198.51.100.1',
        riskLevel: 'High',
      },
      
      {
        id: 'evt-3',
        date: '2025-06-25 11:05 AM',
        event: 'Password Changed',
        status: 'Success',
        device: 'Chrome on macOS',
        ipAddress: '203.0.113.19',
        riskLevel: 'Low',
      },
      {
        id: 'evt-4',
        date: '2025-06-24 09:12 PM',
        event: 'Purchase',
        status: 'Success',
        device: 'Chrome on macOS',
        ipAddress: '172.217.22.14',
        riskLevel: 'Low',
      },
    ],
    activeSessions: [
      {
        id: 'session-1',
        device: 'Windows 11',
        location: `Mumbai, India • ${clientIp}`,
        lastSeen: 'Active Now',
        isCurrent: true,
      },
      {
        id: 'session-2',
        device: 'Chrome on macOS',
        location: 'Mumbai, India',
        lastSeen: 'Yesterday',
        isCurrent: false,
      },
      {
        id: 'session-3',
        device: 'Samsung Galaxy Tab S10',
        location: 'Pune, India',
        lastSeen: '3 days ago',
        isCurrent: false,
      },
    ],
  };
};

