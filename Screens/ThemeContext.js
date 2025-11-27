import * as React from 'react';
import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

export const ThemeContext = React.createContext({
  isDark: false,
  toggleTheme: () => {},
  theme: MD3LightTheme,
});

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = React.useState(false);

  const toggleTheme = () => setIsDark((prev) => !prev);

  const theme = isDark ? MD3DarkTheme : MD3LightTheme;

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
}
