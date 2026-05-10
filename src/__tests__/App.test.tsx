/* eslint-disable @typescript-eslint/no-require-imports */
import React from 'react';
import {screen} from '@testing-library/react-native';
import ReactTestRenderer from 'react-test-renderer';

import {renderWithProviders} from '@test-utils';
import {flushSyncQueue, setOffline} from '../store/network/actions';

const mockDispatch = jest.fn();
const mockUseNetworkStatus = jest.fn();
const mockUseThemeContext = jest.fn();
const mockLogError = jest.fn();
const mockPreviousGlobalHandler = jest.fn();

jest.mock('../providers', () => ({
  __esModule: true,
  default: ({children}: {children: React.ReactNode}) => children,
}));

jest.mock('../theme/ThemeContext', () => ({
  useThemeContext: () => mockUseThemeContext(),
}));

jest.mock('@constants/environment', () => ({
  isDev: true,
}));

jest.mock('../navigation/RootNavigator', () => ({
  RootNavigator: () => {
    const React = require('react');
    const {Text} = require('react-native');
    return React.createElement(Text, null, 'Root navigator');
  },
}));

jest.mock('../hooks/useNetworkStatus', () => ({
  useNetworkStatus: () => mockUseNetworkStatus(),
}));

jest.mock('../hooks/useMonitoringContext', () => ({
  useMonitoringContext: jest.fn(),
}));

jest.mock('../services/monitoring', () => ({
  monitoring: {
    logError: (...args: unknown[]) => mockLogError(...args),
  },
}));

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseThemeContext.mockReturnValue({resolved: 'light'});
    mockUseNetworkStatus.mockReturnValue(null);
    delete (globalThis as {ErrorUtils?: unknown}).ErrorUtils;
  });

  it('should render correctly', async () => {
    const {default: App} = require('../App');

    await ReactTestRenderer.act(() => {
      ReactTestRenderer.create(<App />);
    });
  });

  it('should render the root navigator', () => {
    const {AppShell} = require('../App');

    renderWithProviders(<AppShell />);

    expect(screen.getByText('Root navigator')).toBeOnTheScreen();
  });

  it('should show the offline toast and dispatch offline state', () => {
    const {AppShell} = require('../App');
    mockUseNetworkStatus.mockReturnValue('offline');

    renderWithProviders(<AppShell />);

    expect(mockDispatch).toHaveBeenCalledWith(setOffline(true));
    expect(
      screen.getByText(
        'Você está offline. Suas alterações continuam salvas no aparelho. No celular, a nuvem não sincroniza neste ambiente de desenvolvimento.',
      ),
    ).toBeOnTheScreen();
  });

  it('should flush the sync queue when the connection is restored', () => {
    const {AppShell} = require('../App');
    mockUseNetworkStatus.mockReturnValue('restored');
    mockUseThemeContext.mockReturnValue({resolved: 'dark'});

    renderWithProviders(<AppShell />);

    expect(mockDispatch).toHaveBeenCalledWith(setOffline(false));
    expect(mockDispatch).toHaveBeenCalledWith(flushSyncQueue());
  });

  it('should log global errors and call the previous handler when ErrorUtils is available', () => {
    jest.resetModules();

    let registeredHandler:
      | ((error: Error, isFatal?: boolean) => void)
      | undefined;

    (
      globalThis as {
        ErrorUtils?: {
          getGlobalHandler: () => typeof registeredHandler;
          setGlobalHandler: (handler: NonNullable<typeof registeredHandler>) => void;
        };
      }
    ).ErrorUtils = {
      getGlobalHandler: () => mockPreviousGlobalHandler,
      setGlobalHandler: handler => {
        registeredHandler = handler;
      },
    };

    require('../App');

    const error = new Error('Global boom');
    registeredHandler?.(error, true);

    expect(mockLogError).toHaveBeenCalledWith(error, {fatal: 'true'});
    expect(mockPreviousGlobalHandler).toHaveBeenCalledWith(error, true);
  });

  it('should default the fatal flag to false when the global handler receives no flag', () => {
    jest.resetModules();

    let registeredHandler:
      | ((error: Error, isFatal?: boolean) => void)
      | undefined;

    (
      globalThis as {
        ErrorUtils?: {
          getGlobalHandler: () => undefined;
          setGlobalHandler: (handler: NonNullable<typeof registeredHandler>) => void;
        };
      }
    ).ErrorUtils = {
      getGlobalHandler: () => undefined,
      setGlobalHandler: handler => {
        registeredHandler = handler;
      },
    };

    require('../App');

    const error = new Error('Non fatal boom');
    registeredHandler?.(error);

    expect(mockLogError).toHaveBeenCalledWith(error, {fatal: 'false'});
  });
});
