import React, {useEffect} from 'react';
import {StatusBar, View} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
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

const OFFLINE_TOAST_MESSAGE =
  'Você está offline. Suas alterações ficam salvas no aparelho e serão enviadas para a nuvem assim que a conexão voltar.';

export const AppShell = () => {
  const {resolved} = useThemeContext();
  const networkStatus = useNetworkStatus();
  useMonitoringContext();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(setOffline(networkStatus === 'offline'));
    if (networkStatus === 'restored') {
      dispatch(flushSyncQueue());
    }
  }, [dispatch, networkStatus]);

  return (
    <View style={{flex: 1}}>
      <StatusBar
        barStyle={resolved === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      <RootNavigator />
      {networkStatus === 'offline' ? (
        <NetworkToast message={OFFLINE_TOAST_MESSAGE} />
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
