import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { resumeAPI } from '../services/api';
import toast from 'react-hot-toast';
import { ArrowLeft, TrendingUp, Sparkles } from 'lucide-react';

import Spinner from '../components/ui/Spinner';
import ScoreOverview from '../components/analysis/ScoreOverview';
import AnalysisSection from '../components/analysis/AnalysisSection';
import KeywordsAnalysis from '../components/analysis/KeywordsAnalysis';
import GlassCard from '../components/ui/GlassCard';

interface Suggestion {
    text: string;
    priority: 'high' | 'medium' | 'low';
}

interface Section {
    name: string;
    score: number;
    feedback: string;
    suggestions: Suggestion[];
}

interface Keyword {
    word: string;
    relevance: 'high' | 'medium' | 'low';
    found: boolean;
}

interface AnalysisData {
    createdAt: string;
    analysis: {
        overallScore: number;
        atsScore: number;
        summary: string;
        sections: Section[];
        keywords: Keyword[];
        improvementPriorities: string[];
    };
}

const AnalysisResult = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [data, setData] = useState<AnalysisData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResult = async () => {
            try {
                const res = await resumeAPI.getAnalysis(id!);
                setData(res.data);
            } catch {
                toast.error('Failed to fetch analysis result');
                navigate('/dashboard');
            } finally {
                setLoading(false);
            }
        };
        fetchResult();
    }, [id, navigate]);

    if (loading) return <Spinner />;
    if (!data) return null;

    const { analysis } = data;

    return (
        <div className="animate-[fadeInUp_0.5s_ease_forwards]">
            {/* Header */}
            <motion.div
                className="flex items-start gap-4 mb-7 max-sm:flex-col"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <button className="btn btn-secondary btn-sm" onClick={() => navigate('/dashboard')}>
                    <ArrowLeft size={16} /> Back
                </button>
                <div className="flex-1">
                    <h1 className="text-[1.8rem] font-extrabold tracking-tight text-text-primary mb-1">
                        Resume Analysis
                    </h1>
                    <p className="text-text-secondary text-[0.9rem]">
                        Analyzed on {new Date(data.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric', month: 'long', day: 'numeric',
                        })}
                    </p>
                </div>
                <div className="flex gap-2">
                    <button className="btn btn-secondary" onClick={() => navigate(`/analysis/${id}/roadmap`)}>
                        <TrendingUp size={18} /> Career Roadmap
                    </button>
                    <button className="btn btn-primary" onClick={() => navigate(`/analysis/${id}/generated`)}>
                        <Sparkles size={18} /> Generate Improved Resume
                    </button>
                </div>
            </motion.div>

            {/* Score Overview Component */}
            <ScoreOverview
                overallScore={analysis.overallScore}
                atsScore={analysis.atsScore}
                summary={analysis.summary}
            />

            <div className="grid grid-cols-[1fr_320px] gap-6 max-[1100px]:grid-cols-1">
                {/* Main Content: Section Breakdown */}
                <div className="space-y-4">
                    <h3 className="text-[1.1rem] font-bold text-text-primary mb-4 flex items-center gap-2">
                        Section Breakdown
                    </h3>
                    <div className="space-y-4">
                        {analysis.sections.map((section, i) => (
                            <AnalysisSection key={i} section={section} />
                        ))}
                    </div>
                </div>

                {/* Sidebar: Keywords & Priorities */}
                <div className="space-y-6">
                    {/* Keywords Component */}
                    <KeywordsAnalysis keywords={analysis.keywords} />

                    {/* Improvement Priorities */}
                    <GlassCard className="p-6">
                        <h3 className="text-[1rem] font-bold text-text-primary mb-4">Top Priorities</h3>
                        <div className="space-y-3">
                            {analysis.improvementPriorities.map((priority, i) => (
                                <div key={i} className="flex gap-3 items-start p-3 bg-white/5 rounded-lg border border-white/5">
                                    <div className="w-5 h-5 rounded-full bg-accent-cyan/10 text-accent-cyan text-[0.7rem] font-bold flex items-center justify-center shrink-0 mt-0.5 border border-accent-cyan/20">
                                        {i + 1}
                                    </div>
                                    <p className="text-[0.85rem] text-text-secondary leading-normal">{priority}</p>
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
};

export default AnalysisResult;
