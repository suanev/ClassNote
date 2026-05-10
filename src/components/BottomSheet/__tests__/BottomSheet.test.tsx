import React from 'react';
import {Text} from 'react-native';
import {fireEvent, screen} from '@testing-library/react-native';

import {renderWithProviders} from '@test-utils';
import {BottomSheet} from '../BottomSheet';
import {Button} from '../../Button';

describe('BottomSheet', () => {
  it('should render the title, children and close through the dismiss action', () => {
    const onClose = jest.fn();

    const {rerender} = renderWithProviders(
      <BottomSheet
        isOpen
        onClose={onClose}
        title="Filtros"
        headerAction={<Button onPress={jest.fn()}>Ação</Button>}>
        <Text>Conteúdo do filtro</Text>
      </BottomSheet>,
    );

    expect(screen.getByText('Filtros')).toBeOnTheScreen();
    expect(screen.getByText('Conteúdo do filtro')).toBeOnTheScreen();
    expect(screen.getByTestId('bottom-sheet-content')).toBeOnTheScreen();

    fireEvent.press(screen.getAllByTestId('bottom-sheet-dismiss')[0]);

    expect(onClose).toHaveBeenCalledTimes(1);

    rerender(
      <BottomSheet isOpen onClose={onClose}>
        <Text>Sem título</Text>
      </BottomSheet>,
    );

    expect(screen.getByText('Sem título')).toBeOnTheScreen();
    expect(screen.queryByText('Filtros')).not.toBeOnTheScreen();
  });

  it('should not render when closed', () => {
    renderWithProviders(
      <BottomSheet isOpen={false} onClose={jest.fn()} title="Filtros">
        <Text>Conteúdo</Text>
      </BottomSheet>,
    );

    expect(screen.queryByText('Filtros')).not.toBeOnTheScreen();
  });
});
