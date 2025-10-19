import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { ThemeProvider, createTheme } from '@mui/material';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeMode = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within ThemeContextProvider');
  }
  return context;
};

interface ThemeContextProviderProps {
  children: ReactNode;
}

export const ThemeContextProvider: React.FC<ThemeContextProviderProps> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const savedMode = localStorage.getItem('themeMode');
    return (savedMode === 'dark' || savedMode === 'light') ? savedMode : 'light';
  });

  const toggleMode = () => {
    setMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('themeMode', newMode);
      return newMode;
    });
  };

  const theme = useMemo(() => {
    
    const lightTheme = createTheme({
      palette: {
        mode: 'light',
        primary: {
          main: '#d6efff', 
          light: '#e7f6ff',
          dark: '#78cbff',
          contrastText: '#003a5e',
        },
        secondary: {
          main: '#fed18c', 
          light: '#fee3b9',
          dark: '#e98d02',
          contrastText: '#4e2f01',
        },
        error: {
          main: '#fe654f', 
          light: '#ffa394',
          dark: '#c61b01',
          contrastText: '#fefeff',
        },
        warning: {
          main: '#fed99b', 
          light: '#fff0d7',
          dark: '#f29a02',
          contrastText: '#513301',
        },
        background: {
          default: '#fefeff', 
          paper: '#ffffff',
        },
        text: {
          primary: '#000066',
          secondary: '#003a5e',
        },
      },
    });
    
    const darkTheme = createTheme({
      palette: {
        mode: 'dark',
        primary: {
          main: '#283845', 
          light: '#456077',
          dark: '#172129',
          contrastText: '#ccd8e2',
        },
        secondary: {
          main: '#b8b08d', 
          light: '#d5d0bb',
          dark: '#78704b',
          contrastText: '#282519',
        },
        error: {
          main: '#f29559', 
          light: '#f7c09c',
          dark: '#b8530f',
          contrastText: '#3d1c05',
        },
        warning: {
          main: '#f2d492', 
          light: '#faeed3',
          dark: '#d09618',
          contrastText: '#453208',
        },
        background: {
          default: '#202c39', 
          paper: '#283845',
        },
        text: {
          primary: '#c9d4e1',
          secondary: '#93aac2',
        },
      },
    });

    return mode === 'light' ? lightTheme : darkTheme;
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ mode, toggleMode }}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
