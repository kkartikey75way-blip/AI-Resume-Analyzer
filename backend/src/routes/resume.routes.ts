// Resume routes — clean route definitions, handlers in controller
import express from "express";
import multer from "multer";
import { protect } from "../middleware/auth.middleware.js";
import {
    handleAnalyze,
    handleGetHistory,
    handleGetAnalysis,
    handleDeleteAnalysis,
    handleGenerateResume,
} from "../controllers/resume.controller.js";

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

router.post("/analyze", protect, upload.single("resume"), handleAnalyze);
router.get("/history", protect, handleGetHistory);
router.get("/:id", protect, handleGetAnalysis);
router.delete("/:id", protect, handleDeleteAnalysis);
router.post("/:id/generate", protect, handleGenerateResume);

export default router;
