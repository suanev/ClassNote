/* eslint-disable @typescript-eslint/no-require-imports */
import React from 'react';
import {act, screen} from '@testing-library/react-native';

import {renderWithProviders} from '@test-utils';
import SettingsScreenContainer from '../index';

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const mockSetPreference = jest.fn();
const mockGetLastSync = jest.fn();
const mockGetItem = jest.fn();
const mockSetItem = jest.fn();
const mockTouchLastSync = jest.fn();
const mockDeleteClass = jest.fn();
const mockDeleteObservation = jest.fn();
const mockGetCurrentAppIcon = jest.fn();
const mockSetAppIcon = jest.fn();

jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    useNavigation: () => ({navigate: mockNavigate, goBack: mockGoBack}),
  };
});

jest.mock('@theme/ThemeContext', () => ({
  useThemeContext: () => ({
    preference: 'system',
    setPreference: mockSetPreference,
  }),
}));

jest.mock('@storage/index', () => ({
  getLastSync: () => mockGetLastSync(),
  getItem: () => mockGetItem(),
  setItem: (...args: unknown[]) => mockSetItem(...args),
  touchLastSync: () => mockTouchLastSync(),
  storageKeys: {
    appIcon: 'app-icon',
  },
}));

jest.mock('@hooks/useClasses', () => ({
  useClassesQuery: () => ({
    data: [{id: 'class-1', name: '5º Ano A', shift: 'Manhã'}],
  }),
}));

jest.mock('@hooks/useObservations', () => ({
  useObservationsQuery: () => ({
    data: [
      {
        id: 'obs-1',
        student: 'Ana',
        className: '5º Ano A',
        classId: 'class-1',
        text: 'Obs 1',
        createdAt: '2026-05-07T10:30:00.000Z',
        updatedAt: '2026-05-07T10:30:00.000Z',
        favorite: false,
      },
      {
        id: 'obs-2',
        student: 'Pedro',
        className: '5º Ano A',
        classId: 'class-1',
        text: 'Obs 2',
        createdAt: '2026-05-07T10:30:00.000Z',
        updatedAt: '2026-05-07T10:30:00.000Z',
        favorite: false,
      },
    ],
  }),
}));

jest.mock('@services/classes', () => ({
  deleteClass: (...args: unknown[]) => mockDeleteClass(...args),
}));

jest.mock('@services/observations', () => ({
  deleteObservation: (...args: unknown[]) => mockDeleteObservation(...args),
}));

jest.mock('@services/appIcon', () => ({
  appIconService: {
    getCurrentAppIcon: () => mockGetCurrentAppIcon(),
    setAppIcon: (...args: unknown[]) => mockSetAppIcon(...args),
  },
}));

jest.mock('../SettingsScreen', () => ({
  __esModule: true,
  default: (props: {
    preference: string;
    lastSync: string | null;
    classPendingDeletion: {id: string; name: string; observationsCount: number} | null;
    deleteClassErrorVisible: boolean;
    appIcon: string;
    onBack: () => void;
    onAppIconChange: (value: 'default' | 'second_option') => Promise<void>;
    onPreferenceChange: (value: 'light' | 'dark' | 'system') => void;
    onDeleteClass: (id: string) => void;
    onConfirmDeleteClass: () => Promise<void>;
    onDismissDeleteClassErrorSheet: () => void;
    onOpenDesignSystem?: () => void;
  }) => {
    (globalThis as {__settingsScreenProps?: typeof props}).__settingsScreenProps = props;
    const React = require('react');
    const {Text} = require('react-native');
    return React.createElement(
      Text,
      null,
      `${props.preference}-${props.lastSync ?? 'none'}-${props.classPendingDeletion?.observationsCount ?? 0}-${props.deleteClassErrorVisible}-${props.appIcon}`,
    );
  },
}));

