'use client';
import { createContext, useContext, useState, useEffect } from 'react';

// 설정 컨텍스트 생성 / Create Settings Context
const SettingsContext = createContext();

/**
 * 설정 상태를 관리하는 프로바이더 컴포넌트 / Provider component managing settings state.
 * 로컬 스토리지를 사용하여 설정을 영속적으로 저장합니다. / Uses local storage to persist settings.
 */
export function SettingsProvider({ children }) {
    const [settings, setSettings] = useState({
        token: '',
        owner: '',
        repo: '',
        branch: 'main',
        path: '',
    });

    // 마운트 시 로컬 스토리지에서 설정 로드 / Load settings from local storage on mount
    useEffect(() => {
        const savedSettings = localStorage.getItem('jsonote_settings');
        if (savedSettings) {
            setSettings(JSON.parse(savedSettings));
        }
    }, []);

    // 설정 업데이트 및 로컬 스토리지 저장 / Update settings and save to local storage
    const updateSettings = (newSettings) => {
        const updated = { ...settings, ...newSettings };
        setSettings(updated);
        localStorage.setItem('jsonote_settings', JSON.stringify(updated));
    };

    return (
        <SettingsContext.Provider value={{ settings, updateSettings }}>
            {children}
        </SettingsContext.Provider>
    );
}

// 설정을 사용하기 위한 커스텀 훅 / Custom hook to use settings
export function useSettings() {
    return useContext(SettingsContext);
}
