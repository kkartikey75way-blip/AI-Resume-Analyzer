import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboard, Upload, History, LogOut, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const Layout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex min-h-screen relative overflow-hidden">
            <motion.aside
                className="w-70 min-h-screen bg-[--color-bg-glass] backdrop-blur-xl border-r border-[--color-border-default] flex flex-col fixed left-0 top-0 bottom-0 z-100 max-md:w-20 max-md:overflow-hidden"
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                transition={{ type: 'spring', damping: 25 }}
            >
                <div className="px-5 py-6 border-b border-[--color-border-default]">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 bg-linear-to-br from-accent-cyan to-accent-purple rounded-[--radius-md] flex items-center justify-center text-white shadow-[0_4px_15px_rgba(6,182,212,0.3)]">
                            <Sparkles size={24} />
                        </div>
                        <div className="max-md:hidden">
                            <h1 className="text-[1.2rem] font-extrabold bg-linear-to-br from-accent-cyan to-accent-purple bg-clip-text text-transparent tracking-tight">ResumeAI</h1>
                            <p className="text-[0.7rem] text-text-muted tracking-widest uppercase font-medium">Smart Analyzer</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 p-4 px-3 flex flex-col gap-1">
                    <NavLink to="/dashboard" className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-[--radius-md] text-text-secondary no-underline text-[0.9rem] font-medium transition-all duration-300 relative overflow-hidden hover:bg-[rgba(6,182,212,0.08)] hover:text-text-primary ${isActive ? 'bg-[rgba(6,182,212,0.12)] text-accent-cyan font-semibold before:content-[""] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-[3px] before:h-[60%] before:bg-linear-to-b before:from-accent-cyan before:to-accent-purple before:rounded-r' : ''}`
                    }>
                        <LayoutDashboard size={20} />
                        <span className="max-md:hidden">Dashboard</span>
                    </NavLink>
                    <NavLink to="/upload" className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-[--radius-md] text-text-secondary no-underline text-[0.9rem] font-medium transition-all duration-300 relative overflow-hidden hover:bg-[rgba(6,182,212,0.08)] hover:text-text-primary ${isActive ? 'bg-[rgba(6,182,212,0.12)] text-accent-cyan font-semibold before:content-[""] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-[3px] before:h-[60%] before:bg-linear-to-b before:from-accent-cyan before:to-accent-purple before:rounded-r' : ''}`
                    }>
                        <Upload size={20} />
                        <span className="max-md:hidden">Analyze Resume</span>
                    </NavLink>
                    <NavLink to="/history" className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-[--radius-md] text-text-secondary no-underline text-[0.9rem] font-medium transition-all duration-300 relative overflow-hidden hover:bg-[rgba(6,182,212,0.08)] hover:text-text-primary ${isActive ? 'bg-[rgba(6,182,212,0.12)] text-accent-cyan font-semibold before:content-[""] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-[3px] before:h-[60%] before:bg-linear-to-b before:from-accent-cyan before:to-accent-purple before:rounded-r' : ''}`
                    }>
                        <History size={20} />
                        <span className="max-md:hidden">History</span>
                    </NavLink>
                </nav>

                <div className="p-4 border-t border-[--color-border-default]">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-[38px] h-[38px] bg-linear-to-br from-accent-purple to-accent-rose rounded-[--radius-md] flex items-center justify-center font-bold text-[0.9rem] text-white shrink-0">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden max-md:hidden">
                            <p className="text-[0.85rem] font-semibold text-text-primary whitespace-nowrap overflow-hidden text-ellipsis">{user?.name}</p>
                            <p className="text-[0.75rem] text-text-muted whitespace-nowrap overflow-hidden text-ellipsis">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        className="flex items-center gap-2 w-full py-2.5 px-4 bg-[rgba(244,63,94,0.08)] border border-[rgba(244,63,94,0.15)] rounded-[--radius-md] text-accent-rose text-[0.85rem] font-medium cursor-pointer transition-all duration-300 font-[Inter,sans-serif] hover:bg-[rgba(244,63,94,0.15)] hover:border-[rgba(244,63,94,0.3)]"
                        onClick={handleLogout}
                    >
                        <LogOut size={18} />
                        <span className="max-md:hidden">Logout</span>
                    </button>
                </div>
            </motion.aside>

            <main className="flex-1 ml-70 min-h-screen relative z-1 max-md:ml-20">
                <div className="p-8 max-w-[1200px] mx-auto max-md:p-4">
                    <Outlet />
                </div>
            </main>

            {/* Decorative background elements */}
            <div className="fixed rounded-full blur-[100px] opacity-[0.08] pointer-events-none z-0 w-[500px] h-[500px] bg-accent-cyan -top-[150px] -right-[100px] animate-[float_15s_ease-in-out_infinite]" />
            <div className="fixed rounded-full blur-[100px] opacity-[0.08] pointer-events-none z-0 w-[400px] h-[400px] bg-accent-purple -bottom-[100px] left-[200px] animate-[float_20s_ease-in-out_infinite_reverse]" />
            <div className="fixed rounded-full blur-[100px] opacity-[0.08] pointer-events-none z-0 w-[300px] h-[300px] bg-accent-emerald top-1/2 right-[20%] animate-[float_18s_ease-in-out_infinite_5s]" />
        </div>
    );
};

export default Layout;
