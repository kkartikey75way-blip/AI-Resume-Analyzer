import axios from "axios";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

interface ISuggestion {
  text: string;
  priority: "high" | "medium" | "low";
}

interface ISection {
  name: string;
  score: number;
  feedback: string;
  suggestions: ISuggestion[];
}

interface IKeyword {
  word: string;
  relevance: "high" | "medium" | "low";
  found: boolean;
}

export interface IAnalysisResult {
  overallScore: number;
  atsScore: number;
  summary: string;
  sections: ISection[];
  keywords: IKeyword[];
  improvementPriorities: string[];
}

interface OpenRouterResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

interface OpenRouterError {
  response?: {
    data?: {
      error?: {
        message?: string;
      };
    };
  };
  message: string;
}

const systemPrompt = `You are an expert resume analyzer and career coach. Analyze the given resume text and provide a comprehensive, structured evaluation.

You MUST respond with ONLY valid JSON (no markdown, no code fences, no explanation outside JSON). Use this exact structure:

{
  "overallScore": <number 0-100>,
  "atsScore": <number 0-100>,
  "summary": "<2-3 sentence overall assessment>",
  "sections": [
    {
      "name": "Contact Information",
      "score": <number 0-100>,
      "feedback": "<detailed feedback>",
      "suggestions": [
        { "text": "<specific actionable suggestion>", "priority": "high|medium|low" }
      ]
    },
    {
      "name": "Professional Summary",
      "score": <number 0-100>,
      "feedback": "<detailed feedback>",
      "suggestions": [
        { "text": "<specific actionable suggestion>", "priority": "high|medium|low" }
      ]
    },
    {
      "name": "Work Experience",
      "score": <number 0-100>,
      "feedback": "<detailed feedback>",
      "suggestions": [
        { "text": "<specific actionable suggestion>", "priority": "high|medium|low" }
      ]
    },
    {
      "name": "Education",
      "score": <number 0-100>,
      "feedback": "<detailed feedback>",
      "suggestions": [
        { "text": "<specific actionable suggestion>", "priority": "high|medium|low" }
      ]
    },
    {
      "name": "Skills",
      "score": <number 0-100>,
      "feedback": "<detailed feedback>",
      "suggestions": [
        { "text": "<specific actionable suggestion>", "priority": "high|medium|low" }
      ]
    },
    {
      "name": "Formatting & Structure",
      "score": <number 0-100>,
      "feedback": "<detailed feedback>",
      "suggestions": [
        { "text": "<specific actionable suggestion>", "priority": "high|medium|low" }
      ]
    },
    {
      "name": "Keywords & ATS Optimization",
      "score": <number 0-100>,
      "feedback": "<detailed feedback>",
      "suggestions": [
        { "text": "<specific actionable suggestion>", "priority": "high|medium|low" }
      ]
    }
  ],
  "keywords": [
    { "word": "<keyword>", "relevance": "high|medium|low", "found": true|false }
  ],
  "improvementPriorities": [
    "<ranked improvement #1>",
    "<ranked improvement #2>",
    "<ranked improvement #3>",
    "<ranked improvement #4>",
    "<ranked improvement #5>"
  ]
}

Scoring guidelines:
- 90-100: Excellent, professional quality
- 70-89: Good, minor improvements needed
- 50-69: Average, several improvements needed
- 30-49: Below average, significant improvements needed
- 0-29: Poor, major overhaul needed

Be specific, actionable, and constructive in feedback. Focus on how to improve, not just what is wrong.`;

export const analyzeResume = async (resumeText: string): Promise<IAnalysisResult> => {
  try {
    const response = await axios.post<OpenRouterResponse>(
      OPENROUTER_API_URL,
      {
        model: "google/gemini-2.0-flash-001",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: `Please analyze the following resume and provide your structured evaluation:\n\n${resumeText}`,
          },
        ],
        temperature: 0.3,
        max_tokens: 4000,
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

    let parsed: IAnalysisResult;
    try {
      parsed = JSON.parse(content);
    } catch {
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[1].trim());
      } else {
        throw new Error("Could not parse AI response as JSON");
      }
    }

    return parsed;
  } catch (error: unknown) {
    const err = error as OpenRouterError;
    console.error(
      "AI Analysis Error:",
      err.response?.data || err.message
    );
    throw new Error(
      `AI analysis failed: ${err.response?.data?.error?.message || err.message}`
    );
  }
};
