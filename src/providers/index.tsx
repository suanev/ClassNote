import React, {PropsWithChildren} from 'react';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {NavigationContainer} from '@react-navigation/native';
import {QueryClientProvider} from '@tanstack/react-query';
import {Provider as ReduxProvider} from 'react-redux';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {PaperProvider} from 'react-native-paper';
import {ThemeProvider} from 'styled-components/native';

import {linking} from '@navigation/linking';
import {ThemeContextProvider, useThemeContext} from '@theme/ThemeContext';
import {store} from '../store';
import {queryClient} from '../store/queryClient';

const UIProvidersBridge = ({children}: PropsWithChildren) => {
  const {theme, paperTheme} = useThemeContext();
  return (
    <ThemeProvider theme={theme}>
      <PaperProvider theme={paperTheme}>
        <BottomSheetModalProvider>{children}</BottomSheetModalProvider>
      </PaperProvider>
    </ThemeProvider>
  );
};

const AppProviders = ({children}: PropsWithChildren) => {
  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
};

export default AppProviders;
