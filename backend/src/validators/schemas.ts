import { z } from "zod";

export const registerSchema = z.object({
    name: z
        .string("Name is required")
        .trim()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name must not exceed 50 characters"),
    email: z
        .string("Email is required")
        .email("Invalid email address")
        .toLowerCase(),
    password: z
        .string("Password is required")
        .min(6, "Password must be at least 6 characters")
        .max(128, "Password must not exceed 128 characters"),
});

export const loginSchema = z.object({
    email: z
        .string("Email is required")
        .email("Invalid email address")
        .toLowerCase(),
    password: z
        .string("Password is required")
        .min(1, "Password is required"),
});

export const resumeTextSchema = z.object({
    text: z
        .string("Resume text is required")
        .min(50, "Resume text must be at least 50 characters")
        .max(50000, "Resume text must not exceed 50,000 characters"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ResumeTextInput = z.infer<typeof resumeTextSchema>;
