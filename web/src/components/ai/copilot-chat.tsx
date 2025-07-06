// File: src/components/copilot-chat.tsx
'use client';

import { useChat } from 'ai/react';
import { useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, User, Send, Loader2 } from 'lucide-react';
import Balancer from 'react-wrap-balancer';

// Define the shape of a security event object for type safety
interface SecurityEvent {
  type: string;
  ip?: string;
  user?: string;
  device?: string;
  riskScore?: number;
  abuseConfidence?: number;
  timestamp: string;
}

interface CopilotChatProps {
  event: SecurityEvent; // The specific event this chat session is about
}

export function CopilotChat({ event }: CopilotChatProps) {
  // Format the initial event data into a string for the first message
  const initialMessageContent = `Explain this security event for me: \n\`\`\`json\n${JSON.stringify(event, null, 2)}\n\`\`\``;

  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
    api: '/api/copilot', // The API endpoint we created
    // The initial message is the context of the security event.
    // This is sent to the LLM automatically when the chat loads.
    initialMessages: [
      {
        id: 'initial-event',
        role: 'user',
        content: initialMessageContent,
      },
    ],
  });

  // This effect clears the chat if the user opens a new event
  useEffect(() => {
    setMessages([
      {
        id: 'initial-event',
        role: 'user',
        content: initialMessageContent,
      },
    ]);
  }, [event, setMessages, initialMessageContent]);


  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full p-4">
          <div className="space-y-4">
            {messages.map((m) => (
              // Hide the initial prompt for a cleaner UI
              m.id !== 'initial-event' && (
                <div key={m.id} className={`flex gap-3 text-sm ${m.role === 'user' ? 'justify-end' : ''}`}>
                  {m.role === 'assistant' && <Bot className="flex-shrink-0 w-5 h-5 text-primary" />}
                  <div
                    className={`rounded-lg p-3 ${
                      m.role === 'user'
                        ? 'bg-muted'
                        : 'bg-primary text-primary-foreground'
                    }`}
                  >
                    <Balancer>{m.content}</Balancer>
                  </div>
                  {m.role === 'user' && <User className="flex-shrink-0 w-5 h-5 text-muted-foreground" />}
                </div>
              )
            ))}
            {isLoading && messages.length > 0 && messages[messages.length-1].role === 'user' && (
                 <div className="flex gap-3 text-sm">
                    <Bot className="flex-shrink-0 w-5 h-5 text-primary" />
                    <div className="rounded-lg p-3 bg-primary text-primary-foreground">
                        <Loader2 className="w-4 h-4 animate-spin" />
                    </div>
                </div>
            )}
          </div>
        </ScrollArea>
      </div>
      <form onSubmit={handleSubmit} className="flex items-center gap-2 p-4 border-t">
        <Input
          value={input}
          onChange={handleInputChange}
          placeholder="Ask a follow-up question..."
          className="flex-1"
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading}>
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
}