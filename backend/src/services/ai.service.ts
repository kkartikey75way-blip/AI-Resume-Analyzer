import type { IAnalysisResult, IGeneratedResume } from "../types/ai.types.js";
import { callOpenRouter, getAIErrorMessage } from "./openrouter.js";
import { analyzeResumePrompt, generateResumePrompt } from "./prompts.js";

export type { IAnalysisResult, IGeneratedResume };

export const analyzeResume = async (
  resumeText: string
): Promise<IAnalysisResult> => {
  try {
    return await callOpenRouter<IAnalysisResult>({
      messages: [
        { role: "system", content: analyzeResumePrompt },
        {
          role: "user",
          content: `Please analyze the following resume and provide your structured evaluation:\n\n${resumeText}`,
        },
      ],
      temperature: 0.3,
      maxTokens: 4000,
    });
  } catch (error) {
    throw new Error(getAIErrorMessage(error, "AI analysis failed"));
  }
};

export const generateImprovedResume = async (
  resumeText: string,
  analysis: Partial<IAnalysisResult>
): Promise<IGeneratedResume> => {
  try {
    const sections = analysis.sections ?? [];
    const priorities = analysis.improvementPriorities ?? [];
    const overallScore = analysis.overallScore ?? 0;
    const atsScore = analysis.atsScore ?? 0;
    const summary = analysis.summary ?? "No summary available";

    const feedbackSummary = sections
      .map((s) => `${s.name}: ${s.feedback}`)
      .join("\n");

    const userMessage = [
      `Here is the original resume:\n\n${resumeText}`,
      `\nHere is the analysis feedback:`,
      `\nOverall Score: ${overallScore}/100`,
      `ATS Score: ${atsScore}/100`,
      `Summary: ${summary}`,
      sections.length > 0
        ? `\nSection Feedback:\n${feedbackSummary}`
        : "",
      priorities.length > 0
        ? `\nImprovement Priorities:\n${priorities.join("\n")}`
        : "",
      `\nPlease generate an improved version of this resume.`,
    ]
      .filter(Boolean)
      .join("\n");

    return await callOpenRouter<IGeneratedResume>({
      messages: [
        { role: "system", content: generateResumePrompt },
        { role: "user", content: userMessage },
      ],
      temperature: 0.4,
      maxTokens: 5000,
    });
  } catch (error) {
    throw new Error(getAIErrorMessage(error, "Resume generation failed"));
  }
};
