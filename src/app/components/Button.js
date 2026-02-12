'use client';
import { motion } from 'framer-motion';

export default function Button({ children, className = '', onClick, variant = 'primary', icon, iconPosition = 'left', ...props }) {
    const baseClasses = 'flex items-center justify-center transition-all font-semibold active:scale-95 disabled:opacity-50 disabled:pointer-events-none';

    const variants = {
        primary: 'bg-accent text-gray-900 hover:bg-accent-hover px-6 py-3 rounded-2xl shadow-[0_4px_15px_rgba(255,179,0,0.3)]',
        secondary: 'bg-surface text-foreground hover:bg-surface-hover px-6 py-3 rounded-2xl border border-white/5',
        ghost: 'bg-transparent text-text-secondary hover:text-foreground hover:bg-white/5 px-4 py-2 rounded-xl',
        icon: 'p-2.5 rounded-full hover:bg-white/10 text-text-muted hover:text-foreground transition-all duration-200',
        danger: 'bg-red-500/10 text-red-400 hover:bg-red-500/20 px-6 py-3 rounded-2xl border border-red-500/20'
    };

    return (
        <motion.button
            whileTap={{ scale: 0.95 }}
            className={`${baseClasses} ${variants[variant]} ${className}`}
            onClick={onClick}
            {...props}
        >
            {icon && iconPosition === 'left' && <span className={children ? 'mr-2.5' : ''}>{icon}</span>}
            {children}
            {icon && iconPosition === 'right' && <span className={children ? 'ml-2.5' : ''}>{icon}</span>}
        </motion.button>
    );
}
