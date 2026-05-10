import React from 'react';
import {View} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {PaperProvider} from 'react-native-paper';
import {ThemeProvider} from 'styled-components/native';
import {Provider as ReduxProvider} from 'react-redux';
import {QueryClientProvider} from '@tanstack/react-query';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import type {Preview} from '@storybook/react';

import {ThemeContextProvider, useThemeContext} from '../src/theme/ThemeContext';
import {store} from '../src/store';
import {queryClient} from '../src/store/queryClient';

/**
 * Bridges styled-components + Paper with the app's theme tokens.
 * Wraps the story in the theme's background so dark mode is visible
 * without needing to configure the Storybook backgrounds addon manually.
 */
const ThemeBridge = ({children}: {children: React.ReactNode}) => {
  const {theme, paperTheme} = useThemeContext();
  return (
    <ThemeProvider theme={theme}>
      <PaperProvider theme={paperTheme}>
        <View style={{flex: 1, backgroundColor: theme.colors.bg}}>
          {children}
        </View>
      </PaperProvider>
    </ThemeProvider>
  );
};

const withProviders = (Story: React.ElementType) => (
  <GestureHandlerRootView style={{flex: 1}}>
    <QueryClientProvider client={queryClient}>
      <ReduxProvider store={store}>
        <SafeAreaProvider>
          <ThemeContextProvider>
            <ThemeBridge>
              <BottomSheetModalProvider>
                <Story />
              </BottomSheetModalProvider>
            </ThemeBridge>
          </ThemeContextProvider>
        </SafeAreaProvider>
      </ReduxProvider>
    </QueryClientProvider>
  </GestureHandlerRootView>
);

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'app-light',
      values: [
        {name: 'app-light', value: '#FAF8F2'},
        {name: 'app-dark', value: '#13110E'},
        {name: 'surface-light', value: '#FFFFFF'},
        {name: 'surface-dark', value: '#1A1814'},
      ],
    },
  },
  decorators: [withProviders],
};

export default preview;
