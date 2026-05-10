import React, {useEffect, useState} from 'react';
import {StatusBar, View} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import BootSplash from 'react-native-bootsplash';
import {useDispatch} from 'react-redux';

import {NetworkToast} from '@components/NetworkToast';
import {useMonitoringContext} from '@hooks/useMonitoringContext';
import {useNetworkStatus} from '@hooks/useNetworkStatus';
import {RootNavigator} from '@navigation/RootNavigator';
import {useThemeContext} from '@theme/ThemeContext';
import {ErrorBoundary} from '@components/ErrorBoundary/ErrorBoundary';
import {monitoring} from '@services/monitoring';
import {flushSyncQueue, setOffline} from '@store/network/actions';
import {AppDispatch} from '@store/index';
import AppProviders from './providers';

const errorUtils = (globalThis as {ErrorUtils?: {
  getGlobalHandler?: () => ((error: Error, isFatal?: boolean) => void) | undefined;
  setGlobalHandler?: (handler: (error: Error, isFatal?: boolean) => void) => void;
}}).ErrorUtils;

if (errorUtils?.getGlobalHandler) {
  const previousHandler = errorUtils.getGlobalHandler();
  errorUtils.setGlobalHandler?.((error: Error, isFatal?: boolean) => {
    monitoring.logError(error, {fatal: String(isFatal ?? false)});
    previousHandler?.(error, isFatal);
  });
}

export const AppShell = () => {
  const {resolved, isHydrated} = useThemeContext();
  const networkStatus = useNetworkStatus();
  useMonitoringContext();
  const dispatch = useDispatch<AppDispatch>();
  const [toastDismissed, setToastDismissed] = useState(false);
  const [dismissedStatus, setDismissedStatus] = useState<'offline' | 'restored' | null>(null);

  useEffect(() => {
    dispatch(setOffline(networkStatus === 'offline'));
    if (networkStatus === 'restored') {
      dispatch(flushSyncQueue());
    }
  }, [dispatch, networkStatus]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    BootSplash.hide({fade: true}).catch(() => {
      // Ignore native failures in tests or unsupported runtimes.
    });
  }, [isHydrated]);

  return (
    <View style={{flex: 1}}>
      <StatusBar
        barStyle={resolved === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      <RootNavigator />
      {(networkStatus === 'offline' || networkStatus === 'restored') &&
      dismissedStatus !== networkStatus &&
      !toastDismissed ? (
        <NetworkToast
          status={networkStatus}
          onDismiss={() => {
            setToastDismissed(true);
            setDismissedStatus(networkStatus);
          }}
        />
      ) : null}
    </View>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{flex: 1}}>
        <AppProviders>
          <AppShell />
        </AppProviders>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
};

export default App;
