import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { resumeAPI } from '../services/api';
import { TrendingUp, FileText, Target, Clock, Upload, ChevronRight, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import ScoreGauge from '../components/ScoreGauge';

interface HistoryItem {
    _id: string;
    fileName: string;
    analysis: {
        overallScore: number;
        atsScore: number;
        summary: string;
    };
    createdAt: string;
}

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const res = await resumeAPI.getHistory();
            setHistory(res.data);
        } catch {
            toast.error('Failed to load history');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await resumeAPI.deleteAnalysis(id);
            setHistory((prev) => prev.filter((item) => item._id !== id));
            toast.success('Analysis deleted');
        } catch {
            toast.error('Failed to delete');
        }
    };

    const getScoreColor = (score: number): string => {
        if (score >= 80) return 'var(--color-accent-emerald)';
        if (score >= 60) return 'var(--color-accent-cyan)';
        if (score >= 40) return 'var(--color-accent-amber)';
        return 'var(--color-accent-rose)';
    };

    const avgScore = history.length
        ? Math.round(history.reduce((a, b) => a + b.analysis.overallScore, 0) / history.length)
        : 0;
    const bestScore = history.length
        ? Math.max(...history.map((h) => h.analysis.overallScore))
        : 0;

    const containerVariants = {
        hidden: {},
        visible: { transition: { staggerChildren: 0.1 } },
    };
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    return (
        <div className="animate-[fadeInUp_0.5s_ease_forwards]">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                    <div>
                        <h1 className="text-[1.8rem] font-extrabold tracking-tight">
                            Welcome back, <span className="bg-linear-to-br from-accent-cyan to-accent-purple bg-clip-text text-transparent">{user?.name?.split(' ')[0]}</span>
                        </h1>
                        <p className="text-text-secondary mt-1 text-[0.95rem]">Here's your resume analysis overview</p>
                    </div>
                    <button className="btn btn-primary" onClick={() => navigate('/upload')}>
                        <Upload size={18} />
                        Analyze Resume
                    </button>
                </div>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
                className="grid grid-cols-4 gap-4 mb-9 max-lg:grid-cols-2 max-sm:grid-cols-1"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div variants={itemVariants} className="p-5 flex items-center gap-4 glass-card">
                    <div className="w-12 h-12 rounded-[--radius-md] flex items-center justify-center shrink-0" style={{ background: 'rgba(6, 182, 212, 0.12)', color: 'var(--color-accent-cyan)' }}>
                        <FileText size={22} />
                    </div>
                    <div>
                        <p className="text-2xl font-extrabold leading-none">{history.length}</p>
                        <p className="text-[0.78rem] text-text-muted mt-1 font-medium">Total Analyses</p>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="p-5 flex items-center gap-4 glass-card">
                    <div className="w-12 h-12 rounded-[--radius-md] flex items-center justify-center shrink-0" style={{ background: 'rgba(139, 92, 246, 0.12)', color: 'var(--color-accent-purple)' }}>
                        <TrendingUp size={22} />
                    </div>
                    <div>
                        <p className="text-2xl font-extrabold leading-none">{avgScore}<span className="text-[0.85rem] font-semibold text-text-secondary">%</span></p>
                        <p className="text-[0.78rem] text-text-muted mt-1 font-medium">Average Score</p>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="p-5 flex items-center gap-4 glass-card">
                    <div className="w-12 h-12 rounded-[--radius-md] flex items-center justify-center shrink-0" style={{ background: 'rgba(16, 185, 129, 0.12)', color: 'var(--color-accent-emerald)' }}>
                        <Target size={22} />
                    </div>
                    <div>
                        <p className="text-2xl font-extrabold leading-none">{bestScore}<span className="text-[0.85rem] font-semibold text-text-secondary">%</span></p>
                        <p className="text-[0.78rem] text-text-muted mt-1 font-medium">Best Score</p>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="p-5 flex items-center gap-4 glass-card">
                    <div className="w-12 h-12 rounded-[--radius-md] flex items-center justify-center shrink-0" style={{ background: 'rgba(245, 158, 11, 0.12)', color: 'var(--color-accent-amber)' }}>
                        <Clock size={22} />
                    </div>
                    <div>
                        <p className="text-2xl font-extrabold leading-none">
                            {history.length > 0
                                ? new Date(history[0].createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                                : '--'
                            }
                        </p>
                        <p className="text-[0.78rem] text-text-muted mt-1 font-medium">Last Analysis</p>
                    </div>
                </motion.div>
            </motion.div>

            {/* Recent Analyses */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
            >
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-[1.2rem] font-bold">Recent Analyses</h2>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center gap-4 py-15 px-8 text-text-secondary">
                        <div className="spinner" />
                        <p>Loading your analyses...</p>
                    </div>
                ) : history.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-15 px-8 text-center gap-4 glass-card">
                        <FileText size={48} className="text-text-muted opacity-50" />
                        <h3 className="text-[1.2rem] font-semibold">No analyses yet</h3>
                        <p className="text-text-secondary text-[0.9rem]">Upload your resume to get AI-powered feedback</p>
                        <button className="btn btn-primary" onClick={() => navigate('/upload')}>
                            <Upload size={18} />
                            Analyze Your First Resume
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {history.map((item, index) => (
                            <motion.div
                                key={item._id}
                                className="p-5 flex items-center justify-between gap-4 cursor-default glass-card max-sm:flex-col max-sm:items-start"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.08 }}
                            >
                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                    <ScoreGauge score={item.analysis.overallScore} size={52} />
                                    <div className="min-w-0 flex-1">
                                        <h4 className="text-[0.95rem] font-semibold whitespace-nowrap overflow-hidden text-ellipsis">{item.fileName}</h4>
                                        <p className="text-[0.8rem] text-text-muted mt-0.5">
                                            {new Date(item.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric', month: 'short', day: 'numeric',
                                            })}
                                        </p>
                                        {item.analysis.summary && (
                                            <p className="text-[0.82rem] text-text-secondary mt-1.5 line-clamp-2">{item.analysis.summary}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-5 shrink-0 max-sm:w-full max-sm:justify-between">
                                    <div className="flex flex-col gap-0.5 text-right">
                                        <span className="text-[0.8rem] font-semibold" style={{ color: getScoreColor(item.analysis.overallScore) }}>
                                            Score: {item.analysis.overallScore}
                                        </span>
                                        <span className="text-[0.8rem] font-semibold" style={{ color: getScoreColor(item.analysis.atsScore) }}>
                                            ATS: {item.analysis.atsScore}
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            className="btn btn-secondary btn-sm"
                                            onClick={() => navigate(`/analysis/${item._id}`)}
                                        >
                                            View <ChevronRight size={14} />
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDelete(item._id)}
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default Dashboard;
