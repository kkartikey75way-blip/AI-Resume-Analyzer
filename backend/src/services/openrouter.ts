import axios from "axios";
import type { OpenRouterResponse, OpenRouterError } from "../types/ai.types.js";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

interface ChatMessage {
    role: "system" | "user";
    content: string;
}

interface CallAIOptions {
    messages: ChatMessage[];
    temperature?: number;
    maxTokens?: number;
}

export async function callOpenRouter<T>(options: CallAIOptions): Promise<T> {
    const { messages, temperature = 0.3, maxTokens = 4000 } = options;

    const response = await axios.post<OpenRouterResponse>(
        OPENROUTER_API_URL,
        {
            model: "google/gemini-2.0-flash-001",
            messages,
            temperature,
            max_tokens: maxTokens,
        },
        {
            headers: {
                Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "http://localhost:5173",
                "X-Title": "AI Resume Analyzer",
            },
        }
    );

    const content = response.data.choices[0].message.content;
    return parseAIResponse<T>(content);
}

function parseAIResponse<T>(content: string): T {
    if (!content) {
        throw new Error("AI returned empty content");
    }

    try {
        return JSON.parse(content);
    } catch {
        const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (jsonMatch) {
            try {
                return JSON.parse(jsonMatch[1].trim());
            } catch (err) {
                console.error("Failed to parse extracted JSON block:", jsonMatch[1]);
                throw new Error("Could not parse extracted JSON block");
            }
        }
        console.error("AI Response could not be parsed as JSON. Content:", content);
        throw new Error("Could not parse AI response as JSON");
    }
}

export function getAIErrorMessage(error: unknown, prefix: string): string {
    const err = error as OpenRouterError;
    console.error(`${prefix}:`, err.response?.data || err.message);
    return `${prefix}: ${err.response?.data?.error?.message || err.message}`;
}
