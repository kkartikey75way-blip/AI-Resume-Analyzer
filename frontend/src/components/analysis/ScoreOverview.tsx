import { motion } from 'framer-motion';
import ScoreGauge from '../ScoreGauge';

interface ScoreOverviewProps {
    overallScore: number;
    atsScore: number;
    summary: string;
}

const ScoreOverview = ({ overallScore, atsScore, summary }: ScoreOverviewProps) => {
    return (
        <motion.div
            className="p-8 mb-6 flex gap-10 items-center glass-card max-[900px]:flex-col max-[900px]:items-stretch"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="flex gap-10 max-sm:flex-col max-sm:items-center">
                <ScoreGauge score={overallScore} label="Overall" size={120} />
                <ScoreGauge score={atsScore} label="ATS Score" size={120} />
            </div>
            <div className="flex-1">
                <h3 className="text-[1.1rem] font-bold text-text-primary mb-3">Executive Summary</h3>
                <p className="text-text-secondary leading-relaxed text-[0.95rem]">
                    {summary}
                </p>
            </div>
        </motion.div>
    );
};

export default ScoreOverview;
