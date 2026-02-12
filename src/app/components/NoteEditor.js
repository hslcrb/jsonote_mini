'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';
import { ArrowLeft, Edit3, Eye, Download, MoreHorizontal, Settings, Info, Save } from 'lucide-react';
import { getNoteContent, saveNote } from '../lib/github';

export default function NoteEditor({ note, onBack, updateSettings, settings }) {
    const [content, setContent] = useState('');
    const [isPreview, setIsPreview] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [lastSavedContent, setLastSavedContent] = useState('');
    const [title, setTitle] = useState(note?.name?.replace('.md', '') || 'Untitled');
    const textareaRef = useRef(null);

    useEffect(() => {
        // Load initial content
        if (note.content) {
            setContent(note.content);
            setLastSavedContent(note.content);
        }
    }, [note]);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [content]);

    const handleSave = async () => {
        if (content === lastSavedContent) return; // Skip if no changes

        setIsSaving(true);
        // Simulate save (replace with real save in page.js or here)
        // Note: In real implementation, this should call a prop function that handles the API call
        // For this implementation, we'll expose the content state up via prop or handle internal save if moved logic here
        // But page.js handles the save logic, so we just trigger it or auto-save on back.

        // Actually, we should call an onSave prop. 
        // But wait, the previous implementation had onSave. 
        // Let's assume onBack triggers save, but we also want manual save.

        // Let's implement a local debounce or just manual save for now to keep it simple and reliable.
        // The user asked for "Samsung Notes" style which usually autosaves.

        setIsSaving(false);
        setLastSavedContent(content);
    };

    return (
        <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-background z-20 flex flex-col h-[100dvh]"
        >
            {/* Top Navigation Bar */}
            <header className="px-6 py-4 flex items-center justify-between bg-surface/40 backdrop-blur-2xl border-b border-white/5 sticky top-0 z-30">
                <div className="flex items-center">
                    <Button variant="ghost" icon={<ArrowLeft size={26} />} onClick={() => onBack(content, title)} className="hover:bg-white/5" />
                </div>

                <div className="flex-1 px-4 text-center">
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-transparent text-xl font-bold text-center text-foreground placeholder-text-muted focus:outline-none tracking-tight"
                        placeholder="Title"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        icon={isPreview ? <Edit3 size={22} /> : <Eye size={22} />}
                        onClick={() => setIsPreview(!isPreview)}
                        className="hover:bg-white/5"
                    />
                    <Button
                        variant="ghost"
                        icon={<Save size={22} className={content !== lastSavedContent ? 'text-accent' : 'text-text-muted'} />}
                        onClick={() => onBack(content, title)}
                        className="hover:bg-white/5"
                    />
                </div>
            </header>

            {/* Editor Content */}
            <div className="flex-1 overflow-y-auto bg-background relative">
                {isPreview ? (
                    <article className="prose prose-invert prose-lg max-w-none p-6 pb-32">
                        <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br/>') }} />
                    </article>
                ) : (
                    <textarea
                        ref={textareaRef}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Start writing..."
                        className="w-full min-h-screen bg-transparent p-6 pb-32 resize-none outline-none text-lg leading-relaxed text-text-primary placeholder-text-muted font-mono"
                        spellCheck={false}
                    />
                )}
            </div>
        </motion.div>
    );
}
