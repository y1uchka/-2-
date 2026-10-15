import { createContext, useState } from 'react';
export const AppContext = createContext();

export function AppProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const [actionCount, setActionCount] = useState(0);
  function toggleTheme() {
    setTheme(theme === 'light' ? 'dark' : 'light');
    addAction();
  }
  function addAction() {
    setActionCount(actionCount + 1);
  }
  return (
    <AppContext.Provider value={{theme,toggleTheme,actionCount,addAction}}>
      {children}
    </AppContext.Provider>
  );
}