import React, {useCallback, useEffect, useState} from 'react';

import {useThemeContext, ThemePreference} from '@app/providers/ThemeContext';
import {getLastSync, clearAppCache} from '@shared/storage';
import SettingsScreen from './SettingsScreen';

const SettingsScreenContainer = () => {
  const {preference, setPreference} = useThemeContext();
  const [lastSync,     setLastSync]     = useState<string | null>(null);
  const [clearVisible, setClearVisible] = useState(false);

  useEffect(() => {
    getLastSync().then(setLastSync);
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
      onPreferenceChange={setPreference}
      onClearPress={() => setClearVisible(true)}
      onClearConfirm={handleClearConfirm}
      onClearDismiss={() => setClearVisible(false)}
    />
  );
};

export default SettingsScreenContainer;
