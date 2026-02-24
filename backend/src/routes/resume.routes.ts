import express, { Request, Response } from "express";
import multer from "multer";
import { PDFParse } from "pdf-parse";
import { protect } from "../middleware/auth.middleware.js";
import { resumeTextSchema } from "../validators/schemas.js";
import Resume from "../models/Resume.js";
import { analyzeResume } from "../services/ai.service.js";

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        if (file.mimetype === "application/pdf") {
            cb(null, true);
        } else {
            cb(new Error("Only PDF files are allowed"));
        }
    },
});

interface ResumeError {
    message: string;
}

// POST /api/resume/analyze
router.post(
    "/analyze",
    protect,
    upload.single("resume"),
    async (req: Request, res: Response): Promise<void> => {
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
    }
);

// GET /api/resume/history
router.get(
    "/history",
    protect,
    async (req: Request, res: Response): Promise<void> => {
        try {
            const resumes = await Resume.find({ user: req.user!._id })
                .select("fileName analysis.overallScore analysis.atsScore analysis.summary createdAt")
                .sort({ createdAt: -1 });

            res.json(resumes);
        } catch (error: unknown) {
            const err = error as ResumeError;
            res.status(500).json({ message: err.message || "Failed to fetch history" });
        }
    }
);

// GET /api/resume/:id
router.get(
    "/:id",
    protect,
    async (req: Request, res: Response): Promise<void> => {
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
    }
);

// DELETE /api/resume/:id
router.delete(
    "/:id",
    protect,
    async (req: Request, res: Response): Promise<void> => {
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
    }
);

export default router;
