'use client';
import { motion } from 'framer-motion';

export default function Input({ className = '', placeholder, type = 'text', value, onChange, ...props }) {
    const baseClasses = 'w-full px-5 py-3.5 rounded-2xl bg-surface/50 border border-white/5 focus:bg-surface/70 focus:border-accent/40 focus:ring-1 focus:ring-accent/20 outline-none transition-all duration-200 text-text-primary placeholder:text-text-muted/50 font-medium shadow-sm active:scale-[0.99] focus:scale-[1.01]';

    return (
        <motion.input
            className={`${baseClasses} ${className}`}
            placeholder={placeholder}
            type={type}
            value={value}
            onChange={onChange}
            whileFocus={{ scale: 1.01 }}
            {...props}
        />
    );
}
