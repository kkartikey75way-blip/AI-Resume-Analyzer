// Resume route handlers — extracted from route definitions for cleaner code
import { Request, Response } from "express";
import { PDFParse } from "pdf-parse";
import { resumeTextSchema } from "../validators/schemas.js";
import Resume from "../models/Resume.js";
import { analyzeResume, generateImprovedResume } from "../services/ai.service.js";

interface ResumeError {
    message: string;
}

/**
 * POST /api/resume/analyze
 * Analyze a resume from PDF upload or pasted text.
 */
export const handleAnalyze = async (req: Request, res: Response): Promise<void> => {
    try {
        let resumeText = "";
        let fileName = "Pasted Text";

        if (req.file) {
            fileName = req.file.originalname;
            if (req.file.mimetype === "application/pdf") {
                const pdf = new PDFParse({ data: req.file.buffer });
                const pdfData = await pdf.getText();
                resumeText = pdfData.text;
                await pdf.destroy();
            }
        } else if (req.body.text) {
            const parsed = resumeTextSchema.safeParse(req.body);
            if (!parsed.success) {
                const errors = parsed.error.issues.map((issue) => ({
                    field: issue.path.join("."),
                    message: issue.message,
                }));
                res.status(400).json({ message: "Validation failed", errors });
                return;
            }
            resumeText = parsed.data.text;
        } else {
            res.status(400).json({
                message: "Please upload a PDF file or paste resume text",
            });
            return;
        }

        if (!resumeText.trim()) {
            res.status(400).json({
                message: "Could not extract text from the file. Please try pasting the text directly.",
            });
            return;
        }

        const analysis = await analyzeResume(resumeText);

        const resume = await Resume.create({
            user: req.user!._id,
            fileName,
            rawText: resumeText,
            analysis,
        });

        res.status(201).json(resume);
    } catch (error: unknown) {
        const err = error as ResumeError;
        console.error("Resume analysis error:", err.message);
        res.status(500).json({
            message: err.message || "Failed to analyze resume",
        });
    }
};

/**
 * GET /api/resume/history
 * Get all analyses for the authenticated user.
 */
export const handleGetHistory = async (req: Request, res: Response): Promise<void> => {
    try {
        const resumes = await Resume.find({ user: req.user!._id })
            .select("fileName analysis.overallScore analysis.atsScore analysis.summary createdAt")
            .sort({ createdAt: -1 });

        res.json(resumes);
    } catch (error: unknown) {
        const err = error as ResumeError;
        res.status(500).json({ message: err.message || "Failed to fetch history" });
    }
};

/**
 * GET /api/resume/:id
 * Get a single analysis by ID.
 */
export const handleGetAnalysis = async (req: Request, res: Response): Promise<void> => {
    try {
        const resume = await Resume.findOne({
            _id: req.params.id,
            user: req.user!._id,
        });

        if (!resume) {
            res.status(404).json({ message: "Analysis not found" });
            return;
        }

        res.json(resume);
    } catch (error: unknown) {
        const err = error as ResumeError;
        res.status(500).json({ message: err.message || "Failed to fetch analysis" });
    }
};

/**
 * DELETE /api/resume/:id
 * Delete a single analysis by ID.
 */
export const handleDeleteAnalysis = async (req: Request, res: Response): Promise<void> => {
    try {
        const resume = await Resume.findOneAndDelete({
            _id: req.params.id,
            user: req.user!._id,
        });

        if (!resume) {
            res.status(404).json({ message: "Analysis not found" });
            return;
        }

        res.json({ message: "Analysis deleted successfully" });
    } catch (error: unknown) {
        const err = error as ResumeError;
        res.status(500).json({ message: err.message || "Failed to delete analysis" });
    }
};

/**
 * POST /api/resume/:id/generate
 * Generate an improved resume based on analysis feedback.
 */
export const handleGenerateResume = async (req: Request, res: Response): Promise<void> => {
    try {
        const resume = await Resume.findOne({
            _id: req.params.id,
            user: req.user!._id,
        });

        if (!resume) {
            res.status(404).json({ message: "Analysis not found" });
            return;
        }

        const resumeObj = resume.toObject();

        const generatedResume = await generateImprovedResume(
            resumeObj.rawText,
            resumeObj.analysis
        );

        res.json(generatedResume);
    } catch (error: unknown) {
        const err = error as ResumeError;
        console.error("Resume generation error:", err.message);
        res.status(500).json({
            message: err.message || "Failed to generate resume",
        });
    }
};
