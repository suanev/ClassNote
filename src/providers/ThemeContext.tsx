import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {useColorScheme} from 'react-native';
import {getItem, setItem, storageKeys} from '@storage/index';

import {darkTheme, theme, AppTheme, DarkAppTheme} from '@theme/index';
import {paperLightTheme, paperDarkTheme, AppPaperTheme} from '@theme/paperTheme';

export type ThemePreference = 'light' | 'dark' | 'system';
export type ResolvedTheme   = 'light' | 'dark';

interface ThemeContextValue {
  preference:    ThemePreference;
  resolved:      ResolvedTheme;
  setPreference: (pref: ThemePreference) => void;
  theme:         AppTheme | DarkAppTheme;
  paperTheme:    AppPaperTheme;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const ThemeContextProvider = ({children}: {children: React.ReactNode}) => {
  const systemScheme = useColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>('system');

  useEffect(() => {
    getItem(storageKeys.theme).then(stored => {
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        setPreferenceState(stored);
      }
    });
  }, []);

  const setPreference = useCallback((pref: ThemePreference) => {
    setPreferenceState(pref);
    setItem(storageKeys.theme, pref);
  }, []);

  const resolved: ResolvedTheme =
    preference === 'system'
      ? systemScheme === 'dark' ? 'dark' : 'light'
      : preference;

  const activeTheme = useMemo(
    () => (resolved === 'dark' ? darkTheme : theme),
    [resolved],
  );
  const paperTheme = resolved === 'dark' ? paperDarkTheme : paperLightTheme;

  const value = useMemo(
    () => ({preference, resolved, setPreference, theme: activeTheme, paperTheme}),
    [preference, resolved, setPreference, activeTheme, paperTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useThemeContext = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useThemeContext must be used inside ThemeContextProvider');
  }
  return context;
}
