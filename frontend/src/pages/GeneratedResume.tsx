import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { resumeAPI } from '../services/api';
import toast from 'react-hot-toast';
import { ArrowLeft, Copy, Sparkles, Download } from 'lucide-react';

import { GeneratedResume as IGeneratedResume } from '../types/resume';
import Spinner from '../components/ui/Spinner';
import ModernTemplate from '../components/resume/ModernTemplate';
import MinimalistTemplate from '../components/resume/MinimalistTemplate';
import ClassicTemplate from '../components/resume/ClassicTemplate';

type TemplateType = 'modern' | 'minimalist' | 'classic';

const GeneratedResumePage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [resume, setResume] = useState<IGeneratedResume | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTemplate, setActiveTemplate] = useState<TemplateType>('modern');
    const resumeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const generate = async () => {
            try {
                const res = await resumeAPI.generateResume(id!);
                setResume(res.data);
            } catch {
                toast.error('Failed to generate resume');
                navigate(`/analysis/${id}`);
            } finally {
                setLoading(false);
            }
        };
        generate();
    }, [id, navigate]);

    const handleCopy = async () => {
        if (!resume) return;
        const text = buildPlainText(resume);
        await navigator.clipboard.writeText(text);
        toast.success('Resume copied to clipboard!');
    };

    const handlePrint = () => {
        window.print();
    };

    const buildPlainText = (r: IGeneratedResume): string => {
        let text = `${r.contactInfo.name}\n${r.contactInfo.title}\n`;
        text += `${r.contactInfo.email} | ${r.contactInfo.phone} | ${r.contactInfo.location}`;
        if (r.contactInfo.linkedin) text += ` | ${r.contactInfo.linkedin}`;
        text += `\n\nPROFESSIONAL SUMMARY\n${r.summary}\n`;

        if (r.experience.length > 0) {
            text += '\nEXPERIENCE\n';
            r.experience.forEach((exp) => {
                text += `\n${exp.title} — ${exp.company} (${exp.duration})\n`;
                exp.bullets.forEach((b) => (text += `  • ${b}\n`));
            });
        }

        if (r.education.length > 0) {
            text += '\nEDUCATION\n';
            r.education.forEach((edu) => {
                text += `${edu.degree} — ${edu.institution} (${edu.year})\n`;
                if (edu.details) text += `  ${edu.details}\n`;
            });
        }

        if (r.skills.technical.length > 0 || r.skills.soft.length > 0) {
            text += '\nSKILLS\n';
            if (r.skills.technical.length > 0) text += `Technical: ${r.skills.technical.join(', ')}\n`;
            if (r.skills.soft.length > 0) text += `Soft: ${r.skills.soft.join(', ')}\n`;
        }

        if (r.certifications.length > 0) {
            text += `\nCERTIFICATIONS\n${r.certifications.join('\n')}\n`;
        }

        if (r.projects.length > 0) {
            text += '\nPROJECTS\n';
            r.projects.forEach((p) => {
                text += `${p.name}: ${p.description}\n  Tech: ${p.tech.join(', ')}\n`;
            });
        }

        return text;
    };

    if (loading) {
        return (
            <div className="animate-[fadeInUp_0.5s_ease_forwards]">
                <Spinner icon={Sparkles} />
                <div className="text-center -mt-16">
                    <h3 className="text-[1.1rem] font-semibold text-text-primary mb-2">Generating Improved Resume</h3>
                    <p className="text-[0.9rem] text-text-secondary">AI is crafting an optimized version based on your analysis...</p>
                </div>
            </div>
        );
    }

    if (!resume) return null;

    return (
        <div className="animate-[fadeInUp_0.5s_ease_forwards]">
            {/* Header */}
            <motion.div
                className="flex items-center justify-between mb-6 flex-wrap gap-4 print:hidden"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="flex items-center gap-3">
                    <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/analysis/${id}`)}>
                        <ArrowLeft size={16} /> Back
                    </button>
                    <h1 className="text-[1.4rem] font-extrabold tracking-tight max-sm:hidden">
                        <Sparkles size={22} className="text-accent-cyan inline align-middle mr-2" />
                        Improved Resume
                    </h1>
                </div>

                {/* Template Switcher */}
                <div className="flex bg-[--color-bg-glass] p-1 rounded-[--radius-md] border border-[--color-border-default]">
                    {(['modern', 'minimalist', 'classic'] as TemplateType[]).map((t) => (
                        <button
                            key={t}
                            onClick={() => setActiveTemplate(t)}
                            className={`px-3 py-1.5 rounded-[--radius-sm] text-[0.8rem] font-semibold transition-all duration-300 capitalize ${activeTemplate === t
                                    ? 'bg-accent-cyan text-white shadow-lg shadow-cyan-900/20'
                                    : 'text-text-secondary hover:text-text-primary'
                                }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>

                <div className="flex gap-2">
                    <button className="btn btn-secondary btn-sm" onClick={handleCopy}>
                        <Copy size={16} /> Copy
                    </button>
                    <button className="btn btn-primary btn-sm" onClick={handlePrint}>
                        <Download size={16} /> Save as PDF
                    </button>
                </div>
            </motion.div>

            {/* Resume Preview */}
            <div ref={resumeRef} className="print:m-0 print:p-0">
                <AnimatePresence mode="wait">
                    {activeTemplate === 'modern' && <ModernTemplate resume={resume} />}
                    {activeTemplate === 'minimalist' && <MinimalistTemplate resume={resume} />}
                    {activeTemplate === 'classic' && <ClassicTemplate resume={resume} />}
                </AnimatePresence>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    body { background: white !important; margin: 0 !important; padding: 0 !important; }
                    .print-hidden { display: none !important; }
                    aside, nav, header { display: none !important; }
                    main { margin: 0 !important; padding: 0 !important; width: 100% !important; }
                    .glass-card { background: white !important; box-shadow: none !important; border: none !important; }
                }
            ` }} />
        </div>
    );
};

export default GeneratedResumePage;
