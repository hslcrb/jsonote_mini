'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Plus, Settings, Search } from 'lucide-react';
import Button from './Button';
import Input from './Input';
import { useState } from 'react';

export default function NoteList({ notes, onSelectNote, onNewNote, onOpenSettings }) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredNotes = notes.filter(note =>
        note.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col h-[100dvh] bg-background relative"
        >
            {/* Top Bar */}
            <header className="px-6 py-4 flex items-center justify-between bg-surface/30 backdrop-blur-xl sticky top-0 z-10 border-b border-white/5">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                    JSONote
                </h1>
                <Button variant="ghost" icon={<Settings size={20} />} onClick={onOpenSettings} />
            </header>

            {/* Search Bar */}
            <div className="px-6 py-2 sticky top-16 z-10 bg-background/80 backdrop-blur-md">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                    <input
                        type="text"
                        placeholder="Search notes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-surface/50 border-none rounded-2xl py-3 pl-10 pr-4 text-sm text-foreground placeholder-text-muted focus:ring-1 focus:ring-accent/50 outline-none transition-all"
                    />
                </div>
            </div>

            {/* Note List */}
            <div className="flex-1 overflow-y-auto px-5 pb-32 pt-2 space-y-4">
                {notes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-text-muted text-sm text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-16 h-16 bg-surface/50 rounded-full flex items-center justify-center mb-4"
                        >
                            <FileText size={32} />
                        </motion.div>
                        <p className="mb-1 font-medium text-text-secondary">No notes found</p>
                        <p className="text-xs">Tap the + button to create a new note.</p>
                    </div>
                ) : (
                    filteredNotes.map((note, index) => (
                        <motion.div
                            key={note.sha}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => onSelectNote(note)}
                            className="bg-surface/40 backdrop-blur-md p-5 rounded-3xl border border-white/5 shadow-[0_4px_20px_rgba(0,0,0,0.2)] active:bg-surface/60 transition-all cursor-pointer"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-accent/20 rounded-2xl text-accent shadow-inner">
                                    <FileText size={22} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-lg text-text-primary tracking-tight truncate">{note.name.replace('.md', '')}</h3>
                                    <p className="text-xs font-medium text-text-muted mt-0.5 opacity-70">Markdown Note</p>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Floating Action Button (FAB) */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onNewNote}
                className="fixed bottom-6 right-6 w-14 h-14 bg-accent text-background rounded-full shadow-lg shadow-accent/20 flex items-center justify-center z-20"
            >
                <Plus size={28} strokeWidth={2.5} />
            </motion.button>
        </motion.div>
    );
}