describe('SettingsScreen (container)', () => {
  const renderContainer = async () => {
    renderWithProviders(<SettingsScreenContainer />);

    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetLastSync.mockResolvedValue('2026-05-07T10:30:00.000Z');
    mockGetItem.mockResolvedValue(null);
    mockSetItem.mockResolvedValue(undefined);
    mockTouchLastSync.mockResolvedValue('2026-05-09T14:40:00.000Z');
    mockDeleteClass.mockResolvedValue(undefined);
    mockDeleteObservation.mockResolvedValue(undefined);
    mockGetCurrentAppIcon.mockResolvedValue('default');
    mockSetAppIcon.mockResolvedValue(undefined);
    // @ts-expect-error test-only bridge
    delete globalThis.__settingsScreenProps;
  });

  it('should load the last sync and expose handlers to the view', async () => {
    await renderContainer();

    expect(screen.getByText('system-2026-05-07T10:30:00.000Z-0-false-default')).toBeOnTheScreen();

    const props = (globalThis as {__settingsScreenProps?: {
      onPreferenceChange: (value: 'light' | 'dark' | 'system') => void;
      onDeleteClass: (id: string) => void;
      onConfirmDeleteClass: () => Promise<void>;
      onDismissDeleteClassErrorSheet: () => void;
      onBack: () => void;
      onAppIconChange: (value: 'default' | 'second_option') => Promise<void>;
      onOpenDesignSystem?: () => void;
    }}).__settingsScreenProps!;

    act(() => {
      props.onPreferenceChange('dark');
    });

    expect(mockSetPreference).toHaveBeenCalledWith('dark');
    expect(screen.getByText('system-2026-05-07T10:30:00.000Z-0-false-default')).toBeOnTheScreen();

    await act(async () => {
      await props.onAppIconChange('second_option');
    });

    expect(mockSetAppIcon).toHaveBeenCalledWith('second_option');
    expect(mockSetItem).toHaveBeenCalledWith('app-icon', 'second_option');
    expect(screen.getByText('system-2026-05-07T10:30:00.000Z-0-false-second_option')).toBeOnTheScreen();

    act(() => {
      props.onBack();
    });

    expect(mockGoBack).toHaveBeenCalledTimes(1);

    act(() => {
      props.onOpenDesignSystem?.();
    });

    expect(mockNavigate).toHaveBeenCalledWith('DesignSystem');
  });

  it('should open the delete class sheet and delete its observations before the class', async () => {
    await renderContainer();

    let props = (globalThis as {__settingsScreenProps?: {
      classPendingDeletion: {id: string; name: string; observationsCount: number} | null;
      deleteClassErrorVisible: boolean;
      onDeleteClass: (id: string) => void;
      onConfirmDeleteClass: () => Promise<void>;
      onDismissDeleteClassErrorSheet: () => void;
    }}).__settingsScreenProps!;

    act(() => {
      props.onDeleteClass('class-1');
    });

    props = (globalThis as {__settingsScreenProps?: typeof props}).__settingsScreenProps!;

    expect(props.classPendingDeletion).toEqual({
      id: 'class-1',
      name: '5º Ano A',
      observationsCount: 2,
    });
    expect(screen.getByText('system-2026-05-07T10:30:00.000Z-2-false-default')).toBeOnTheScreen();

    await act(async () => {
      await props.onConfirmDeleteClass();
    });

    expect(mockDeleteObservation).toHaveBeenCalledTimes(2);
    expect(mockDeleteObservation).toHaveBeenNthCalledWith(1, 'obs-1');
    expect(mockDeleteObservation).toHaveBeenNthCalledWith(2, 'obs-2');
    expect(mockDeleteClass).toHaveBeenCalledWith('class-1');
    expect(mockTouchLastSync).toHaveBeenCalledTimes(1);
  });

  it('should expose the delete class error sheet when cascade deletion fails', async () => {
    mockDeleteObservation.mockRejectedValueOnce(new Error('delete failed'));

    await renderContainer();

    let props = (globalThis as {__settingsScreenProps?: {
      deleteClassErrorVisible: boolean;
      onDeleteClass: (id: string) => void;
      onConfirmDeleteClass: () => Promise<void>;
      onDismissDeleteClassErrorSheet: () => void;
    }}).__settingsScreenProps!;

    act(() => {
      props.onDeleteClass('class-1');
    });

    props = (globalThis as {__settingsScreenProps?: typeof props}).__settingsScreenProps!;

    await act(async () => {
      await props.onConfirmDeleteClass();
    });

    props = (globalThis as {__settingsScreenProps?: typeof props}).__settingsScreenProps!;

    expect(props.deleteClassErrorVisible).toBe(true);
    expect(screen.getByText('system-2026-05-07T10:30:00.000Z-0-true-default')).toBeOnTheScreen();

    act(() => {
      props.onDismissDeleteClassErrorSheet();
    });

    props = (globalThis as {__settingsScreenProps?: typeof props}).__settingsScreenProps!;

    expect(props.deleteClassErrorVisible).toBe(false);
  });

  it('should prefer the stored app icon when available', async () => {
    mockGetItem.mockResolvedValueOnce('second_option');

    await renderContainer();

    expect(mockGetCurrentAppIcon).not.toHaveBeenCalled();
    expect(screen.getByText('system-2026-05-07T10:30:00.000Z-0-false-second_option')).toBeOnTheScreen();
  });

  it('should fall back to the native icon when there is no stored preference', async () => {
    mockGetItem.mockResolvedValueOnce(null);
    mockGetCurrentAppIcon.mockResolvedValueOnce('second_option');

    await renderContainer();

    expect(mockGetCurrentAppIcon).toHaveBeenCalledTimes(1);
    expect(mockSetItem).toHaveBeenCalledWith('app-icon', 'second_option');
    expect(screen.getByText('system-2026-05-07T10:30:00.000Z-0-false-second_option')).toBeOnTheScreen();
  });

  it('should keep the default app icon when native lookup fails', async () => {
    mockGetItem.mockResolvedValueOnce(null);
    mockGetCurrentAppIcon.mockRejectedValueOnce(new Error('native unavailable'));

    await renderContainer();

    expect(screen.getByText('system-2026-05-07T10:30:00.000Z-0-false-default')).toBeOnTheScreen();
  });
});
