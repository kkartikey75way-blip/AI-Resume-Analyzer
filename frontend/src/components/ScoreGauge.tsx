import { motion } from 'framer-motion';

interface ScoreGaugeProps {
    score: number;
    size?: number;
    strokeWidth?: number;
    showLabel?: boolean;
    label?: string;
}

const ScoreGauge = ({ score, size = 80, strokeWidth = 6, showLabel = false, label }: ScoreGaugeProps) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    const getColor = (): string => {
        if (score >= 80) return '#10b981';
        if (score >= 60) return '#06b6d4';
        if (score >= 40) return '#f59e0b';
        return '#f43f5e';
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div style={{ position: 'relative', width: size, height: size }}>
                <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        strokeWidth={strokeWidth}
                        fill="none"
                        stroke="rgba(148, 163, 184, 0.1)"
                    />
                    <motion.circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        strokeWidth={strokeWidth}
                        fill="none"
                        stroke={getColor()}
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: offset }}
                        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                    />
                </svg>
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <motion.span
                        style={{
                            fontSize: size * 0.28,
                            fontWeight: 800,
                            color: getColor(),
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                    >
                        {score}
                    </motion.span>
                </div>
            </div>
            {showLabel && label && (
                <span style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    fontWeight: 500,
                    textAlign: 'center',
                }}>
                    {label}
                </span>
            )}
        </div>
    );
};

export default ScoreGauge;
