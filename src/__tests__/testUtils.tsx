import React, {PropsWithChildren} from 'react';
import {render} from '@testing-library/react-native';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {PaperProvider} from 'react-native-paper';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {ThemeProvider} from 'styled-components/native';
import {configureStore} from '@reduxjs/toolkit';
import {Provider} from 'react-redux';

import {theme} from '../theme';
import {paperLightTheme} from '../theme/paperTheme';
import {rootReducer} from '../store/rootReducer';

const testStore = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware({serializableCheck: false}),
});

const makeQueryClient = () =>
  new QueryClient({
    defaultOptions: {queries: {retry: false}, mutations: {retry: false}},
  });

const TestProviders = ({children}: PropsWithChildren) => {
  return (
    <QueryClientProvider client={makeQueryClient()}>
      <Provider store={testStore}>
        <SafeAreaProvider>
          <PaperProvider theme={paperLightTheme}>
            <ThemeProvider theme={theme}>{children}</ThemeProvider>
          </PaperProvider>
        </SafeAreaProvider>
      </Provider>
    </QueryClientProvider>
  );
};

export function renderWithProviders(component: React.ReactElement) {
  return render(component, {wrapper: TestProviders});
}
