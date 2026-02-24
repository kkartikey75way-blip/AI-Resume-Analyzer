import { motion } from 'framer-motion';
import { Zap, Award } from 'lucide-react';
import { CareerRoadmapStep } from '../../types/resume';

interface RoadmapTimelineProps {
    steps: CareerRoadmapStep[];
}

const RoadmapTimeline = ({ steps }: RoadmapTimelineProps) => {
    return (
        <div className="relative pl-8 border-l border-[--color-border-default] ml-4 space-y-10 py-2">
            {steps.map((step, idx) => (
                <div key={idx} className="relative">
                    {/* Dot */}
                    <div className="absolute -left-[41px] top-0 w-5 h-5 rounded-full bg-accent-cyan border-4 border-bg-primary shadow-[0_0_15px_rgba(6,182,212,0.5)]" />

                    <div className="glass-card p-6">
                        <div className="flex justify-between items-start mb-4 flex-wrap gap-2">
                            <div>
                                <span className="text-[0.75rem] font-bold text-accent-cyan bg-cyan-950/40 px-3 py-1 rounded-full">{step.timeframe}</span>
                                <h4 className="text-[1.2rem] font-extrabold mt-3 text-text-primary">{step.title}</h4>
                            </div>
                        </div>

                        <p className="text-text-secondary text-[0.9rem] leading-relaxed mb-6">
                            {step.description}
                        </p>

                        <div className="grid grid-cols-2 gap-6 max-sm:grid-cols-1">
                            <div>
                                <h5 className="text-[0.75rem] font-bold text-text-primary uppercase tracking-widest mb-3 flex items-center gap-1.5">
                                    <Zap size={14} className="text-accent-amber" /> Required Skills
                                </h5>
                                <div className="flex flex-wrap gap-2">
                                    {step.requiredSkills.map((s, i) => (
                                        <span key={i} className="px-2.5 py-1 rounded-md bg-[rgba(245,158,11,0.08)] text-accent-amber text-[0.75rem] font-medium border border-[rgba(245,158,11,0.2)]">
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h5 className="text-[0.75rem] font-bold text-text-primary uppercase tracking-widest mb-3 flex items-center gap-1.5">
                                    <Award size={14} className="text-accent-emerald" /> Certifications
                                </h5>
                                <div className="flex flex-wrap gap-2">
                                    {step.recommendedCertifications.map((c, i) => (
                                        <span key={i} className="px-2.5 py-1 rounded-md bg-[rgba(16,185,129,0.08)] text-accent-emerald text-[0.75rem] font-medium border border-[rgba(16,185,129,0.2)]">
                                            {c}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default RoadmapTimeline;
