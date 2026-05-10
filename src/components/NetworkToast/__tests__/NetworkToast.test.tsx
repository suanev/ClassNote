import React from 'react';
import {fireEvent, screen} from '@testing-library/react-native';

import {renderWithProviders} from '@test-utils';
import {NetworkToast} from '../NetworkToast';

const mockEnvironment = {isDev: true};
jest.mock('@constants/environment', () => ({
  get isDev() {
    return mockEnvironment.isDev;
  },
}));

describe('NetworkToast', () => {
  beforeEach(() => {
    mockEnvironment.isDev = true;
  });

  it('should render the offline message', () => {
    renderWithProviders(<NetworkToast status="offline" />);

    expect(
      screen.getByText(
        'Você está offline. Suas alterações continuam salvas no aparelho. No celular, a nuvem não sincroniza neste ambiente de desenvolvimento.',
      ),
    ).toBeOnTheScreen();
  });

  it('should render the restored message', () => {
    renderWithProviders(<NetworkToast status="restored" />);

    expect(
      screen.getByText(
        'Conexão restaurada. No celular, a nuvem não sincroniza neste ambiente de desenvolvimento.',
      ),
    ).toBeOnTheScreen();
  });

  it('should call onDismiss when the close button is pressed', () => {
    const onDismiss = jest.fn();
    renderWithProviders(<NetworkToast status="offline" onDismiss={onDismiss} />);

    fireEvent.press(screen.getByRole('button', {name: 'Fechar aviso'}));

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('should render the production restored message outside development', () => {
    mockEnvironment.isDev = false;

    renderWithProviders(<NetworkToast status="restored" />);

    expect(screen.getByText('Conexão restaurada. Sincronizando suas alterações...')).toBeOnTheScreen();

    mockEnvironment.isDev = true;
  });
});
