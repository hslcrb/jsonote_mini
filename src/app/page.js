'use client';
import { useState, useEffect, useCallback } from 'react';
import { useSettings } from '@/app/store/SettingsContext';
import { createOctokit, fetchNotes, getNoteContent, saveNote } from '@/app/lib/github';
import NoteList from '@/app/components/NoteList';
import NoteEditor from '@/app/components/NoteEditor';
import SettingsModal from '@/app/components/SettingsModal';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * 메인 홈 페이지 컴포넌트 / Main Home Page Component
 * 리스트 뷰와 에디터 뷰 간의 전환을 관리합니다. / Manages transitions between list view and editor view.
 */
export default function Home() {
    const { settings } = useSettings();
    const [notes, setNotes] = useState([]);
    const [selectedNote, setSelectedNote] = useState(null);
    const [view, setView] = useState('list'); // 'list' | 'editor'
    const [noteContent, setNoteContent] = useState('');
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Octokit 인스턴스 생성을 위한 헬퍼 / Helper to get octokit instance
    const getOctokit = useCallback(() => {
        if (!settings.token) return null;
        return createOctokit(settings.token);
    }, [settings.token]);

    // 설정 변경 시 노트 목록 로드 / Fetch notes on load or settings change
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
                setError('노트를 가져오는데 실패했습니다. 설정을 확인해주세요. / Failed to fetch notes. Check your settings.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        loadNotes();
    }, [settings, getOctokit]);

    // 특정 노트 선택 처리 / Handle single note selection
    const handleSelectNote = async (note) => {
        setSelectedNote(note);
        setLoading(true);
        try {
            const octokit = getOctokit();
            const content = await getNoteContent(octokit, settings.owner, settings.repo, settings.path, note.sha);
            setNoteContent(content);
            setView('editor');
        } catch (err) {
            console.error('노트 내용을 불러오는 중 오류 발생 / Error loading note content:', err);
            setError('노트 내용을 불러오는데 실패했습니다. / Failed to load note content.');
        } finally {
            setLoading(false);
        }
    };

    // 새 노트 생성 시작 / Start creating a new note
    const handleNewNote = () => {
        setSelectedNote({ name: 'Untitled.md', sha: null, content: '' });
        setNoteContent('');
        setView('editor');
    };

    // 목록으로 돌아가기 및 자동 저장 / Back to list and auto-save
    const handleBackToNotes = async (content, title) => {
        if (!selectedNote) {
            setView('list');
            return;
        }

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

            // 목록 갱신 / Refresh list
            const updatedNotes = await fetchNotes(octokit, settings.owner, settings.repo, settings.path);
            setNotes(updatedNotes);

        } catch (err) {
            console.error('노트 저장 중 오류 발생 / Error saving note:', err);
            setError('노트 저장에 실패했습니다. / Failed to save note.');
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

            {/* 로딩 오버레이 / Loading Overlay */}
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
