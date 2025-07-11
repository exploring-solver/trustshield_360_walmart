// File: src/components/copilot-chat.tsx
"use client"

import { useChat } from "ai/react"
import { useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Bot, User, Send, Loader2, Shield, AlertTriangle, Sparkles } from 'lucide-react'
import Balancer from "react-wrap-balancer"

// Define the shape of a security event object for type safety
interface SecurityEvent {
  type: string
  ip?: string
  user?: string
  device?: string
  riskScore?: number
  abuseConfidence?: number
  timestamp: string
}

interface CopilotChatProps {
  event: SecurityEvent // The specific event this chat session is about
}

export function CopilotChat({ event }: CopilotChatProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  // Format the initial event data into a string for the first message
  const initialMessageContent = `Explain this security event for me: \n\`\`\`json\n${JSON.stringify(
    event,
    null,
    2
  )}\n\`\`\``

  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
    api: "/api/copilot", // The API endpoint we created
    // The initial message is the context of the security event.
    // This is sent to the LLM automatically when the chat loads.
    initialMessages: [
      {
        id: "initial-event",
        role: "user",
        content: initialMessageContent,
      },
    ],
  })

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  // This effect clears the chat if the user opens a new event
  useEffect(() => {
    setMessages([
      {
        id: "initial-event",
        role: "user",
        content: initialMessageContent,
      },
    ])
  }, [event, setMessages, initialMessageContent])

  const getEventSeverity = () => {
    if (event.riskScore && event.riskScore > 0.8) return "high"
    if (event.abuseConfidence && event.abuseConfidence > 70) return "high"
    if (event.type.toLowerCase().includes("suspicious") || event.type.toLowerCase().includes("blocked")) return "medium"
    return "low"
  }

  const severity = getEventSeverity()

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-accent/50 to-white dark:from-slate-900/50 dark:to-slate-950">
      {/* Event Context Header */}
      <div className="flex-shrink-0 p-4 border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                severity === "high"
                  ? "bg-red-100 dark:bg-red-900"
                  : severity === "medium"
                    ? "bg-yellow-100 dark:bg-yellow-900"
                    : "bg-green-100 dark:bg-green-900"
              }`}
            >
              {severity === "high" ? (
                <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
              ) : (
                <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-sm">{event.type}</h3>
              <p className="text-xs text-muted-foreground">{new Date(event.timestamp).toLocaleString()}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {event.user && (
              <Badge variant="outline" className="text-xs">
                User: {event.user}
              </Badge>
            )}
            {event.ip && (
              <Badge variant="outline" className="text-xs">
                IP: {event.ip}
              </Badge>
            )}
            {event.riskScore && (
              <Badge
                variant={event.riskScore > 0.8 ? "destructive" : "secondary"}
                className="text-xs"
              >
                Risk: {event.riskScore}
              </Badge>
            )}
            {event.abuseConfidence && (
              <Badge
                variant={event.abuseConfidence > 70 ? "destructive" : "secondary"}
                className="text-xs"
              >
                Abuse: {event.abuseConfidence}%
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full" ref={scrollRef}>
          <div className="p-4 space-y-4">
            {messages.map((m) =>
              // Hide the initial prompt for a cleaner UI
              m.id !== "initial-event" ? (
                <div key={m.id} className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}>
                  {m.role === "assistant" && (
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent-foreground rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl p-4 ${
                      m.role === "user"
                        ? "bg-gradient-to-r from-primary to-accent-foreground text-white ml-auto"
                        : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm"
                    }`}
                  >
                    <div className={`text-sm ${m.role === "user" ? "text-white" : "text-foreground"}`}>
                      <Balancer>{m.content}</Balancer>
                    </div>
                  </div>
                  {m.role === "user" && (
                    <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
              ) : null
            )}

            {/* Loading State */}
            {isLoading && messages.length > 0 && messages[messages.length - 1].role === "user" && (
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent-foreground rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Analyzing security event...</span>
                  </div>
                </div>
              </div>
            )}

            {/* Empty State */}
            {messages.length === 1 && (
              <div className="text-center py-8 space-y-3">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent-foreground rounded-full flex items-center justify-center mx-auto">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">TrustShield AI Assistant</h3>
                  <p className="text-sm text-muted-foreground">
                    I'm analyzing this security event. Ask me anything about it!
                  </p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Input Form */}
      <div className="flex-shrink-0 p-4 border-t bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Ask about this security event..."
              className="pr-12 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400"
              disabled={isLoading}
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 bg-gradient-to-r from-primary to-accent-foreground hover:from-accent-foreground hover:to-primary"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </div>
        </form>

        <div className="flex items-center justify-center mt-2">
          <p className="text-xs text-muted-foreground">
            Powered by AI • Quantum-safe • Privacy-first
          </p>
        </div>
      </div>
    </div>
  )
}
