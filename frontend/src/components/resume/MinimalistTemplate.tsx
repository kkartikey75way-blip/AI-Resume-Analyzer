import { motion } from 'framer-motion';
import { GeneratedResume } from '../../types/resume';

const MinimalistTemplate = ({ resume }: { resume: GeneratedResume }) => (
    <motion.div
        key="minimalist"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white text-gray-900 p-12 max-w-[850px] mx-auto min-h-[1050px] shadow-sm print:shadow-none"
    >
        <div className="text-center mb-10">
            <h2 className="text-[2.5rem] font-light uppercase tracking-[0.2em] text-gray-900 mb-2">{resume.contactInfo.name}</h2>
            <div className="flex justify-center gap-4 text-[0.75rem] uppercase tracking-widest text-gray-500">
                <span>{resume.contactInfo.email}</span>
                <span>•</span>
                <span>{resume.contactInfo.phone}</span>
                <span>•</span>
                <span>{resume.contactInfo.location}</span>
            </div>
        </div>

        <div className="space-y-10">
            <div className="border-t border-gray-100 pt-8">
                <p className="text-[0.9rem] leading-relaxed text-gray-600 text-center italic max-w-[600px] mx-auto">
                    {resume.summary}
                </p>
            </div>

            <section>
                <h3 className="text-[0.8rem] font-bold uppercase tracking-[0.3em] text-gray-900 mb-6 flex items-center gap-4">
                    Experience <div className="h-[1px] flex-1 bg-gray-100"></div>
                </h3>
                <div className="space-y-8">
                    {resume.experience.map((exp, i) => (
                        <div key={i}>
                            <div className="flex justify-between items-baseline mb-2">
                                <h4 className="text-[1rem] font-semibold text-gray-800">{exp.title}</h4>
                                <span className="text-[0.75rem] bg-gray-50 px-2 py-1 text-gray-500 rounded">{exp.duration}</span>
                            </div>
                            <p className="text-[0.85rem] text-gray-500 uppercase tracking-wider mb-3">{exp.company}</p>
                            <ul className="space-y-2">
                                {exp.bullets.map((b, j) => (
                                    <li key={j} className="text-[0.88rem] text-gray-600 leading-relaxed indent-[-1em] pl-[1em]">
                                        <span className="text-gray-300 mr-2">—</span> {b}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>

            <div className="grid grid-cols-2 gap-12">
                <section>
                    <h3 className="text-[0.8rem] font-bold uppercase tracking-[0.3em] text-gray-900 mb-6">Education</h3>
                    <div className="space-y-6">
                        {resume.education.map((edu, i) => (
                            <div key={i}>
                                <h4 className="text-[0.9rem] font-medium text-gray-800">{edu.degree}</h4>
                                <p className="text-[0.8rem] text-gray-500">{edu.institution}</p>
                                <p className="text-[0.75rem] text-gray-400 mt-1">{edu.year}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <h3 className="text-[0.8rem] font-bold uppercase tracking-[0.3em] text-gray-900 mb-6">Skills</h3>
                    <div className="space-y-4">
                        <div>
                            <p className="text-[0.75rem] uppercase tracking-wider text-gray-400 mb-2">Technical</p>
                            <p className="text-[0.85rem] text-gray-600 leading-relaxed font-light">
                                {resume.skills.technical.join(' / ')}
                            </p>
                        </div>
                        <div>
                            <p className="text-[0.75rem] uppercase tracking-wider text-gray-400 mb-2">Personal</p>
                            <p className="text-[0.85rem] text-gray-600 leading-relaxed font-light">
                                {resume.skills.soft.join(' / ')}
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    </motion.div>
);

export default MinimalistTemplate;
