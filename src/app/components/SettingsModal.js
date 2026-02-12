'use client';
import { useState } from 'react';
import { useSettings } from '@/app/store/SettingsContext';
import Modal from './Modal';
import Input from './Input';
import Button from './Button';

/**
 * 설정 모달 컴포넌트 / Settings Modal Component
 * GitHub 인증 및 리포지토리 정보를 설정합니다. / Configures GitHub authentication and repository details.
 */
export default function SettingsModal({ isOpen, onClose }) {
    const { settings, updateSettings } = useSettings();
    const [formData, setFormData] = useState(settings);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        updateSettings(formData);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="GitHub 설정 / GitHub Configuration">
            <div className="space-y-6">
                {/* 인증 섹션 / Authentication Section */}
                <section>
                    <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2 px-1">인증 / Authentication</label>
                    <div className="space-y-3">
                        <div>
                            <Input
                                name="token"
                                type="password"
                                placeholder="GitHub 토큰 (ghp_...) / GitHub Token"
                                value={formData.token}
                                onChange={handleChange}
                            />
                            <p className="text-[10px] text-text-muted mt-2 px-1 leading-relaxed italic opacity-80">
                                브라우저 내부에 로컬로 저장됩니다. <b>repo</b> 권한이 필요합니다. / Stored locally in your browser. Use a token with <b>repo</b> scope.
                            </p>
                        </div>
                    </div>
                </section>

                {/* 리포지토리 정보 / Repository Details */}
                <section>
                    <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2 px-1">리포지토리 정보 / Repository Details</label>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <Input
                                name="owner"
                                placeholder="소유자 (ID) / Owner"
                                value={formData.owner}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <Input
                                name="repo"
                                placeholder="저장소 이름 / Repo Name"
                                value={formData.repo}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="mt-3">
                        <Input
                            name="path"
                            placeholder="폴더 경로 (예: notes/) / Path"
                            value={formData.path}
                            onChange={handleChange}
                        />
                        <p className="text-[10px] text-text-muted mt-2 px-1 italic opacity-80">
                            마크다운 파일이 위치할 경로입니다. / Where your markdown files are located.
                        </p>
                    </div>
                </section>

                <div className="pt-2 flex flex-col gap-3">
                    <Button onClick={handleSave} className="w-full">
                        설정 업데이트 / Update Settings
                    </Button>
                    <p className="text-[10px] text-center text-text-muted/50">
                        JSONote Mini v0.1.0 • Rheehose (Rhee Creative)
                    </p>
                </div>
            </div>
        </Modal>
    );
}
