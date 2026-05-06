import React, {PropsWithChildren} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Provider as ReduxProvider} from 'react-redux';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {ThemeProvider} from 'styled-components/native';

import {linking} from '@navigation/linking';
import {store} from '@app/store';
import {ThemeContextProvider, useThemeContext} from './ThemeContext';

function StyledThemeBridge({children}: PropsWithChildren) {
  const {theme} = useThemeContext();
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

export function AppProviders({children}: PropsWithChildren): React.JSX.Element {
  return (
    <ReduxProvider store={store}>
      <SafeAreaProvider>
        <ThemeContextProvider>
          <StyledThemeBridge>
            <NavigationContainer linking={linking}>{children}</NavigationContainer>
          </StyledThemeBridge>
        </ThemeContextProvider>
      </SafeAreaProvider>
    </ReduxProvider>
  );
}
