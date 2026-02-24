import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';
import { GeneratedResume } from '../../types/resume';

const ClassicTemplate = ({ resume }: { resume: GeneratedResume }) => (
    <motion.div
        key="classic"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="bg-[#fdfdfd] text-gray-900 border border-gray-200 max-w-[850px] mx-auto flex shadow-xl print:shadow-none min-h-[1050px]"
    >
        {/* Sidebar */}
        <div className="w-[30%] bg-gray-50 p-8 border-r border-gray-100 flex flex-col gap-8">
            <div className="space-y-4">
                <h3 className="text-[0.8rem] font-bold text-blue-800 border-b border-blue-100 pb-2">Contact</h3>
                <div className="space-y-3">
                    <div className="text-[0.75rem] flex items-center gap-2 text-gray-600"><Mail size={12} /> {resume.contactInfo.email}</div>
                    <div className="text-[0.75rem] flex items-center gap-2 text-gray-600"><Phone size={12} /> {resume.contactInfo.phone}</div>
                    <div className="text-[0.75rem] flex items-center gap-2 text-gray-600"><MapPin size={12} /> {resume.contactInfo.location}</div>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-[0.8rem] font-bold text-blue-800 border-b border-blue-100 pb-2">Top Skills</h3>
                <div className="flex flex-col gap-2">
                    {resume.skills.technical.slice(0, 8).map((s, i) => (
                        <div key={i} className="text-[0.8rem] text-gray-600 flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-blue-300"></div> {s}
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-[0.8rem] font-bold text-blue-800 border-b border-blue-100 pb-2">Education</h3>
                {resume.education.map((edu, i) => (
                    <div key={i} className="space-y-1">
                        <p className="text-[0.8rem] font-bold text-gray-800 leading-tight">{edu.degree}</p>
                        <p className="text-[0.7rem] text-gray-500">{edu.institution}</p>
                    </div>
                ))}
            </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-10 bg-white">
            <div className="mb-8 border-b-4 border-double border-gray-100 pb-6">
                <h2 className="text-[2.2rem] font-serif font-bold text-gray-800 mb-1">{resume.contactInfo.name}</h2>
                <p className="text-[1rem] font-serif italic text-blue-700">{resume.contactInfo.title}</p>
            </div>

            <div className="space-y-8">
                <section>
                    <h3 className="text-[0.9rem] font-bold text-gray-900 mb-3 border-l-4 border-blue-800 pl-3">Summary</h3>
                    <p className="text-[0.9rem] leading-[1.6] text-gray-700 font-serif">{resume.summary}</p>
                </section>

                <section>
                    <h3 className="text-[0.9rem] font-bold text-gray-900 mb-5 border-l-4 border-blue-800 pl-3">Experience</h3>
                    <div className="space-y-6">
                        {resume.experience.map((exp, i) => (
                            <div key={i}>
                                <div className="flex justify-between mb-1">
                                    <h4 className="text-[0.95rem] font-bold text-gray-800">{exp.title}</h4>
                                    <span className="text-[0.8rem] font-medium text-gray-400">{exp.duration}</span>
                                </div>
                                <p className="text-[0.85rem] font-bold text-blue-800 mb-2 italic">{exp.company}</p>
                                <ul className="space-y-1 list-disc pl-5">
                                    {exp.bullets.map((b, j) => (
                                        <li key={j} className="text-[0.88rem] text-gray-600 leading-normal mb-1">{b}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    </motion.div>
);

export default ClassicTemplate;
