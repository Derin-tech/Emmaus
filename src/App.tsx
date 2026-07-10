import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
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
  return (
    <BrowserRouter>
      <AppNew theme={theme} toggleTheme={toggleTheme} />
    </BrowserRouter>
  );
}
