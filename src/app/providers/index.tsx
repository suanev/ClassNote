import React, {PropsWithChildren} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Provider as ReduxProvider} from 'react-redux';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {PaperProvider} from 'react-native-paper';
import {ThemeProvider} from 'styled-components/native';

import {linking} from '@navigation/linking';
import {store}   from '@app/store';
import {ThemeContextProvider, useThemeContext} from './ThemeContext';


const UIProvidersBridge = ({children}: PropsWithChildren) => {
  const {theme, paperTheme} = useThemeContext();
  return (
    <PaperProvider theme={paperTheme}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </PaperProvider>
  );
}

const AppProviders = ({children}: PropsWithChildren) => {
  return (
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
  );
}

export default AppProviders;
