import './globals.css';
import { Inter } from 'next/font/google';
import { SettingsProvider } from '@/app/store/SettingsContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'JSONote Mini',
    description: 'A GitHub-integrated, Samsung Notes-inspired dark mode note-taking app.',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <SettingsProvider>
                    {children}
                </SettingsProvider>
            </body>
        </html>
    );
}
