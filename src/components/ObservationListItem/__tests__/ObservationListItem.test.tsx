import React from 'react';
import {fireEvent, screen} from '@testing-library/react-native';

import {renderWithProviders} from '@test-utils';
import {ObservationListItem} from '../ObservationListItem';

describe('ObservationListItem', () => {
  it('should render the card and trigger edit and favorite actions', () => {
    const onPress = jest.fn();
    const onToggleFavorite = jest.fn();

    const {rerender} = renderWithProviders(
      <ObservationListItem
        id="obs-1"
        student="Ana Silva"
        className="5º A"
        relativeTime="há 5 minutos"
        text="Demonstrou autonomia na atividade."
        isFavorite
        onPress={onPress}
        onToggleFavorite={onToggleFavorite}
      />,
    );

    fireEvent.press(screen.getByTestId('observation-card-obs-1'));
    fireEvent.press(screen.getByTestId('favorite-button-obs-1'));

    expect(screen.getByText('Ana Silva')).toBeOnTheScreen();
    expect(screen.getByText('5º A')).toBeOnTheScreen();
    expect(screen.getByText('há 5 minutos')).toBeOnTheScreen();
    expect(onPress).toHaveBeenCalledTimes(1);
    expect(onToggleFavorite).toHaveBeenCalledTimes(1);

    rerender(
      <ObservationListItem
        id="obs-1"
        student="Ana Silva"
        className="5º A"
        relativeTime="há 5 minutos"
        text="Demonstrou autonomia na atividade."
        isFavorite={false}
        onPress={onPress}
        onToggleFavorite={onToggleFavorite}
      />,
    );
  });
});
