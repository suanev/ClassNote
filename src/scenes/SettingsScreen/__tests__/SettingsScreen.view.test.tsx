import React from 'react';
import {fireEvent, screen} from '@testing-library/react-native';

import {renderWithProviders} from '@test-utils';
import SettingsScreen from '../SettingsScreen';

const mockEnv = {ENV_LABEL: 'Desenvolvimento', isDev: true};
jest.mock('@constants/environment', () => ({
  get ENV_LABEL() { return mockEnv.ENV_LABEL; },
  get isDev() { return mockEnv.isDev; },
}));

describe('SettingsScreen (view)', () => {
  const baseProps = {
    preference: 'system' as const,
    lastSync: '2026-05-07T10:30:00.000Z',
    classes: [],
    classPendingDeletion: null,
    deleteClassErrorVisible: false,
    isDeletingClass: false,
    appIcon: 'default' as const,
    onBack: jest.fn(),
    onAppIconChange: jest.fn(),
    onPreferenceChange: jest.fn(),
    onDeleteClass: jest.fn(),
    onConfirmDeleteClass: jest.fn(),
    onDismissDeleteClassSheet: jest.fn(),
    onDismissDeleteClassErrorSheet: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the settings sections and version info', () => {
    renderWithProviders(<SettingsScreen {...baseProps} />);

    expect(screen.getByText('APARÊNCIA')).toBeOnTheScreen();
    expect(screen.getByText('DADOS')).toBeOnTheScreen();
    expect(screen.getByText('VERSÃO')).toBeOnTheScreen();
    expect(screen.getByText('ClassNotes')).toBeOnTheScreen();
  });

  it('should render classes and trigger class deletion from the list', () => {
    renderWithProviders(
      <SettingsScreen
        {...baseProps}
        classes={[
          {id: 'class-1', name: '5º Ano A', shift: 'Manhã'},
          {id: 'class-2', name: '6º Ano B', shift: 'Tarde'},
        ]}
      />,
    );

    expect(screen.getByText('5º Ano A')).toBeOnTheScreen();
    expect(screen.getByText('6º Ano B')).toBeOnTheScreen();

    fireEvent.press(screen.getByTestId('delete-class-6-ano-b'));

    expect(baseProps.onDeleteClass).toHaveBeenCalledWith('class-2');
  });

  it('should call onBack when pressing the header back button', () => {
    renderWithProviders(<SettingsScreen {...baseProps} />);

    fireEvent.press(screen.getByTestId('app-header-back-button'));

    expect(baseProps.onBack).toHaveBeenCalledTimes(1);
  });

  it('should trigger theme preference changes and clear action', () => {
    renderWithProviders(<SettingsScreen {...baseProps} />);

    fireEvent.press(screen.getByLabelText('Escuro'));
    fireEvent.press(screen.getByLabelText('Alternativo'));

    expect(baseProps.onPreferenceChange).toHaveBeenCalledWith('dark');
    expect(baseProps.onAppIconChange).toHaveBeenCalledWith('second_option');
  });

  it('should render the app icon hint text', () => {
    renderWithProviders(<SettingsScreen {...baseProps} />);
    expect(screen.getByTestId('app-icon-hint')).toBeOnTheScreen();
  });

  it('should render the development sync hint in development mode', () => {
    renderWithProviders(<SettingsScreen {...baseProps} />);

    expect(screen.getByTestId('dev-sync-hint')).toBeOnTheScreen();
  });

  it('should render the production environment label when IS_DEV is false', () => {
    mockEnv.ENV_LABEL = 'Produção';
    mockEnv.isDev = false;

    renderWithProviders(<SettingsScreen {...baseProps} />);

    expect(screen.getByText('Produção')).toBeOnTheScreen();

    mockEnv.ENV_LABEL = 'Desenvolvimento';
    mockEnv.isDev = true;
  });

  it('should trigger the design system action when available', () => {
    const onOpenDesignSystem = jest.fn();

    renderWithProviders(
      <SettingsScreen {...baseProps} onOpenDesignSystem={onOpenDesignSystem} />,
    );

    fireEvent.press(screen.getByTestId('open-design-system-button'));

    expect(onOpenDesignSystem).toHaveBeenCalledTimes(1);
  });

  it('should render the delete class bottom sheet with the observations impact', () => {
    renderWithProviders(
      <SettingsScreen
        {...baseProps}
        classPendingDeletion={{
          id: 'class-1',
          name: '5º Ano A',
          observationsCount: 3,
        }}
      />,
    );

    expect(screen.getByText('Excluir turma e observações?')).toBeOnTheScreen();
    expect(
      screen.getByText(
        'Na turma 5º Ano A existem 3 observações que também serão excluídas. Essa ação é permanente.',
      ),
    ).toBeOnTheScreen();
  });

  it('should trigger the delete class sheet actions', () => {
    renderWithProviders(
      <SettingsScreen
        {...baseProps}
        classPendingDeletion={{
          id: 'class-1',
          name: '5º Ano A',
          observationsCount: 1,
        }}
      />,
    );

    fireEvent.press(screen.getByTestId('cancel-delete-class-button'));
    fireEvent.press(screen.getByTestId('confirm-delete-class-button'));

    expect(baseProps.onDismissDeleteClassSheet).toHaveBeenCalledTimes(1);
    expect(baseProps.onConfirmDeleteClass).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Excluir')).toBeOnTheScreen();
  });

  it('should render the delete class error bottom sheet and dismiss it', () => {
    renderWithProviders(
      <SettingsScreen
        {...baseProps}
        deleteClassErrorVisible
      />,
    );

    expect(screen.getByText('Não foi possível apagar a turma')).toBeOnTheScreen();
    expect(screen.getByText('Tente novamente em instantes.')).toBeOnTheScreen();

    fireEvent.press(screen.getByTestId('delete-class-error-close-button'));

    expect(baseProps.onDismissDeleteClassErrorSheet).toHaveBeenCalledTimes(1);
  });
});
