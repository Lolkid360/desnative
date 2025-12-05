/**
 * ThemeContext
 * 
 * Provides theme management with support for light, dark, and system-based themes.
 * Persists user preference to localStorage and responds to system preference changes.
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

/** Storage key for persisting theme preference */
const THEME_STORAGE_KEY = 'theme';

/** Available theme options */
type Theme = 'light' | 'dark' | 'system';

/** Resolved theme after considering system preferences */
type ResolvedTheme = 'light' | 'dark';

/** Theme context value type */
interface ThemeContextType {
    /** Current theme setting (may be 'system') */
    theme: Theme;
    /** Actual resolved theme based on settings and system preference */
    resolvedTheme: ResolvedTheme;
    /** Function to update the theme setting */
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [theme, setThemeState] = useState<Theme>(() => {
        const stored = localStorage.getItem(THEME_STORAGE_KEY);
        return (stored as Theme) || 'system';
    });

    const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(() => {
        if (typeof window !== 'undefined' && window.matchMedia) {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return 'light';
    });

    const resolvedTheme: ResolvedTheme = theme === 'system' ? systemTheme : theme;

    useEffect(() => {
        if (typeof window === 'undefined' || !window.matchMedia) return;

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e: MediaQueryListEvent) => {
            setSystemTheme(e.matches ? 'dark' : 'light');
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    useEffect(() => {
        localStorage.setItem(THEME_STORAGE_KEY, theme);

        // Apply theme class to document root
        const root = document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(resolvedTheme);
    }, [theme, resolvedTheme]);

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

/**
 * Hook to access theme context values and setter.
 * 
 * @returns Object containing theme, resolvedTheme, and setTheme function
 * @throws Error if used outside of ThemeProvider
 * 
 * @example
 * const { theme, resolvedTheme, setTheme } = useTheme();
 * setTheme('dark');
 */
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
