import React, { createContext, ReactNode, useMemo, useState, useContext } from 'react';
import { ThemeProvider } from '@emotion/react';
import { DarkTheme, LightTheme } from './../themes';
import { Box } from '@mui/system';


interface IAppThemeProviderProps {
    children: ReactNode;
}

interface IThemeContextData {
    themeName: 'light' | 'dark';
    toggleTheme: () => void;
}

const ThemeContext = createContext({} as IThemeContextData);

export const useAppThemeContext = () => {
    return useContext(ThemeContext);
};

export function AppThemeProvider({ children }: IAppThemeProviderProps) {
    const [themeName, setThemeName] = useState<'light' | 'dark'>('light');

    const toggleTheme = () => {
        setThemeName((prevThemeName) => (prevThemeName === 'light' ? 'dark' : 'light'));
    };

    const value = {
        themeName,
        toggleTheme,
    };

    const theme = useMemo(() => {
        return themeName === 'light' ? LightTheme : DarkTheme;
    }, [themeName]);

    return (
        <ThemeContext.Provider value={value}>
            <ThemeProvider theme={theme}>
                <Box width={"100vw"} height={"100vh"} bgcolor={theme.palette.background.default}>
                    {children}
                </Box>
            </ThemeProvider>
        </ThemeContext.Provider>
    );
}