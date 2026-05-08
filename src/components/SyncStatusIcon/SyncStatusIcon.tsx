import React, {useCallback, useEffect, useRef, useState} from 'react';
import {ActivityIndicator, Dimensions, Pressable, StyleSheet, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Portal, Surface, Text} from 'react-native-paper';
import {useSelector} from 'react-redux';
import {useTheme} from 'styled-components/native';

import type {RootState} from '../../store/index';

const TOOLTIP_MESSAGES = {
  offline: 'Sem conexão — alterações salvas localmente.',
  syncing: 'Sincronizando com o servidor...',
  synced: 'Tudo sincronizado.',
} as const;

type SyncStatus = keyof typeof TOOLTIP_MESSAGES;

type IconLayout = {x: number; y: number; width: number; height: number};

export const SyncStatusIcon = () => {
  const theme = useTheme();
  const isOffline = useSelector((state: RootState) => state.network.isOffline);
  const isSyncing = useSelector((state: RootState) => state.network.isSyncing);

  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [iconLayout, setIconLayout] = useState<IconLayout | null>(null);
  const iconRef = useRef<View>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const status: SyncStatus = isOffline ? 'offline' : isSyncing ? 'syncing' : 'synced';
  const message = TOOLTIP_MESSAGES[status];

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const hideTooltip = useCallback(() => {
    setTooltipVisible(false);
    clearTimer();
  }, [clearTimer]);

  const handlePress = useCallback(() => {
    if (tooltipVisible) {
      hideTooltip();
      return;
    }
    setTooltipVisible(true);
    clearTimer();
    timerRef.current = setTimeout(hideTooltip, 3000);
    // measure asynchronously to position the Portal tooltip on screen
    /* istanbul ignore next */
    iconRef.current?.measure((_x, _y, width, height, pageX, pageY) => {
      setIconLayout({x: pageX, y: pageY, width, height});
    });
  }, [tooltipVisible, hideTooltip, clearTimer]);

  useEffect(() => () => clearTimer(), [clearTimer]);

  const iconColor = isOffline ? theme.colors.danger : theme.colors.primary;

  return (
    <View ref={iconRef} collapsable={false} style={styles.wrapper}>
      <Pressable
        onPress={handlePress}
        hitSlop={10}
        accessibilityLabel="Status de sincronização"
        accessibilityRole="button"
        testID="sync-status-icon">
        {isOffline ? (
          <MaterialCommunityIcons
            name="cloud-off-outline"
            size={22}
            color={iconColor}
          />
        ) : isSyncing ? (
          <ActivityIndicator size="small" color={iconColor} />
        ) : (
          <MaterialCommunityIcons name="cloud-check" size={22} color={iconColor} />
        )}
      </Pressable>

      <Portal>
        {tooltipVisible ? (
          <Pressable style={StyleSheet.absoluteFill} onPress={hideTooltip}>
            <Surface
              style={[
                styles.tooltip,
                /* istanbul ignore next */
                iconLayout
                  ? {
                      top: iconLayout.y + iconLayout.height + 6,
                      right:
                        Dimensions.get('window').width -
                        iconLayout.x -
                        iconLayout.width,
                    }
                  : styles.tooltipFallback,
                {backgroundColor: theme.colors.text},
              ]}
              elevation={3}
              testID="sync-tooltip">
              <Text style={[styles.tooltipText, {color: theme.colors.surface}]}>
                {message}
              </Text>
            </Surface>
          </Pressable>
        ) : null}
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tooltip: {
    position: 'absolute',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    maxWidth: 220,
  },
  tooltipFallback: {
    top: 32,
    right: 0,
  },
  tooltipText: {
    fontSize: 13,
    lineHeight: 18,
  },
});
