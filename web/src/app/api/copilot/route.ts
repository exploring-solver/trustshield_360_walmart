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
      system: `
        You are a helpful and concise cybersecurity assistant called "TrustShield Copilot".
        You are integrated into the Walmart TrustShield 360 security dashboard.
        Your purpose is to explain security events to users in simple, clear, and actionable terms.
        - When presented with a security event log, first summarize what happened in one sentence.
        - Then, explain the risk level (Low, Medium, High, Critical) and why.
        - Finally, provide a clear "Recommended Action" for the user. If no action is needed, say so.
        - Keep your responses brief and to the point. Use markdown for formatting.
        - Do not use jargon unless you explain it.
        - Your tone should be reassuring but authoritative.
      `,
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