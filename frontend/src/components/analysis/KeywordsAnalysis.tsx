import { CheckCircle, AlertTriangle } from 'lucide-react';

interface Keyword {
    word: string;
    relevance: 'high' | 'medium' | 'low';
    found: boolean;
}

interface KeywordsAnalysisProps {
    keywords: Keyword[];
}

const KeywordsAnalysis = ({ keywords }: KeywordsAnalysisProps) => {
    return (
        <div className="glass-card p-6">
            <h3 className="text-[1.1rem] font-bold text-text-primary mb-5 flex items-center gap-2">
                ATS Keyword Analysis
            </h3>
            <div className="flex flex-wrap gap-2">
                {keywords.map((kw, i) => (
                    <div
                        key={i}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[0.82rem] font-medium border transition-all duration-300 ${kw.found
                                ? 'bg-accent-emerald/10 border-accent-emerald/20 text-accent-emerald'
                                : 'bg-accent-rose/10 border-accent-rose/20 text-accent-rose opacity-70 grayscale-[0.5] hover:opacity-100 hover:grayscale-0'
                            }`}
                    >
                        {kw.found ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
                        {kw.word}
                        <span className="text-[0.65rem] uppercase opacity-60 ml-1">{kw.relevance}</span>
                    </div>
                ))}
            </div>
            <p className="mt-6 text-[0.85rem] text-text-secondary italic">
                * Keywords in <span className="text-accent-rose font-bold">red</span> are missing from your resume but highly relevant to your target roles.
            </p>
        </div>
    );
};

export default KeywordsAnalysis;
