// src/components/dashboard/active-sessions.tsx
"use client" // This component needs client-side interactivity

import { useState } from "react"
import { Smartphone, Monitor, Tablet, LogOut, MapPin, Clock, Wifi, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import type { ActiveSession } from "@/lib/data"

interface ActiveSessionsProps {
  sessions: ActiveSession[]
}

const DeviceIcon = ({ device }: { device: string }) => {
  if (device.toLowerCase().includes("iphone")) return <Smartphone className="h-5 w-5" />
  if (device.toLowerCase().includes("macos") || device.toLowerCase().includes("chrome"))
    return <Monitor className="h-5 w-5" />
  if (device.toLowerCase().includes("tab")) return <Tablet className="h-5 w-5" />
  return <Smartphone className="h-5 w-5" />
}

export function ActiveSessions({ sessions }: ActiveSessionsProps) {
  const [sessionList, setSessionList] = useState(sessions)

  const handleRevoke = (sessionId: string) => {
    // In a real app, this would be an API call.
    console.log(`Revoking session ${sessionId}`)
    setSessionList(sessionList.filter((s) => s.id !== sessionId))
  }

  return (
    <div className="space-y-4">
      {sessionList.map((session) => (
        <div
          key={session.id}
          className={`p-4 rounded-xl border transition-all duration-200 ${
            session.isCurrent
              ? "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800"
              : "bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-white/20 dark:border-slate-700/50 hover:bg-white/80 dark:hover:bg-slate-800/80"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  session.isCurrent ? "bg-green-100 dark:bg-green-900" : "bg-slate-100 dark:bg-slate-800"
                }`}
              >
                <DeviceIcon device={session.device} />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-foreground">{session.device}</p>
                  {session.isCurrent && (
                    <Badge
                      variant="secondary"
                      className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs"
                    >
                      Current Session
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span>{session.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{session.lastSeen}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Wifi className="h-3 w-3" />
                    <span className="text-green-600 dark:text-green-400">Active</span>
                  </div>
                </div>
              </div>
            </div>

            {!session.isCurrent && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="hover:bg-red-50 hover:border-red-200 hover:text-red-700 bg-transparent"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Revoke
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Revoke Session Access?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will immediately sign out the device &quot;{session.device}&quot; in {session.location}. The
                      user will need to log in again on that device.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleRevoke(session.id)} className="bg-red-600 hover:bg-red-700">
                      Yes, Revoke Access
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      ))}

      {sessionList.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>No active sessions found</p>
        </div>
      )}
    </div>
  )
}
