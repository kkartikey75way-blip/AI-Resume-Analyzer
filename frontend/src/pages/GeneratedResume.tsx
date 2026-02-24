import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { resumeAPI } from '../services/api';
import toast from 'react-hot-toast';
import {
    ArrowLeft, Copy, Printer, Sparkles, Mail, Phone, MapPin, Linkedin,
    Briefcase, GraduationCap, Wrench, Award, FolderKanban,
} from 'lucide-react';

interface GeneratedResume {
    contactInfo: {
        name: string;
        title: string;
        email: string;
        phone: string;
        location: string;
        linkedin: string;
    };
    summary: string;
    experience: {
        title: string;
        company: string;
        duration: string;
        bullets: string[];
    }[];
    education: {
        degree: string;
        institution: string;
        year: string;
        details: string;
    }[];
    skills: {
        technical: string[];
        soft: string[];
    };
    certifications: string[];
    projects: {
        name: string;
        description: string;
        tech: string[];
    }[];
}

const GeneratedResumePage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [resume, setResume] = useState<GeneratedResume | null>(null);
    const [loading, setLoading] = useState(true);

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

    const buildPlainText = (r: GeneratedResume): string => {
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
                <div className="flex flex-col items-center gap-6 py-20 text-text-secondary">
                    <div className="relative">
                        <div className="spinner" style={{ width: 56, height: 56, borderWidth: 3 }} />
                        <Sparkles size={24} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-accent-cyan animate-pulse" />
                    </div>
                    <div className="text-center">
                        <h3 className="text-[1.1rem] font-semibold text-text-primary mb-2">Generating Improved Resume</h3>
                        <p className="text-[0.9rem]">AI is crafting an optimized version based on your analysis...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!resume) return null;

    return (
        <div className="animate-[fadeInUp_0.5s_ease_forwards]">
            {/* Header */}
            <motion.div
                className="flex items-center justify-between mb-6 flex-wrap gap-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="flex items-center gap-3">
                    <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/analysis/${id}`)}>
                        <ArrowLeft size={16} /> Back to Analysis
                    </button>
                    <h1 className="text-[1.4rem] font-extrabold tracking-tight">
                        <Sparkles size={22} className="text-accent-cyan inline align-middle mr-2" />
                        Generated Resume
                    </h1>
                </div>
                <div className="flex gap-2 print:hidden">
                    <button className="btn btn-secondary btn-sm" onClick={handleCopy}>
                        <Copy size={16} /> Copy
                    </button>
                    <button className="btn btn-primary btn-sm" onClick={handlePrint}>
                        <Printer size={16} /> Print
                    </button>
                </div>
            </motion.div>

            {/* Resume Card */}
            <motion.div
                className="bg-white text-gray-900 rounded-[--radius-xl] shadow-[0_8px_40px_rgba(0,0,0,0.5)] overflow-hidden max-w-[850px] mx-auto print:shadow-none print:rounded-none"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                {/* Contact Header */}
                <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white px-10 py-8">
                    <h2 className="text-[2rem] font-black tracking-tight mb-1">{resume.contactInfo.name}</h2>
                    <p className="text-[1.1rem] font-medium text-cyan-300 mb-4">{resume.contactInfo.title}</p>
                    <div className="flex flex-wrap gap-4 text-[0.85rem] text-gray-300">
                        {resume.contactInfo.email && (
                            <span className="flex items-center gap-1.5"><Mail size={14} /> {resume.contactInfo.email}</span>
                        )}
                        {resume.contactInfo.phone && (
                            <span className="flex items-center gap-1.5"><Phone size={14} /> {resume.contactInfo.phone}</span>
                        )}
                        {resume.contactInfo.location && (
                            <span className="flex items-center gap-1.5"><MapPin size={14} /> {resume.contactInfo.location}</span>
                        )}
                        {resume.contactInfo.linkedin && (
                            <span className="flex items-center gap-1.5"><Linkedin size={14} /> {resume.contactInfo.linkedin}</span>
                        )}
                    </div>
                </div>

                <div className="px-10 py-8 space-y-7">
                    {/* Summary */}
                    <section>
                        <h3 className="flex items-center gap-2 text-[0.85rem] font-bold uppercase tracking-widest text-gray-500 mb-3 border-b-2 border-gray-200 pb-2">
                            <Briefcase size={16} /> Professional Summary
                        </h3>
                        <p className="text-[0.92rem] text-gray-700 leading-[1.8]">{resume.summary}</p>
                    </section>

                    {/* Experience */}
                    {resume.experience.length > 0 && (
                        <section>
                            <h3 className="flex items-center gap-2 text-[0.85rem] font-bold uppercase tracking-widest text-gray-500 mb-4 border-b-2 border-gray-200 pb-2">
                                <Briefcase size={16} /> Experience
                            </h3>
                            <div className="space-y-5">
                                {resume.experience.map((exp, i) => (
                                    <div key={i}>
                                        <div className="flex items-baseline justify-between flex-wrap gap-1">
                                            <h4 className="text-[0.95rem] font-bold text-gray-900">{exp.title}</h4>
                                            <span className="text-[0.82rem] text-gray-500 font-medium">{exp.duration}</span>
                                        </div>
                                        <p className="text-[0.88rem] text-cyan-700 font-semibold mb-2">{exp.company}</p>
                                        <ul className="space-y-1.5">
                                            {exp.bullets.map((bullet, j) => (
                                                <li key={j} className="text-[0.88rem] text-gray-700 leading-relaxed pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-cyan-600 before:font-bold">
                                                    {bullet}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Education */}
                    {resume.education.length > 0 && (
                        <section>
                            <h3 className="flex items-center gap-2 text-[0.85rem] font-bold uppercase tracking-widest text-gray-500 mb-4 border-b-2 border-gray-200 pb-2">
                                <GraduationCap size={16} /> Education
                            </h3>
                            <div className="space-y-3">
                                {resume.education.map((edu, i) => (
                                    <div key={i}>
                                        <div className="flex items-baseline justify-between flex-wrap gap-1">
                                            <h4 className="text-[0.95rem] font-bold text-gray-900">{edu.degree}</h4>
                                            <span className="text-[0.82rem] text-gray-500 font-medium">{edu.year}</span>
                                        </div>
                                        <p className="text-[0.88rem] text-cyan-700 font-semibold">{edu.institution}</p>
                                        {edu.details && <p className="text-[0.85rem] text-gray-600 mt-1">{edu.details}</p>}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Skills */}
                    {(resume.skills.technical.length > 0 || resume.skills.soft.length > 0) && (
                        <section>
                            <h3 className="flex items-center gap-2 text-[0.85rem] font-bold uppercase tracking-widest text-gray-500 mb-3 border-b-2 border-gray-200 pb-2">
                                <Wrench size={16} /> Skills
                            </h3>
                            {resume.skills.technical.length > 0 && (
                                <div className="mb-3">
                                    <h4 className="text-[0.82rem] font-semibold text-gray-600 mb-2 uppercase tracking-wider">Technical</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {resume.skills.technical.map((skill, i) => (
                                            <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 text-[0.82rem] font-medium rounded-full border border-gray-200">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {resume.skills.soft.length > 0 && (
                                <div>
                                    <h4 className="text-[0.82rem] font-semibold text-gray-600 mb-2 uppercase tracking-wider">Soft Skills</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {resume.skills.soft.map((skill, i) => (
                                            <span key={i} className="px-3 py-1 bg-cyan-50 text-cyan-700 text-[0.82rem] font-medium rounded-full border border-cyan-200">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </section>
                    )}

                    {/* Certifications */}
                    {resume.certifications.length > 0 && (
                        <section>
                            <h3 className="flex items-center gap-2 text-[0.85rem] font-bold uppercase tracking-widest text-gray-500 mb-3 border-b-2 border-gray-200 pb-2">
                                <Award size={16} /> Certifications
                            </h3>
                            <ul className="space-y-1.5">
                                {resume.certifications.map((cert, i) => (
                                    <li key={i} className="text-[0.88rem] text-gray-700 pl-4 relative before:content-['✓'] before:absolute before:left-0 before:text-emerald-600 before:font-bold">
                                        {cert}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {/* Projects */}
                    {resume.projects.length > 0 && (
                        <section>
                            <h3 className="flex items-center gap-2 text-[0.85rem] font-bold uppercase tracking-widest text-gray-500 mb-4 border-b-2 border-gray-200 pb-2">
                                <FolderKanban size={16} /> Projects
                            </h3>
                            <div className="space-y-4">
                                {resume.projects.map((project, i) => (
                                    <div key={i}>
                                        <h4 className="text-[0.95rem] font-bold text-gray-900">{project.name}</h4>
                                        <p className="text-[0.88rem] text-gray-700 mt-1">{project.description}</p>
                                        <div className="flex flex-wrap gap-1.5 mt-2">
                                            {project.tech.map((t, j) => (
                                                <span key={j} className="px-2 py-0.5 bg-violet-50 text-violet-700 text-[0.75rem] font-semibold rounded border border-violet-200">
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default GeneratedResumePage;
