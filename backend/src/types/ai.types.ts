// Shared types for AI analysis and resume generation

export interface ISuggestion {
    text: string;
    priority: "high" | "medium" | "low";
}

export interface ISection {
    name: string;
    score: number;
    feedback: string;
    suggestions: ISuggestion[];
}

export interface IKeyword {
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

export interface IGeneratedResume {
    contactInfo: {
        name: string;
        title: string;
        email: string;
        phone: string;
        location: string;
        linkedin: string;
    };
    summary: string;
    experience: {
        title: string;
        company: string;
        duration: string;
        bullets: string[];
    }[];
    education: {
        degree: string;
        institution: string;
        year: string;
        details: string;
    }[];
    skills: {
        technical: string[];
        soft: string[];
    };
    certifications: string[];
    projects: {
        name: string;
        description: string;
        tech: string[];
    }[];
}

export interface ICareerRoadmap {
    currentRole: string;
    nextSteps: {
        title: string;
        timeframe: string;
        description: string;
        requiredSkills: string[];
        recommendedCertifications: string[];
    }[];
    longTermGoal: string;
    skillsToDevelop: string[];
}

export interface OpenRouterResponse {
    choices: {
        message: {
            content: string;
        };
    }[];
}

export interface OpenRouterError {
    response?: {
        data?: {
            error?: {
                message?: string;
            };
        };
    };
    message: string;
}
