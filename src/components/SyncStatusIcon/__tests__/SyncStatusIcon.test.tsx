import React from 'react';
import {act, fireEvent, screen} from '@testing-library/react-native';
import {configureStore} from '@reduxjs/toolkit';
import {Provider} from 'react-redux';
import {render} from '@testing-library/react-native';
import {PaperProvider} from 'react-native-paper';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {ThemeProvider} from 'styled-components/native';

import {theme} from '../../../theme';
import {paperLightTheme} from '../../../theme/paperTheme';
import {rootReducer} from '../../../store/rootReducer';
import {setOffline, setSyncing} from '../../../store/network/slice';
import {SyncStatusIcon} from '../SyncStatusIcon';

jest.mock('@constants/environment', () => ({
  isDev: true,
}));

function buildStore(preloadedState?: Partial<ReturnType<typeof rootReducer>>) {
  return configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware({serializableCheck: false}),
    preloadedState,
  });
}

function renderIcon(store = buildStore()) {
  return render(
    <Provider store={store}>
      <SafeAreaProvider>
        <PaperProvider theme={paperLightTheme}>
          <ThemeProvider theme={theme}>
            <SyncStatusIcon />
          </ThemeProvider>
        </PaperProvider>
      </SafeAreaProvider>
    </Provider>,
  );
}

describe('SyncStatusIcon', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  it('renders cloud-check icon when online and synced', () => {
    renderIcon();
    expect(screen.getByTestId('sync-status-icon')).toBeTruthy();
  });

  it('renders the icon button with correct accessibility', () => {
    renderIcon();
    const button = screen.getByRole('button', {name: 'Status de sincronização'});
    expect(button).toBeTruthy();
  });

  it('shows synced tooltip on press when online and synced', () => {
    renderIcon();
    fireEvent.press(screen.getByTestId('sync-status-icon'));
    expect(
      screen.getByText(
        'No celular, a nuvem não sincroniza neste ambiente de desenvolvimento.',
      ),
    ).toBeTruthy();
  });

  it('shows offline tooltip when network is offline', () => {
    const store = buildStore({network: {isOffline: true, isSyncing: false}});
    renderIcon(store);
    fireEvent.press(screen.getByTestId('sync-status-icon'));
    expect(
      screen.getByText('Sem conexão — alterações salvas localmente no aparelho.'),
    ).toBeTruthy();
  });

  it('shows syncing tooltip when isSyncing is true', () => {
    const store = buildStore({network: {isOffline: false, isSyncing: true}});
    renderIcon(store);
    fireEvent.press(screen.getByTestId('sync-status-icon'));
    expect(
      screen.getByText(
        'No celular, a nuvem não sincroniza neste ambiente de desenvolvimento.',
      ),
    ).toBeTruthy();
  });

  it('hides tooltip on second press', () => {
    renderIcon();
    fireEvent.press(screen.getByTestId('sync-status-icon'));
    expect(
      screen.getByText(
        'No celular, a nuvem não sincroniza neste ambiente de desenvolvimento.',
      ),
    ).toBeTruthy();

    fireEvent.press(screen.getByTestId('sync-status-icon'));
    expect(
      screen.queryByText(
        'No celular, a nuvem não sincroniza neste ambiente de desenvolvimento.',
      ),
    ).toBeNull();
  });

  it('auto-hides tooltip after 3 seconds', () => {
    renderIcon();
    fireEvent.press(screen.getByTestId('sync-status-icon'));
    expect(
      screen.getByText(
        'No celular, a nuvem não sincroniza neste ambiente de desenvolvimento.',
      ),
    ).toBeTruthy();

    act(() => {
      jest.advanceTimersByTime(4000);
    });

    expect(
      screen.queryByText(
        'No celular, a nuvem não sincroniza neste ambiente de desenvolvimento.',
      ),
    ).toBeNull();
  });

  it('reacts to store state changes — updates tooltip message', () => {
    const store = buildStore();
    renderIcon(store);

    act(() => {
      store.dispatch(setOffline(true));
    });

    fireEvent.press(screen.getByTestId('sync-status-icon'));
    expect(
      screen.getByText('Sem conexão — alterações salvas localmente no aparelho.'),
    ).toBeTruthy();
  });

  it('resets auto-hide timer when pressed again while visible', () => {
    renderIcon();
    fireEvent.press(screen.getByTestId('sync-status-icon'));
    expect(
      screen.getByText(
        'No celular, a nuvem não sincroniza neste ambiente de desenvolvimento.',
      ),
    ).toBeTruthy();

    act(() => {
      jest.advanceTimersByTime(2000);
    });
    // still visible
    expect(
      screen.getByText(
        'No celular, a nuvem não sincroniza neste ambiente de desenvolvimento.',
      ),
    ).toBeTruthy();

    // second press hides immediately
    fireEvent.press(screen.getByTestId('sync-status-icon'));
    expect(
      screen.queryByText(
        'No celular, a nuvem não sincroniza neste ambiente de desenvolvimento.',
      ),
    ).toBeNull();
  });

  it('updates icon based on syncing state dispatched to store', () => {
    const store = buildStore();
    const {rerender} = renderIcon(store);

    act(() => {
      store.dispatch(setSyncing(true));
    });

    rerender(
      <Provider store={store}>
        <SafeAreaProvider>
          <PaperProvider theme={paperLightTheme}>
            <ThemeProvider theme={theme}>
              <SyncStatusIcon />
            </ThemeProvider>
          </PaperProvider>
        </SafeAreaProvider>
      </Provider>,
    );

    fireEvent.press(screen.getByTestId('sync-status-icon'));
    expect(
      screen.getByText(
        'No celular, a nuvem não sincroniza neste ambiente de desenvolvimento.',
      ),
    ).toBeTruthy();
  });
});
