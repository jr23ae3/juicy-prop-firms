import OpenAI from "openai";

import { requireOpenAIEnv } from "@/lib/env";

let openaiClient: OpenAI | null = null;

export function getOpenAIClient() {
  if (!openaiClient) {
    const { apiKey } = requireOpenAIEnv();
    openaiClient = new OpenAI({ apiKey });
  }

  return openaiClient;
}
