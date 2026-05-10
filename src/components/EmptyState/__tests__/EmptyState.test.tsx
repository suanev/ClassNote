import React from 'react';
import {fireEvent, screen} from '@testing-library/react-native';

import {renderWithProviders} from '@test-utils';
import {EmptyState} from '../EmptyState';

describe('EmptyState', () => {
  it('should render the action button when a callback is provided', () => {
    const onAction = jest.fn();

    renderWithProviders(
      <EmptyState
        title="Nada por aqui"
        description="Crie a primeira observação para começar."
        actionLabel="Criar observação"
        onAction={onAction}
      />,
    );

    fireEvent.press(screen.getByText('Criar observação'));

    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it('should hide the action button when no callback is provided', () => {
    renderWithProviders(
      <EmptyState title="Nada por aqui" description="Ainda sem observações." />,
    );

    expect(screen.queryByText('Criar observação')).not.toBeOnTheScreen();
  });
});
