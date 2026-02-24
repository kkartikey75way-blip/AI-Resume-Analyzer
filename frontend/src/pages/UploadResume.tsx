import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { resumeAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Upload, FileText, Type, Sparkles, X, File } from 'lucide-react';

type TabType = 'upload' | 'paste';

interface ApiError {
    response?: {
        data?: {
            message?: string;
        };
    };
}

const UploadResume = () => {
    const [activeTab, setActiveTab] = useState<TabType>('upload');
    const [file, setFile] = useState<File | null>(null);
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile.type === 'application/pdf') {
                setFile(droppedFile);
            } else {
                toast.error('Only PDF files are supported');
            }
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleAnalyze = async () => {
        if (activeTab === 'upload' && !file) {
            toast.error('Please select a PDF file');
            return;
        }
        if (activeTab === 'paste' && !text.trim()) {
            toast.error('Please paste your resume text');
            return;
        }

        setLoading(true);
        try {
            let res;
            if (activeTab === 'upload' && file) {
                res = await resumeAPI.analyzeFile(file);
            } else {
                res = await resumeAPI.analyzeText(text);
            }
            toast.success('Analysis complete!');
            navigate(`/analysis/${res.data._id}`);
        } catch (err: unknown) {
            const error = err as ApiError;
            toast.error(error.response?.data?.message || 'Analysis failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-[fadeInUp_0.5s_ease_forwards]">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <h1 className="text-[1.8rem] font-extrabold tracking-tight">
                    <Sparkles size={28} className="text-accent-cyan inline align-middle mr-2" />
                    Analyze Your Resume
                </h1>
                <p className="text-text-secondary mt-1 text-[0.95rem]">
                    Upload a PDF or paste your resume text for AI-powered analysis
                </p>
            </motion.div>

            <motion.div
                className="mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
            >
                {/* Tab Switcher */}
                <div className="flex gap-2 mb-4 max-md:flex-col">
                    <button
                        className={`flex items-center gap-2 py-3 px-6 bg-bg-tertiary border border-border-default rounded-[--radius-md] text-text-secondary font-[Inter,sans-serif] text-[0.9rem] font-medium cursor-pointer transition-all duration-300 hover:text-text-primary hover:border-accent-cyan ${activeTab === 'upload' ? 'bg-[rgba(6,182,212,0.12)] text-accent-cyan border-accent-cyan font-semibold' : ''}`}
                        onClick={() => setActiveTab('upload')}
                    >
                        <Upload size={18} />
                        Upload PDF
                    </button>
                    <button
                        className={`flex items-center gap-2 py-3 px-6 bg-bg-tertiary border border-border-default rounded-[--radius-md] text-text-secondary font-[Inter,sans-serif] text-[0.9rem] font-medium cursor-pointer transition-all duration-300 hover:text-text-primary hover:border-accent-cyan ${activeTab === 'paste' ? 'bg-[rgba(6,182,212,0.12)] text-accent-cyan border-accent-cyan font-semibold' : ''}`}
                        onClick={() => setActiveTab('paste')}
                    >
                        <Type size={18} />
                        Paste Text
                    </button>
                </div>

                <div className="p-8 glass-card">
                    <AnimatePresence mode="wait">
                        {activeTab === 'upload' ? (
                            <motion.div
                                key="upload"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div
                                    className={`border-2 border-dashed border-border-default rounded-[--radius-lg] py-12 px-8 text-center cursor-pointer transition-all duration-300 relative overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-linear-to-br before:from-accent-cyan before:to-accent-purple before:opacity-0 before:transition-opacity before:duration-300 hover:border-accent-cyan hover:before:opacity-[0.03] ${dragActive ? 'border-accent-cyan shadow-[0_0_30px_rgba(6,182,212,0.15)] before:opacity-[0.03]' : ''}`}
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".pdf"
                                        onChange={handleFileSelect}
                                        style={{ display: 'none' }}
                                    />
                                    {file ? (
                                        <div className="flex items-center gap-4 relative z-1 text-left">
                                            <div className="w-14 h-14 bg-[rgba(139,92,246,0.12)] rounded-[--radius-md] flex items-center justify-center text-accent-purple shrink-0">
                                                <File size={32} />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-semibold text-[0.95rem]">{file.name}</p>
                                                <p className="text-text-muted text-[0.82rem] mt-1">
                                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                                </p>
                                            </div>
                                            <button
                                                className="w-9 h-9 bg-[rgba(244,63,94,0.1)] border border-[rgba(244,63,94,0.2)] rounded-[--radius-sm] text-accent-rose flex items-center justify-center cursor-pointer transition-all duration-150 shrink-0 hover:bg-[rgba(244,63,94,0.2)]"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setFile(null);
                                                }}
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="relative z-1 flex flex-col items-center gap-3">
                                            <div className="w-[72px] h-[72px] bg-[rgba(6,182,212,0.1)] rounded-[--radius-lg] flex items-center justify-center text-accent-cyan mb-2">
                                                <Upload size={36} />
                                            </div>
                                            <h3 className="text-[1.1rem] font-semibold">Drag & drop your PDF here</h3>
                                            <p className="text-text-secondary text-[0.9rem]">or click to browse files</p>
                                            <span className="text-[0.78rem] text-text-muted mt-2">Supports PDF files up to 10MB</span>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="paste"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="relative">
                                    <textarea
                                        className="w-full min-h-[300px] p-5 bg-bg-tertiary border border-border-default rounded-[--radius-md] text-text-primary font-[Inter,monospace] text-[0.88rem] leading-[1.7] resize-y outline-none transition-colors duration-300 focus:border-accent-cyan placeholder:text-text-muted"
                                        placeholder={`Paste your full resume text here...\n\nExample:\nJohn Doe\nSoftware Engineer\njohn@example.com | (555) 123-4567\n\nSUMMARY\nExperienced software engineer with 5+ years...`}
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                        rows={16}
                                    />
                                    <div className="text-right text-[0.78rem] text-text-muted mt-2">
                                        {text.length} characters
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <motion.button
                        className="btn btn-primary btn-lg w-full mt-6 text-base !py-[18px]"
                        onClick={handleAnalyze}
                        disabled={loading || (activeTab === 'upload' ? !file : !text.trim())}
                        whileHover={{ scale: loading ? 1 : 1.02 }}
                        whileTap={{ scale: loading ? 1 : 0.98 }}
                    >
                        {loading ? (
                            <div className="flex items-center gap-3">
                                <div className="spinner" style={{ width: 22, height: 22, borderWidth: 2 }} />
                                <span>AI is analyzing your resume...</span>
                            </div>
                        ) : (
                            <>
                                <Sparkles size={20} />
                                Analyze with AI
                            </>
                        )}
                    </motion.button>
                </div>

                {/* Tips */}
                <div className="grid grid-cols-3 gap-4 mt-8 max-md:grid-cols-1">
                    <div className="p-6 text-center glass-card">
                        <FileText size={20} className="text-accent-cyan mb-3 mx-auto" />
                        <h4 className="text-[0.9rem] font-semibold mb-2">Clean Formatting</h4>
                        <p className="text-[0.82rem] text-text-secondary leading-relaxed">Use a clean, ATS-friendly format with clear section headers</p>
                    </div>
                    <div className="p-6 text-center glass-card">
                        <Sparkles size={20} className="text-accent-cyan mb-3 mx-auto" />
                        <h4 className="text-[0.9rem] font-semibold mb-2">Quantify Results</h4>
                        <p className="text-[0.82rem] text-text-secondary leading-relaxed">Include metrics and numbers to demonstrate your impact</p>
                    </div>
                    <div className="p-6 text-center glass-card">
                        <FileText size={20} className="text-accent-cyan mb-3 mx-auto" />
                        <h4 className="text-[0.9rem] font-semibold mb-2">Use Keywords</h4>
                        <p className="text-[0.82rem] text-text-secondary leading-relaxed">Include relevant industry keywords for better ATS scoring</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default UploadResume;
