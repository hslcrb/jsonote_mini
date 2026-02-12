'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

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

    // 마운트 시 쿠키에서 설정 로드 / Load settings from cookies on mount
    useEffect(() => {
        const savedSettings = Cookies.get('jsonote_settings');
        if (savedSettings) {
            try {
                setSettings(JSON.parse(savedSettings));
            } catch (e) {
                console.error('설정 로드 중 오류 발생 / Error loading settings:', e);
            }
        }
    }, []);

    // 설정 업데이트 및 쿠키 저장 / Update settings and save to cookies
    const updateSettings = (newSettings) => {
        const updated = { ...settings, ...newSettings };
        setSettings(updated);
        // 쿠키에 저장 (보안을 위해 7일간 유지) / Save to cookies (expires in 7 days for security)
        Cookies.set('jsonote_settings', JSON.stringify(updated), { expires: 7, secure: true, sameSite: 'strict' });
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
