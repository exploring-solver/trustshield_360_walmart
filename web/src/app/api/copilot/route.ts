// File: src/app/api/copilot/route.ts (Updated for Vercel AI SDK v3)

import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { NextResponse } from 'next/server';

// --- NEW: Instantiate the Groq client using the @ai-sdk ---
// The createOpenAI function can be used for any OpenAI-compatible API.
// We just need to point it to Groq's baseURL.
const groq = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});

// Set the runtime to edge for best performance
export const runtime = 'edge';

// The main POST function that handles incoming chat requests
export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // --- NEW: Call the LLM using the streamText function ---
    const result = await streamText({
      // Use the Groq provider you instantiated
      model: groq('llama3-8b-8192'),
      // The system prompt defines the AI's persona and instructions
      system: `You are TrustShield Copilot, a cybersecurity expert assistant integrated into Walmart's TrustShield 360 security dashboard.

Your role is to analyze security events and provide clear, actionable insights to security analysts and administrators.

RESPONSE STRUCTURE:
When analyzing security events, always follow this format:

1. EVENT SUMMARY: Provide a clear, one-sentence summary of what happened
2. RISK ASSESSMENT: Evaluate the risk level (Low/Medium/High/Critical) with brief reasoning
3. TECHNICAL DETAILS: Explain the technical aspects in simple terms
4. RECOMMENDED ACTIONS: Provide specific, actionable steps
5. PREVENTION TIPS: Suggest how to prevent similar events

GUIDELINES:
- Use plain text only - NO markdown, asterisks, backticks, or special formatting
- Keep responses concise but comprehensive
- Use simple, clear language that non-technical users can understand
- Be authoritative but reassuring
- Focus on practical, actionable advice
- If asked follow-up questions, provide direct answers without repeating the structure
- For general questions about security concepts, explain clearly without jargon
- Always consider the context of the security event when providing recommendations

SECURITY EVENT ANALYSIS:
- High Risk (Risk Score > 0.8 or Abuse Confidence > 70%): Immediate attention required
- Medium Risk (Risk Score 0.5-0.8): Monitor closely, investigate further
- Low Risk (Risk Score < 0.5): Normal activity, minimal concern

Remember: Your goal is to help users understand security threats quickly and take appropriate action. Be helpful, accurate, and professional.`,
      messages, // Pass the user's chat history
    });

    // --- NEW: Return the stream as a Vercel AI SDK response ---
    // This replaces the old `StreamingTextResponse` and `GroqStream` logic.
    return result.toDataStreamResponse();

  } catch (error) {
    // Handle potential errors
    console.error("Copilot API Error:", error);
    return new NextResponse('An error occurred. Please check the server logs.', { status: 500 });
  }
}