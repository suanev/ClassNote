import React, {PropsWithChildren} from 'react';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {NavigationContainer} from '@react-navigation/native';
import {PersistQueryClientProvider} from '@tanstack/react-query-persist-client';
import {Provider as ReduxProvider} from 'react-redux';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {PaperProvider} from 'react-native-paper';
import {ThemeProvider} from 'styled-components/native';

import {linking} from '@navigation/linking';
import {ThemeContextProvider, useThemeContext} from '@theme/ThemeContext';
import {store} from '../store';
import {mmkvPersister, queryClient} from '../store/queryClient';
import type {AppTheme} from '@theme/index';

const UIProvidersBridge = ({children}: PropsWithChildren) => {
  const {theme, paperTheme} = useThemeContext();
  return (
    <ThemeProvider theme={theme as AppTheme}>
      <PaperProvider theme={paperTheme}>
        <BottomSheetModalProvider>{children}</BottomSheetModalProvider>
      </PaperProvider>
    </ThemeProvider>
  );
};

const AppProviders = ({children}: PropsWithChildren) => {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{persister: mmkvPersister}}>
      <ReduxProvider store={store}>
        <SafeAreaProvider>
          <ThemeContextProvider>
            <UIProvidersBridge>
              <NavigationContainer linking={linking}>
                {children}
              </NavigationContainer>
            </UIProvidersBridge>
          </ThemeContextProvider>
        </SafeAreaProvider>
      </ReduxProvider>
    </PersistQueryClientProvider>
  );
};

export default AppProviders;
