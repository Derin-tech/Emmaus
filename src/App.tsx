import React, { useState, useEffect } from 'react';
import { AppNew } from './AppNew';
import { AppOriginal } from './AppOriginal';

export default function App() {
  const [theme, setTheme] = useState<'current' | 'dark'>('current');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'current' ? 'dark' : 'current');
  };

  if (theme === 'dark') {
    return <AppOriginal theme={theme} toggleTheme={toggleTheme} />;
  }
  
  return <AppNew theme={theme} toggleTheme={toggleTheme} />;
}
