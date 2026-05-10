import React from 'react';
import {fireEvent, screen} from '@testing-library/react-native';

import {renderWithProviders} from '@test-utils';
import {NetworkToast} from '../NetworkToast';

jest.mock('@constants/environment', () => ({
  isDev: true,
}));

describe('NetworkToast', () => {
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
});
