import React, {useCallback, useEffect, useRef, useState} from 'react';
import {ActivityIndicator, Dimensions, Pressable, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Portal} from 'react-native-paper';
import {useSelector} from 'react-redux';
import {useTheme} from 'styled-components/native';

import {isDev} from '@constants/environment';
import type {RootState} from '../../store/index';
import {
  BackdropPressable,
  TooltipCard,
  TooltipLabel,
  Wrapper,
} from './styles';

const TOOLTIP_MESSAGES = {
  offline: 'Sem conexão — alterações salvas localmente.',
  syncing: 'Sincronizando com o servidor...',
  synced: 'Tudo sincronizado.',
} as const;

const DEVELOPMENT_TOOLTIP_MESSAGES = {
  offline: 'Sem conexão — alterações salvas localmente no aparelho.',
  syncing: 'No celular, a nuvem não sincroniza neste ambiente de desenvolvimento.',
  synced: 'No celular, a nuvem não sincroniza neste ambiente de desenvolvimento.',
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

  const getSyncStatus = (): SyncStatus => {
    if (isOffline) return 'offline';
    if (isSyncing) return 'syncing';
    return 'synced';
  };

  const status = getSyncStatus();
  const message = (isDev ? DEVELOPMENT_TOOLTIP_MESSAGES : TOOLTIP_MESSAGES)[status];

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

  const getSyncIcon = (): React.ReactNode => {
    if (isOffline) return <MaterialCommunityIcons name="cloud-off-outline" size={22} color={theme.colors.danger} />;
    if (isSyncing) return <ActivityIndicator size="small" color={theme.colors.primary} />;
    return <MaterialCommunityIcons name="cloud-check" size={22} color={theme.colors.success} />;
  };

  const syncIcon = getSyncIcon();

  return (
    <View ref={iconRef} collapsable={false}>
      <Wrapper>
        <Pressable
          onPress={handlePress}
          hitSlop={10}
          accessibilityLabel="Status de sincronização"
          accessibilityRole="button"
          testID="sync-status-icon">
          {syncIcon}
        </Pressable>

        <Portal>
          {tooltipVisible ? (
            <BackdropPressable onPress={hideTooltip}>
              <TooltipCard
                $top={
                  iconLayout ? iconLayout.y + iconLayout.height + 6 : undefined
                }
                $right={
                  iconLayout
                    ? Dimensions.get('window').width - iconLayout.x - iconLayout.width
                    : undefined
                }
                elevation={3}
                testID="sync-tooltip">
                <TooltipLabel>{message}</TooltipLabel>
              </TooltipCard>
            </BackdropPressable>
          ) : null}
        </Portal>
      </Wrapper>
    </View>
  );
};
