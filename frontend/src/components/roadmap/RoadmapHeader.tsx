import { motion } from 'framer-motion';
import { TrendingUp, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface RoadmapHeaderProps {
    id: string;
}

const RoadmapHeader = ({ id }: RoadmapHeaderProps) => {
    const navigate = useNavigate();

    return (
        <motion.div
            className="flex items-center justify-between mb-8 flex-wrap gap-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="flex items-center gap-3">
                <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/analysis/${id}`)}>
                    <ArrowLeft size={16} /> Analysis
                </button>
                <h1 className="text-[1.6rem] font-extrabold tracking-tight text-text-primary">
                    <TrendingUp size={26} className="text-accent-cyan inline align-middle mr-3" />
                    Career Roadmap
                </h1>
            </div>
        </motion.div>
    );
};

export default RoadmapHeader;
