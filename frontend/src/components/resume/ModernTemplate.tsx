import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Linkedin, Briefcase, GraduationCap, Wrench, Award, FolderKanban } from 'lucide-react';
import { GeneratedResume } from '../../types/resume';

const ModernTemplate = ({ resume }: { resume: GeneratedResume }) => (
    <motion.div
        key="modern"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        className="bg-white text-gray-900 rounded-[--radius-xl] shadow-[0_8px_40px_rgba(0,0,0,0.5)] overflow-hidden max-w-[850px] mx-auto print:shadow-none print:rounded-none"
    >
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
            <section>
                <h3 className="flex items-center gap-2 text-[0.85rem] font-bold uppercase tracking-widest text-gray-500 mb-3 border-b-2 border-gray-200 pb-2">
                    <Briefcase size={16} /> Professional Summary
                </h3>
                <p className="text-[0.92rem] text-gray-700 leading-[1.8]">{resume.summary}</p>
            </section>

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

            <div className="grid grid-cols-2 gap-10 max-[600px]:grid-cols-1">
                <div className="space-y-7">
                    {resume.education.length > 0 && (
                        <section>
                            <h3 className="flex items-center gap-2 text-[0.85rem] font-bold uppercase tracking-widest text-gray-500 mb-4 border-b-2 border-gray-200 pb-2">
                                <GraduationCap size={16} /> Education
                            </h3>
                            <div className="space-y-3">
                                {resume.education.map((edu, i) => (
                                    <div key={i}>
                                        <h4 className="text-[0.95rem] font-bold text-gray-900">{edu.degree}</h4>
                                        <p className="text-[0.85rem] text-cyan-700 font-semibold">{edu.institution}</p>
                                        <p className="text-[0.8rem] text-gray-500">{edu.year}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {resume.skills.technical.length > 0 && (
                        <section>
                            <h3 className="flex items-center gap-2 text-[0.85rem] font-bold uppercase tracking-widest text-gray-500 mb-3 border-b-2 border-gray-200 pb-2">
                                <Wrench size={16} /> Technical Skills
                            </h3>
                            <div className="flex flex-wrap gap-1.5">
                                {resume.skills.technical.map((skill, i) => (
                                    <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-[0.8rem] rounded border border-gray-200 font-medium">{skill}</span>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                <div className="space-y-7">
                    {resume.skills.soft.length > 0 && (
                        <section>
                            <h3 className="flex items-center gap-2 text-[0.85rem] font-bold uppercase tracking-widest text-gray-500 mb-3 border-b-2 border-gray-200 pb-2">
                                <Award size={16} /> Soft Skills
                            </h3>
                            <div className="flex flex-wrap gap-1.5">
                                {resume.skills.soft.map((skill, i) => (
                                    <span key={i} className="px-2 py-1 bg-cyan-50 text-cyan-700 text-[0.8rem] rounded border border-cyan-100 font-medium">{skill}</span>
                                ))}
                            </div>
                        </section>
                    )}

                    {resume.projects.length > 0 && (
                        <section>
                            <h3 className="flex items-center gap-2 text-[0.85rem] font-bold uppercase tracking-widest text-gray-500 mb-4 border-b-2 border-gray-200 pb-2">
                                <FolderKanban size={16} /> Projects
                            </h3>
                            <div className="space-y-3">
                                {resume.projects.map((p, i) => (
                                    <div key={i}>
                                        <h4 className="text-[0.88rem] font-bold text-gray-900">{p.name}</h4>
                                        <p className="text-[0.8rem] text-gray-600 line-clamp-2">{p.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    </motion.div>
);

export default ModernTemplate;
