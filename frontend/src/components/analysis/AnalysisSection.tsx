import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface Suggestion {
    text: string;
    priority: 'high' | 'medium' | 'low';
}

interface SectionProps {
    section: {
        name: string;
        score: number;
        feedback: string;
        suggestions: Suggestion[];
    };
}

const AnalysisSection = ({ section }: SectionProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-accent-emerald';
        if (score >= 60) return 'text-accent-amber';
        return 'text-accent-rose';
    };

    const getPriorityIcon = (priority: string) => {
        switch (priority) {
            case 'high': return <AlertTriangle size={14} className="text-accent-rose" />;
            case 'medium': return <Info size={14} className="text-accent-amber" />;
            default: return <CheckCircle size={14} className="text-accent-emerald" />;
        }
    };

    return (
        <div className="glass-card mb-4 overflow-hidden border-l-4" style={{
            borderLeftColor: section.score >= 80 ? 'var(--color-accent-emerald)' :
                section.score >= 60 ? 'var(--color-accent-amber)' :
                    'var(--color-accent-rose)'
        }}>
            <button
                className="w-full p-5 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-4">
                    <div className={`text-[1.2rem] font-bold ${getScoreColor(section.score)}`}>
                        {section.score}%
                    </div>
                    <h4 className="text-[1rem] font-bold text-text-primary">{section.name}</h4>
                </div>
                {isOpen ? <ChevronUp size={20} className="text-text-secondary" /> : <ChevronDown size={20} className="text-text-secondary" />}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="p-5 pt-0 border-t border-white/5 bg-white/2">
                            <p className="text-[0.92rem] text-text-secondary leading-relaxed mb-5 mt-4">
                                {section.feedback}
                            </p>

                            <div className="space-y-3">
                                <h5 className="text-[0.75rem] font-bold uppercase tracking-widest text-text-tertiary mb-2">Suggestions for Improvement</h5>
                                {section.suggestions.map((sug, idx) => (
                                    <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/5 group hover:border-white/10 transition-colors">
                                        <div className="mt-0.5">{getPriorityIcon(sug.priority)}</div>
                                        <p className="text-[0.88rem] text-text-primary group-hover:text-white transition-colors">{sug.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AnalysisSection;
