import mongoose, { Document, Schema } from "mongoose";

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

export interface IResume extends Document {
    user: mongoose.Types.ObjectId;
    fileName: string;
    rawText: string;
    analysis: {
        overallScore: number;
        atsScore: number;
        sections: ISection[];
        keywords: IKeyword[];
        improvementPriorities: string[];
        summary: string;
    };
    createdAt: Date;
    updatedAt: Date;
}

const resumeSchema = new Schema<IResume>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        fileName: {
            type: String,
            default: "Pasted Text",
        },
        rawText: {
            type: String,
            required: true,
        },
        analysis: {
            overallScore: { type: Number, default: 0 },
            atsScore: { type: Number, default: 0 },
            sections: [
                {
                    name: String,
                    score: Number,
                    feedback: String,
                    suggestions: [
                        {
                            text: String,
                            priority: {
                                type: String,
                                enum: ["high", "medium", "low"],
                            },
                        },
                    ],
                },
            ],
            keywords: [
                {
                    word: String,
                    relevance: {
                        type: String,
                        enum: ["high", "medium", "low"],
                    },
                    found: Boolean,
                },
            ],
            improvementPriorities: [String],
            summary: String,
        },
    },
    { timestamps: true }
);

const Resume = mongoose.model<IResume>("Resume", resumeSchema);
export default Resume;
