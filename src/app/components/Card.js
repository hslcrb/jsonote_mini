'use client';
import { motion } from 'framer-motion';

export default function Card({ children, className = '', onClick }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
            className={`glass-panel rounded-2xl p-4 ${className}`}
            onClick={onClick}
        >
            {children}
        </motion.div>
    );
}
