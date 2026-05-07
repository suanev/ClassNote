import React, {useCallback, useEffect, useState} from 'react';

import {ThemePreference, useThemeContext} from '@providers/ThemeContext';
import {clearAppCache, getLastSync} from '@storage/index';

import SettingsScreen from './SettingsScreen';

const SettingsScreenContainer = () => {
  const {preference, setPreference} = useThemeContext();
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [clearVisible, setClearVisible] = useState(false);

  useEffect(() => {
    getLastSync().then(setLastSync);
  }, []);

  const handlePreferenceChange = useCallback((value: ThemePreference) => {
    setPreference(value);
  }, [setPreference]);

  const handleClearPress = useCallback(() => {
    setClearVisible(true);
  }, []);

  const handleClearDismiss = useCallback(() => {
    setClearVisible(false);
  }, []);

  const handleClearConfirm = useCallback(async () => {
    await clearAppCache();
    setLastSync(null);
    setClearVisible(false);
  }, []);

  return (
    <SettingsScreen
      preference={preference}
      lastSync={lastSync}
      clearVisible={clearVisible}
      onPreferenceChange={handlePreferenceChange}
      onClearPress={handleClearPress}
      onClearConfirm={handleClearConfirm}
      onClearDismiss={handleClearDismiss}
    />
  );
};

export default SettingsScreenContainer;
