import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {useColorScheme} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {colors}     from '@theme/colors';
import {darkColors} from '@theme/darkColors';
import {shadows}    from '@theme/shadows';
import {spacing}    from '@theme/spacing';
import {typography} from '@theme/typography';
import {animations} from '@theme/animations';
import {paperLightTheme, paperDarkTheme, AppPaperTheme} from '@theme/paperTheme';

export type ThemePreference = 'light' | 'dark' | 'system';
export type ResolvedTheme   = 'light' | 'dark';

const STORAGE_KEY = '@teacherobs:themePreference';

const buildTheme = (resolved: ResolvedTheme) => ({
  colors:    resolved === 'dark' ? darkColors : colors,
  typography,
  spacing,
  shadows,
  animations,
});

interface ThemeContextValue {
  preference:    ThemePreference;
  resolved:      ResolvedTheme;
  setPreference: (pref: ThemePreference) => void;
  theme:         ReturnType<typeof buildTheme>;
  paperTheme:    AppPaperTheme;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const ThemeContextProvider = ({children}: {children: React.ReactNode}) => {
  const systemScheme = useColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>('system');

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(stored => {
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        setPreferenceState(stored);
      }
    });
  }, []);

  const setPreference = useCallback((pref: ThemePreference) => {
    setPreferenceState(pref);
    AsyncStorage.setItem(STORAGE_KEY, pref);
  }, []);

  const resolved: ResolvedTheme =
    preference === 'system'
      ? systemScheme === 'dark' ? 'dark' : 'light'
      : preference;

  const theme      = useMemo(() => buildTheme(resolved), [resolved]);
  const paperTheme = resolved === 'dark' ? paperDarkTheme : paperLightTheme;

  const value = useMemo(
    () => ({preference, resolved, setPreference, theme, paperTheme}),
    [preference, resolved, setPreference, theme, paperTheme],
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
