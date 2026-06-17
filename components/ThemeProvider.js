'use client';
import { createContext, useContext, useEffect, useState } from 'react';

const GlobalVisualEnvironmentContext = createContext({ theme: 'light', toggleTheme: () => {} });

export function useTheme() {
  return useContext(GlobalVisualEnvironmentContext);
}

export default function ThemeProvider({ children }) {
  const [activeChromaticTheme, setActiveChromaticTheme] = useState('light');
  const [componentHydrationMounted, setComponentHydrationMounted] = useState(false);

  // Synchronize environmental styling presets during client-side hydration sequence
  useEffect(() => {
    const cachedThemeIdentifier = localStorage.getItem('studynook-theme');
    const computedSystemPreference = cachedThemeIdentifier || 
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    setActiveChromaticTheme(computedSystemPreference);
    document.documentElement.classList.toggle('dark', computedSystemPreference === 'dark');
    setComponentHydrationMounted(true);
  }, []);

  const handleThemeInversionExecution = () => {
    const calculatedSubsequentTheme = activeChromaticTheme === 'light' ? 'dark' : 'light';
    setActiveChromaticTheme(calculatedSubsequentTheme);
    localStorage.setItem('studynook-theme', calculatedSubsequentTheme);
    document.documentElement.classList.toggle('dark', calculatedSubsequentTheme === 'dark');
  };

  // Always wrap children inside the Provider blueprint to secure sub-component hook execution contexts
  return (
    <GlobalVisualEnvironmentContext.Provider 
      value={{ theme: activeChromaticTheme, toggleTheme: handleThemeInversionExecution }}
    >
      <div className={!componentHydrationMounted ? 'invisible' : ''}>
        {children}
      </div>
    </GlobalVisualEnvironmentContext.Provider>
  );
}