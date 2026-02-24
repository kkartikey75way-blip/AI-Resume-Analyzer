// AI service — resume analysis and generation
import type { IAnalysisResult, IGeneratedResume, ICareerRoadmap } from "../types/ai.types.js";
import { callOpenRouter, getAIErrorMessage } from "./openrouter.js";
import { analyzeResumePrompt, generateResumePrompt, careerRoadmapPrompt } from "./prompts.js";

// Re-export types for consumers
export type { IAnalysisResult, IGeneratedResume, ICareerRoadmap };

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

/**
 * Generate a career roadmap from resume text.
 */
export const generateCareerRoadmap = async (
  resumeText: string
): Promise<ICareerRoadmap> => {
  try {
    return await callOpenRouter<ICareerRoadmap>({
      messages: [
        { role: "system", content: careerRoadmapPrompt },
        {
          role: "user",
          content: `Based on this resume, provide a career growth roadmap:\n\n${resumeText}`,
        },
      ],
      temperature: 0.5,
      maxTokens: 3000,
    });
  } catch (error) {
    throw new Error(getAIErrorMessage(error, "Roadmap generation failed"));
  }
};

