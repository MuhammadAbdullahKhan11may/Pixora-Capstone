import {
  convertToModelMessages,
  streamText,
} from "ai";

import {
  aiModel,
  systemPrompt,
} from "@/lib/ai-config";

export const maxDuration = 30;

export async function POST(request) {
  console.log(
    "Gemini key loaded:",
    Boolean(process.env.GOOGLE_GENERATIVE_AI_API_KEY)
  );

  const { messages } = await request.json();

  const modelMessages = await convertToModelMessages(messages);

  const result = streamText({
    model: aiModel,
    system: systemPrompt,
    messages: modelMessages,
  });

  return result.toUIMessageStreamResponse();
}