import express, { Request, Response } from "express";
import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";
import { protect } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { registerSchema, loginSchema, RegisterInput, LoginInput } from "../validators/schemas.js";

const router = express.Router();

// POST /api/auth/register
router.post("/register", validate(registerSchema), async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password } = req.body as RegisterInput;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: "User already exists" });
            return;
        }

        const user = await User.create({ name, email, password });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(String(user._id)),
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// POST /api/auth/login
router.post("/login", validate(loginSchema), async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body as LoginInput;

        const user = await User.findOne({ email });
        if (!user) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(String(user._id)),
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// GET /api/auth/me
router.get("/me", protect, async (req: Request, res: Response): Promise<void> => {
    try {
        const user = req.user;
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

export default router;