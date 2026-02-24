import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { resumeAPI } from '../services/api';
import toast from 'react-hot-toast';
import { TrendingUp, Calendar, User, Target, BookOpen, Sparkles } from 'lucide-react';

import { CareerRoadmapData } from '../types/resume';
import Spinner from '../components/ui/Spinner';
import RoadmapHeader from '../components/roadmap/RoadmapHeader';
import RoadmapTimeline from '../components/roadmap/RoadmapTimeline';
import GlassCard from '../components/ui/GlassCard';

const CareerRoadmap = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [roadmap, setRoadmap] = useState<CareerRoadmapData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRoadmap = async () => {
            try {
                const res = await resumeAPI.generateRoadmap(id!);
                setRoadmap(res.data);
            } catch (err) {
                toast.error('Failed to generate career roadmap');
                navigate(`/analysis/${id}`);
            } finally {
                setLoading(false);
            }
        };
        fetchRoadmap();
    }, [id, navigate]);

    if (loading) return <Spinner icon={TrendingUp} />;
    if (!roadmap) return null;

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="animate-[fadeInUp_0.5s_ease_forwards] max-w-[1000px] mx-auto pb-20">
            <RoadmapHeader id={id!} />

            <motion.div
                initial="hidden"
                animate="show"
                variants={{
                    show: { transition: { staggerChildren: 0.1 } }
                }}
                className="space-y-8"
            >
                {/* Highlights */}
                <div className="grid grid-cols-2 gap-6 max-md:grid-cols-1">
                    <GlassCard className="p-6 border-l-4 border-accent-cyan" variants={itemVariants}>
                        <div className="flex items-center gap-3 mb-3 text-text-secondary">
                            <User size={18} />
                            <span className="text-[0.8rem] font-bold uppercase tracking-wider">Current Position</span>
                        </div>
                        <h2 className="text-[1.4rem] font-bold text-text-primary">{roadmap.currentRole}</h2>
                    </GlassCard>
                    <GlassCard className="p-6 border-l-4 border-accent-purple" variants={itemVariants}>
                        <div className="flex items-center gap-3 mb-3 text-text-secondary">
                            <Target size={18} />
                            <span className="text-[0.8rem] font-bold uppercase tracking-wider">Long-Term Goal</span>
                        </div>
                        <h2 className="text-[1.4rem] font-bold text-text-primary">{roadmap.longTermGoal}</h2>
                    </GlassCard>
                </div>

                {/* Timeline Component */}
                <motion.div variants={itemVariants} className="space-y-6">
                    <h3 className="text-[1.1rem] font-bold text-text-primary flex items-center gap-2 px-2">
                        <Calendar size={20} className="text-accent-cyan" /> Growth Trajectory
                    </h3>
                    <RoadmapTimeline steps={roadmap.nextSteps} />
                </motion.div>

                {/* Skills Component */}
                <GlassCard
                    variants={itemVariants}
                    className="p-8 bg-linear-to-br from-[rgba(6,182,212,0.05)] to-[rgba(139,92,246,0.05)]"
                >
                    <div className="flex items-center gap-3 mb-6">
                        < BookOpen size={24} className="text-accent-purple" />
                        <h3 className="text-[1.2rem] font-extrabold text-text-primary">Skills to Master for Long-Term Success</h3>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {roadmap.skillsToDevelop.map((skill, i) => (
                            <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-bg-primary/50 border border-[--color-border-default] group hover:border-accent-purple transition-all duration-300">
                                <Sparkles size={14} className="text-accent-purple group-hover:animate-pulse" />
                                <span className="text-text-primary text-[0.9rem] font-medium">{skill}</span>
                            </div>
                        ))}
                    </div>
                </GlassCard>
            </motion.div>
        </div>
    );
};

export default CareerRoadmap;
