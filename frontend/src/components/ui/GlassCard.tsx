import { ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface GlassCardProps extends HTMLMotionProps<'div'> {
    children: ReactNode;
    className?: string;
}

const GlassCard = ({ children, className = '', ...props }: GlassCardProps) => {
    return (
        <motion.div
            className={`glass-card ${className}`}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export default GlassCard;
