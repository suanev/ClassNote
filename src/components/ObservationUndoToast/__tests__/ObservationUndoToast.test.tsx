import React from 'react';
import {fireEvent, screen} from '@testing-library/react-native';

import {renderWithProviders} from '@test-utils';
import {ObservationUndoToast} from '../ObservationUndoToast';

describe('ObservationUndoToast', () => {
  it('should render the action when a callback is provided', () => {
    const onAction = jest.fn();

    renderWithProviders(
      <ObservationUndoToast
        message="Observação apagada"
        actionLabel="Desfazer"
        onAction={onAction}
      />,
    );

    fireEvent.press(screen.getByText('Desfazer'));

    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it('should hide the action when no callback is provided', () => {
    renderWithProviders(<ObservationUndoToast message="Observação apagada" />);

    expect(screen.queryByText('Desfazer')).not.toBeOnTheScreen();
  });
});
