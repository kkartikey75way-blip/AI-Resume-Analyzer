import { Sparkles, LucideIcon } from 'lucide-react';

interface SpinnerProps {
    size?: number;
    icon?: LucideIcon;
    className?: string;
}

const Spinner = ({ size = 56, icon: Icon = Sparkles, className = '' }: SpinnerProps) => {
    return (
        <div className={`flex flex-col items-center gap-6 py-20 text-text-secondary ${className}`}>
            <div className="relative">
                <div
                    className="spinner"
                    style={{ width: size, height: size, borderWidth: 3 }}
                />
                <Icon
                    size={size * 0.4}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-accent-cyan animate-pulse"
                />
            </div>
        </div>
    );
};

export default Spinner;
