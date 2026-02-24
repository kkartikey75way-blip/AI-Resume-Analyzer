import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

export const validate =
    (schema: ZodSchema) =>
        (req: Request, res: Response, next: NextFunction): void => {
            try {
                req.body = schema.parse(req.body);
                next();
            } catch (error) {
                if (error instanceof ZodError) {
                    const errors = error.issues.map((issue) => ({
                        field: issue.path.join("."),
                        message: issue.message,
                    }));
                    res.status(400).json({
                        message: "Validation failed",
                        errors,
                    });
                    return;
                }
                next(error);
            }
        };
