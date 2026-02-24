export interface ResumeContactInfo {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
}

export interface ResumeExperience {
    title: string;
    company: string;
    duration: string;
    bullets: string[];
}

export interface ResumeEducation {
    degree: string;
    institution: string;
    year: string;
    details: string;
}

export interface ResumeSkills {
    technical: string[];
    soft: string[];
}

export interface ResumeProject {
    name: string;
    description: string;
    tech: string[];
}

export interface GeneratedResume {
    contactInfo: ResumeContactInfo;
    summary: string;
    experience: ResumeExperience[];
    education: ResumeEducation[];
    skills: ResumeSkills;
    certifications: string[];
    projects: ResumeProject[];
}

export interface CareerRoadmapStep {
    title: string;
    timeframe: string;
    description: string;
    requiredSkills: string[];
    recommendedCertifications: string[];
}

export interface CareerRoadmapData {
    currentRole: string;
    nextSteps: CareerRoadmapStep[];
    longTermGoal: string;
    skillsToDevelop: string[];
}
