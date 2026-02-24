import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Sparkles, Mail, Lock, ArrowRight, FileText } from 'lucide-react';
import { loginSchema, LoginFormData } from '../validators/schemas';

interface ApiError {
    response?: {
        data?: {
            message?: string;
        };
    };
}

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: '', password: '' },
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            await login(data.email, data.password);
            toast.success('Welcome back!');
            navigate('/dashboard');
        } catch (err: unknown) {
            const error = err as ApiError;
            toast.error(error.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-5">
            {/* Background orbs */}
            <div className="fixed inset-0 z-0">
                <div className="absolute rounded-full blur-[120px] opacity-[0.12] w-[600px] h-[600px] bg-accent-cyan -top-[200px] -right-[150px] animate-[float_15s_ease-in-out_infinite]" />
                <div className="absolute rounded-full blur-[120px] opacity-[0.12] w-[500px] h-[500px] bg-accent-purple -bottom-[200px] -left-[150px] animate-[float_20s_ease-in-out_infinite_reverse]" />
                <div className="absolute rounded-full blur-[120px] opacity-[0.12] w-[350px] h-[350px] bg-accent-emerald top-[40%] left-[30%] animate-[float_18s_ease-in-out_infinite_3s]" />
            </div>

            <motion.div
                className="flex w-full max-w-[900px] relative z-1 gap-12 items-center max-md:flex-col max-md:gap-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
            >
                {/* Left panel */}
                <div className="flex-1 flex flex-col gap-10 max-md:text-center max-md:items-center">
                    <div className="flex flex-col gap-3">
                        <div className="w-14 h-14 bg-linear-to-br from-accent-cyan to-accent-purple rounded-[--radius-lg] flex items-center justify-center text-white shadow-[0_8px_25px_rgba(6,182,212,0.3)] animate-[pulse-glow_3s_ease-in-out_infinite]">
                            <Sparkles size={32} />
                        </div>
                        <h1 className="text-[2.5rem] font-black bg-linear-to-br from-accent-cyan to-accent-purple bg-clip-text text-transparent -tracking-[1px]">ResumeAI</h1>
                        <p className="text-text-secondary text-[1.1rem]">Your AI-powered resume coach</p>
                    </div>
                    <div className="flex flex-col gap-4 max-md:hidden">
                        <div className="flex items-center gap-3 text-text-secondary text-[0.9rem] py-2 transition-colors duration-300 hover:text-text-primary">
                            <FileText size={20} className="text-accent-cyan shrink-0" />
                            <span>AI-Powered Analysis</span>
                        </div>
                        <div className="flex items-center gap-3 text-text-secondary text-[0.9rem] py-2 transition-colors duration-300 hover:text-text-primary">
                            <FileText size={20} className="text-accent-cyan shrink-0" />
                            <span>Section-by-Section Scoring</span>
                        </div>
                        <div className="flex items-center gap-3 text-text-secondary text-[0.9rem] py-2 transition-colors duration-300 hover:text-text-primary">
                            <FileText size={20} className="text-accent-cyan shrink-0" />
                            <span>ATS Compatibility Check</span>
                        </div>
                        <div className="flex items-center gap-3 text-text-secondary text-[0.9rem] py-2 transition-colors duration-300 hover:text-text-primary">
                            <FileText size={20} className="text-accent-cyan shrink-0" />
                            <span>Actionable Improvements</span>
                        </div>
                    </div>
                </div>

                {/* Right panel */}
                <div className="flex-1 max-w-[420px] max-md:max-w-full max-md:w-full">
                    <div className="p-9 glass-card">
                        <div className="mb-7">
                            <h2 className="text-2xl font-bold mb-1.5">Welcome Back</h2>
                            <p className="text-text-secondary text-[0.9rem]">Sign in to continue analyzing resumes</p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-[18px]">
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="email" className="text-[0.85rem] font-medium text-text-secondary">Email Address</label>
                                <div className="relative">
                                    <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none z-1" />
                                    <input
                                        id="email"
                                        type="email"
                                        className={`input-field !pl-11 w-full ${errors.email ? 'input-error' : ''}`}
                                        placeholder="name@example.com"
                                        {...register('email')}
                                    />
                                </div>
                                {errors.email && (
                                    <span className="block text-accent-rose text-[0.78rem] mt-1.5 font-medium pl-0.5">{errors.email.message}</span>
                                )}
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="password" className="text-[0.85rem] font-medium text-text-secondary">Password</label>
                                <div className="relative">
                                    <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none z-1" />
                                    <input
                                        id="password"
                                        type="password"
                                        className={`input-field !pl-11 w-full ${errors.password ? 'input-error' : ''}`}
                                        placeholder="••••••••"
                                        {...register('password')}
                                    />
                                </div>
                                {errors.password && (
                                    <span className="block text-accent-rose text-[0.78rem] mt-1.5 font-medium pl-0.5">{errors.password.message}</span>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary btn-lg w-full mt-2"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
                                ) : (
                                    <>
                                        Sign In
                                        <ArrowRight size={18} />
                                    </>
                                )}
                            </button>
                        </form>

                        <p className="text-center mt-5 text-text-secondary text-[0.85rem]">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-accent-cyan no-underline font-semibold transition-colors duration-150 hover:text-accent-purple">Create one</Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
