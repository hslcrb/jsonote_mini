'use client';
import { useState, useEffect, useCallback } from 'react';
import { useSettings } from '@/app/store/SettingsContext';
import { createOctokit, fetchNotes, getNoteContent, saveNote } from '@/app/lib/github';
import NoteList from '@/app/components/NoteList';
import NoteEditor from '@/app/components/NoteEditor';
import SettingsModal from '@/app/components/SettingsModal';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
    const { settings } = useSettings();
    const [notes, setNotes] = useState([]);
    const [selectedNote, setSelectedNote] = useState(null);
    const [view, setView] = useState('list'); // 'list' | 'editor'
    const [noteContent, setNoteContent] = useState('');
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Helper to get octokit instance
    const getOctokit = useCallback(() => {
        if (!settings.token) return null;
        return createOctokit(settings.token);
    }, [settings.token]);

    // Fetch notes on load or settings change
    useEffect(() => {
        async function loadNotes() {
            if (!settings.token || !settings.owner || !settings.repo) {
                setIsSettingsOpen(true);
                return;
            }

            setLoading(true);
            setError(null);
            try {
                const octokit = getOctokit();
                const fetchedNotes = await fetchNotes(octokit, settings.owner, settings.repo, settings.path);
                setNotes(fetchedNotes);
            } catch (err) {
                setError('Failed to fetch notes. Check your settings.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        loadNotes();
    }, [settings, getOctokit]);

    const handleSelectNote = async (note) => {
        setSelectedNote(note);
        setLoading(true);
        try {
            const octokit = getOctokit();
            const content = await getNoteContent(octokit, settings.owner, settings.repo, settings.path, note.sha);
            setNoteContent(content);
            setView('editor');
        } catch (err) {
            console.error('Error loading note content:', err);
            setError('Failed to load note content.');
        } finally {
            setLoading(false);
        }
    };

    const handleNewNote = () => {
        setSelectedNote({ name: 'Untitled.md', sha: null, content: '' });
        setNoteContent('');
        setView('editor');
    };

    const handleBackToNotes = async (content, title) => {
        // Optimistic UI update or wait for save?
        // Let's wait for save to ensure data consistency, but show loading.

        if (!selectedNote) {
            setView('list');
            return;
        }

        // Only save if content or title changed (simple check)
        // For now, just save on every back to be safe (Samsung Notes style)

        setLoading(true);
        try {
            const octokit = getOctokit();
            let filename = title || 'Untitled';
            if (!filename.endsWith('.md')) filename += '.md';

            await saveNote(
                octokit,
                settings.owner,
                settings.repo,
                settings.path,
                filename,
                content,
                selectedNote.sha
            );

            // Refresh list
            const updatedNotes = await fetchNotes(octokit, settings.owner, settings.repo, settings.path);
            setNotes(updatedNotes);

        } catch (err) {
            console.error('Error saving note:', err);
            setError('Failed to save note.');
        } finally {
            setLoading(false);
            setView('list');
            setSelectedNote(null);
            setNoteContent('');
        }
    };

    return (
        <div className="h-[100dvh] w-full overflow-hidden bg-background text-foreground relative">
            <AnimatePresence mode="wait" initial={false}>
                {view === 'list' ? (
                    <NoteList
                        key="list"
                        notes={notes}
                        onSelectNote={handleSelectNote}
                        onNewNote={handleNewNote}
                        onOpenSettings={() => setIsSettingsOpen(true)}
                    />
                ) : (
                    <NoteEditor
                        key="editor"
                        note={{ ...selectedNote, content: noteContent }}
                        onBack={handleBackToNotes}
                    />
                )}
            </AnimatePresence>

            {/* Loading Overlay */}
            <AnimatePresence>
                {loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
                    >
                        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
                    </motion.div>
                )}
            </AnimatePresence>

            <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
        </div>
    );
}
