import React, {useCallback, useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {ThemePreference, useThemeContext} from '@theme/ThemeContext';
import {clearAppCache, getLastSync} from '@storage/index';
import {SettingsStackParamList} from '@navigation/types';

import SettingsScreen from './SettingsScreen';

type Navigation = StackNavigationProp<SettingsStackParamList>;

const SettingsScreenContainer = () => {
  const navigation = useNavigation<Navigation>();
  const {preference, setPreference} = useThemeContext();
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [clearVisible, setClearVisible] = useState(false);

  const handlePreferenceChange = useCallback(
    (value: ThemePreference) => {
      setPreference(value);
    },
    [setPreference],
  );

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

  const handleOpenDesignSystem = useCallback(() => {
    navigation.navigate('DesignSystem');
  }, [navigation]);

  useEffect(() => {
    getLastSync().then(setLastSync);
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
      onOpenDesignSystem={__DEV__ ? handleOpenDesignSystem : undefined}
    />
  );
};

export default SettingsScreenContainer;
