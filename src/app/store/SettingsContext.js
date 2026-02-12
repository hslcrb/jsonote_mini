'use client';
import { createContext, useContext, useEffect, useState } from 'react';

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
    const [settings, setSettings] = useState({
        token: '',
        owner: '',
        repo: '',
        path: '',
    });

    useEffect(() => {
        const storedSettings = localStorage.getItem('jsonote_settings');
        if (storedSettings) {
            setSettings(JSON.parse(storedSettings));
        }
    }, []);

    const updateSettings = (newSettings) => {
        setSettings(newSettings);
        localStorage.setItem('jsonote_settings', JSON.stringify(newSettings));
    };

    return (
        <SettingsContext.Provider value={{ settings, updateSettings }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    return useContext(SettingsContext);
}
