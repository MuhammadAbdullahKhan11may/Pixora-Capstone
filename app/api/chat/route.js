import {
  convertToModelMessages,
  streamText,
  tool,
} from "ai";

import { z } from "zod";

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

  // Get the latest user message for controlled sabotage tests
  const latestMessage = messages[messages.length - 1];

  const latestText =
    JSON.stringify(latestMessage).toLowerCase();

  // TEST 1:
  // Simulate complete API/server failure
  if (latestText.includes("test api error")) {
    return new Response(
      JSON.stringify({
        error: "Temporary Pixora AI service failure.",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  // TEST 2:
  // Force the photography analysis tool to fail
  const forceToolFailure =
    latestText.includes("test tool error");

  const analyzePhotographyIdea = tool({
    description:
      "Analyze a photography idea and return a structured score and findings.",

    inputSchema: z.object({
      idea: z
        .string()
        .min(10)
        .describe("Photography idea to analyze"),
    }),

    execute: async ({ idea }) => {
      // Controlled assignment sabotage
      if (forceToolFailure) {
        throw new Error(
          "Photography analysis temporarily failed."
        );
      }

      const wordCount =
        idea.trim().split(/\s+/).length;

      let score = 70;

      if (wordCount >= 10) score += 10;
      if (wordCount >= 20) score += 10;

      return {
        score: Math.min(score, 95),
        wordCount,
        category: "Photography Concept",
        findings: [
          "The idea has a clear creative direction.",
          "Lighting details could make the concept stronger.",
          "Consider adding composition or camera-angle details.",
        ],
      };
    },
  });

  const modelMessages =
    await convertToModelMessages(messages);

  const result = streamText({
    model: aiModel,

    system: `${systemPrompt}

You have access to analyzePhotographyIdea.

Use the tool whenever the user asks to analyze,
review, evaluate, or score a photography idea.`,

    messages: modelMessages,

    tools: {
      analyzePhotographyIdea,
    },

    toolChoice: "required",
  });

  return result.toUIMessageStreamResponse();
}