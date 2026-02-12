'use client';
import { useState, useEffect } from 'react';
import Modal from './Modal';
import Input from './Input';
import Button from './Button';
import { useSettings } from '../store/SettingsContext';

export default function SettingsModal({ isOpen, onClose }) {
    const { settings, updateSettings } = useSettings();
    const [formData, setFormData] = useState({ token: '', owner: '', repo: '', path: '' });

    useEffect(() => {
        if (isOpen) {
            setFormData(settings);
        }
    }, [isOpen, settings]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        updateSettings(formData);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="GitHub Configuration">
            <div className="space-y-6">
                <section>
                    <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2 px-1">Authentication</label>
                    <div className="space-y-3">
                        <div>
                            <Input
                                name="token"
                                type="password"
                                placeholder="GitHub Personal Access Token (ghp_...)"
                                value={formData.token}
                                onChange={handleChange}
                            />
                            <p className="text-[10px] text-text-muted mt-2 px-1 leading-relaxed italic opacity-80">
                                Stored locally in your browser. Use a token with <b>repo</b> scope.
                            </p>
                        </div>
                    </div>
                </section>

                <section>
                    <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2 px-1">Repository Details</label>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <Input
                                name="owner"
                                placeholder="Owner (username)"
                                value={formData.owner}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <Input
                                name="repo"
                                placeholder="Repo Name"
                                value={formData.repo}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="mt-3">
                        <Input
                            name="path"
                            placeholder="Path (e.g. notes/)"
                            value={formData.path}
                            onChange={handleChange}
                        />
                        <p className="text-[10px] text-text-muted mt-2 px-1 italic opacity-80">
                            Where your markdown files are located.
                        </p>
                    </div>
                </section>

                <div className="pt-2 flex flex-col gap-3">
                    <Button onClick={handleSave} className="w-full">
                        Update Settings
                    </Button>
                    <p className="text-[10px] text-center text-text-muted/50">
                        JSONote Mini v0.1.0 • Rheehose (Rhee Creative)
                    </p>
                </div>
            </div>
        </Modal>
    );
}
