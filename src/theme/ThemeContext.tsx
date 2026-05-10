import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { NativeModules, useColorScheme } from 'react-native';

import { getItem, setItem, storageKeys } from '@storage/index';

import { darkTheme, theme, AppTheme, DarkAppTheme } from './index';
import { paperLightTheme, paperDarkTheme, AppPaperTheme } from './paperTheme';

export type ThemePreference = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

interface ThemeContextValue {
  preference: ThemePreference;
  resolved: ResolvedTheme;
  isHydrated: boolean;
  setPreference: (pref: ThemePreference) => void;
  theme: AppTheme | DarkAppTheme;
  paperTheme: AppPaperTheme;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const persistNativeThemePreference = async (preference: ThemePreference): Promise<void> => {
  const nativeModule = NativeModules.ThemePreferenceBridge as
    | { setThemePreference?: (value: ThemePreference) => Promise<void> }
    | undefined;

  try {
    await nativeModule?.setThemePreference?.(preference);
  } catch {
    // Ignore native sync failures and keep JS theme preference working.
  }
};

export const ThemeContextProvider = ({ children }: { children: React.ReactNode }) => {
  const systemScheme = useColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>('system');
  const [isHydrated, setIsHydrated] = useState(false);

  const setPreference = useCallback((pref: ThemePreference) => {
    setPreferenceState(pref);
    setItem(storageKeys.theme, pref);
    void persistNativeThemePreference(pref);
  }, []);

  const resolved: ResolvedTheme =
    preference === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : preference;

  const activeTheme = useMemo(() => (resolved === 'dark' ? darkTheme : theme), [resolved]);
  const paperTheme = resolved === 'dark' ? paperDarkTheme : paperLightTheme;

  const value = useMemo(
    () => ({ preference, resolved, isHydrated, setPreference, theme: activeTheme, paperTheme }),
    [preference, resolved, isHydrated, setPreference, activeTheme, paperTheme],
  );

  useEffect(() => {
    getItem(storageKeys.theme)
      .then((stored) => {
        if (stored === 'light' || stored === 'dark' || stored === 'system') {
          setPreferenceState(stored);
          void persistNativeThemePreference(stored);
          return;
        }

        void persistNativeThemePreference('system');
      })
      .finally(() => {
        setIsHydrated(true);
      });
  }, []);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useThemeContext must be used inside ThemeContextProvider');
  }

  return context;
};
