import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { resumeAPI } from '../services/api';
import ScoreGauge from '../components/ScoreGauge';
import toast from 'react-hot-toast';
import {
    ArrowLeft, AlertTriangle, CheckCircle, Info, ChevronDown, ChevronUp,
    Target, Zap, Award, TrendingUp, Sparkles,
} from 'lucide-react';

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
    _id: string;
    fileName: string;
    analysis: {
        overallScore: number;
        atsScore: number;
        summary: string;
        sections: Section[];
        keywords: Keyword[];
        improvementPriorities: string[];
    };
    createdAt: string;
}

const AnalysisResult = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [data, setData] = useState<AnalysisData | null>(null);
    const [loading, setLoading] = useState(true);
    const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([0]));

    useEffect(() => {
        const fetchAnalysis = async () => {
            try {
                const res = await resumeAPI.getAnalysis(id!);
                setData(res.data);
            } catch {
                toast.error('Failed to load analysis');
                navigate('/dashboard');
            } finally {
                setLoading(false);
            }
        };
        fetchAnalysis();
    }, [id, navigate]);

    const toggleSection = (index: number) => {
        setExpandedSections((prev) => {
            const next = new Set(prev);
            if (next.has(index)) next.delete(index);
            else next.add(index);
            return next;
        });
    };

    const getScoreLabel = (score: number): string => {
        if (score >= 90) return 'Excellent';
        if (score >= 70) return 'Good';
        if (score >= 50) return 'Average';
        if (score >= 30) return 'Below Average';
        return 'Needs Work';
    };

    const getScoreColorClass = (score: number): string => {
        if (score >= 80) return 'score-excellent';
        if (score >= 60) return 'score-good';
        if (score >= 40) return 'score-average';
        return 'score-poor';
    };

    const getPriorityIcon = (priority: string) => {
        switch (priority) {
            case 'high':
                return <AlertTriangle size={14} />;
            case 'medium':
                return <Info size={14} />;
            default:
                return <CheckCircle size={14} />;
        }
    };

    if (loading) {
        return (
            <div className="animate-[fadeInUp_0.5s_ease_forwards]">
                <div className="flex flex-col items-center gap-4 py-15 px-8 text-text-secondary">
                    <div className="spinner" />
                    <p>Loading analysis...</p>
                </div>
            </div>
        );
    }

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
                    <h1 className="text-[1.8rem] font-extrabold tracking-tight">{data.fileName}</h1>
                    <p className="text-text-secondary mt-1 text-[0.95rem]">
                        Analyzed on {new Date(data.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric', month: 'long', day: 'numeric',
                        })}
                    </p>
                </div>
                <button className="btn btn-primary" onClick={() => navigate(`/analysis/${id}/generated`)}>
                    <Sparkles size={18} /> Generate Improved Resume
                </button>
            </motion.div>

            {/* Score Overview */}
            <motion.div
                className="p-8 mb-6 flex gap-10 items-center glass-card max-[900px]:flex-col max-[900px]:items-stretch"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <div className="flex items-center gap-7 flex-1 max-[900px]:flex-col max-[900px]:text-center">
                    <ScoreGauge score={analysis.overallScore} size={140} strokeWidth={10} />
                    <div>
                        <h2 className={`text-[1.6rem] font-extrabold mb-2 ${getScoreColorClass(analysis.overallScore)}`}>
                            {getScoreLabel(analysis.overallScore)}
                        </h2>
                        <p className="text-text-secondary text-[0.9rem] leading-relaxed max-w-[400px] max-[900px]:max-w-none">{analysis.summary}</p>
                    </div>
                </div>
                <div className="flex gap-7 items-center pl-10 border-l border-border-default max-[900px]:border-l-0 max-[900px]:pl-0 max-[900px]:pt-5 max-[900px]:border-t max-[900px]:border-border-default max-[900px]:justify-around">
                    <div className="flex flex-col items-center gap-2">
                        <ScoreGauge score={analysis.atsScore} size={80} strokeWidth={6} showLabel label="ATS Score" />
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <div className="flex flex-col items-center gap-1.5">
                            <Award size={24} className="text-accent-cyan" />
                            <span className="text-2xl font-extrabold">{analysis.sections?.length || 0}</span>
                            <span className="text-[0.75rem] text-text-muted uppercase tracking-wider font-medium">Sections</span>
                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <div className="flex flex-col items-center gap-1.5">
                            <Zap size={24} className="text-accent-cyan" />
                            <span className="text-2xl font-extrabold">
                                {analysis.sections?.reduce((a, s) => a + s.suggestions.length, 0) || 0}
                            </span>
                            <span className="text-[0.75rem] text-text-muted uppercase tracking-wider font-medium">Suggestions</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Improvement Priorities */}
            {analysis.improvementPriorities && analysis.improvementPriorities.length > 0 && (
                <motion.div
                    className="p-7 mb-6 glass-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h3 className="flex items-center gap-2.5 text-[1.1rem] font-bold mb-5 text-accent-amber">
                        <TrendingUp size={20} />
                        Top Improvement Priorities
                    </h3>
                    <ol className="list-none flex flex-col gap-3">
                        {analysis.improvementPriorities.map((priority, i) => (
                            <li key={i} className="flex items-start gap-3 text-[0.9rem] text-text-secondary leading-relaxed">
                                <span className="w-7 h-7 bg-linear-to-br from-accent-cyan to-accent-purple rounded-[--radius-sm] flex items-center justify-center text-[0.8rem] font-bold text-white shrink-0">{i + 1}</span>
                                <span>{priority}</span>
                            </li>
                        ))}
                    </ol>
                </motion.div>
            )}

            {/* Section Breakdowns */}
            <motion.div
                className="mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <h3 className="flex items-center gap-2.5 text-[1.1rem] font-bold mb-4 text-accent-cyan">
                    <Target size={20} />
                    Section-by-Section Analysis
                </h3>

                {analysis.sections?.map((section, index) => (
                    <motion.div
                        key={index}
                        className="mb-2 overflow-hidden glass-card"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                    >
                        <div
                            className="flex items-center justify-between py-[18px] px-5 cursor-pointer transition-colors duration-150 relative hover:bg-[rgba(6,182,212,0.03)]"
                            onClick={() => toggleSection(index)}
                        >
                            <div className="flex items-center gap-4 relative">
                                <div
                                    className="absolute -left-5 top-0 bottom-0 w-[3px] rounded-r-[3px]"
                                    style={{
                                        background: `linear-gradient(90deg, ${section.score >= 80
                                            ? '#10b981'
                                            : section.score >= 60
                                                ? '#06b6d4'
                                                : section.score >= 40
                                                    ? '#f59e0b'
                                                    : '#f43f5e'
                                            } ${section.score}%, transparent ${section.score}%)`,
                                    }}
                                />
                                <h4 className="text-[0.95rem] font-semibold">{section.name}</h4>
                            </div>
                            <div className="flex items-center gap-3 text-text-secondary">
                                <span className={`font-bold text-[0.9rem] ${getScoreColorClass(section.score)}`}>
                                    {section.score}/100
                                </span>
                                {expandedSections.has(index) ? (
                                    <ChevronUp size={18} />
                                ) : (
                                    <ChevronDown size={18} />
                                )}
                            </div>
                        </div>

                        {expandedSections.has(index) && (
                            <motion.div
                                className="px-5 pb-5 overflow-hidden"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                transition={{ duration: 0.3 }}
                            >
                                <p className="text-text-secondary text-[0.88rem] leading-[1.7] mb-4 p-4 bg-bg-tertiary rounded-[--radius-md] border-l-[3px] border-accent-cyan">{section.feedback}</p>

                                {section.suggestions.length > 0 && (
                                    <div>
                                        <h5 className="text-[0.85rem] font-semibold mb-3 text-text-secondary uppercase tracking-wider">Suggestions</h5>
                                        {section.suggestions.map((suggestion, sIdx) => (
                                            <div key={sIdx} className="flex items-start gap-3 py-3 border-b border-border-default last:border-b-0">
                                                <span className={`badge badge-${suggestion.priority}`}>
                                                    {getPriorityIcon(suggestion.priority)}
                                                    {suggestion.priority}
                                                </span>
                                                <p className="text-[0.88rem] text-text-secondary leading-relaxed flex-1">{suggestion.text}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </motion.div>
                ))}
            </motion.div>

            {/* Keywords */}
            {analysis.keywords && analysis.keywords.length > 0 && (
                <motion.div
                    className="p-7 glass-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <h3 className="flex items-center gap-2.5 text-[1.1rem] font-bold mb-5 text-accent-purple">
                        <Zap size={20} />
                        Keywords Analysis
                    </h3>
                    <div className="flex flex-wrap gap-2.5">
                        {analysis.keywords.map((kw, i) => (
                            <span
                                key={i}
                                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[0.82rem] font-medium transition-all duration-150 hover:scale-105 ${kw.found
                                    ? 'bg-[rgba(16,185,129,0.1)] text-accent-emerald border border-[rgba(16,185,129,0.2)]'
                                    : 'bg-[rgba(244,63,94,0.08)] text-accent-rose border border-[rgba(244,63,94,0.15)]'
                                    } ${kw.relevance === 'high' ? 'font-bold' : ''}`}
                            >
                                {kw.word}
                                {!kw.found && <span className="text-[0.65rem] uppercase opacity-80 tracking-wider">missing</span>}
                            </span>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default AnalysisResult;
