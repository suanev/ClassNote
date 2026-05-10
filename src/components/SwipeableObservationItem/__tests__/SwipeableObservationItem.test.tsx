import React from 'react';
import {fireEvent, screen} from '@testing-library/react-native';

import {renderWithProviders} from '@test-utils';
import {SwipeableObservationItem} from '../SwipeableObservationItem';

describe('SwipeableObservationItem', () => {
  it('should trigger delete, edit and favorite actions', () => {
    const onDelete = jest.fn();
    const onPress = jest.fn();
    const onToggleFavorite = jest.fn();

    const {rerender} = renderWithProviders(
      <SwipeableObservationItem
        id="obs-1"
        student="Pedro Lima"
        className="6º B"
        relativeTime="ontem"
        text="Precisou de retomada das instruções."
        isFavorite={false}
        onPress={onPress}
        onDelete={onDelete}
        onToggleFavorite={onToggleFavorite}
      />,
    );

    fireEvent.press(screen.getByTestId('swipe-open-right'));
    fireEvent.press(screen.getByTestId('observation-card-obs-1'));
    fireEvent.press(screen.getByTestId('favorite-button-obs-1'));

    expect(onDelete).toHaveBeenCalledWith('obs-1');
    expect(onPress).toHaveBeenCalledTimes(1);
    expect(onToggleFavorite).toHaveBeenCalledTimes(1);

    rerender(
      <SwipeableObservationItem
        id="obs-1"
        student="Pedro Lima"
        className="6º B"
        relativeTime="ontem"
        text="Precisou de retomada das instruções."
        isFavorite={false}
        isDeleting
        onPress={onPress}
        onDelete={onDelete}
        onToggleFavorite={onToggleFavorite}
      />,
    );
  });

  it('should not delete when the swipe opens to the left', () => {
    const onDelete = jest.fn();

    renderWithProviders(
      <SwipeableObservationItem
        id="obs-2"
        student="Julia Costa"
        className="7º C"
        relativeTime="hoje"
        text="Excelente oralidade."
        isFavorite
        onPress={jest.fn()}
        onDelete={onDelete}
        onToggleFavorite={jest.fn()}
      />,
    );

    fireEvent.press(screen.getByTestId('swipe-open-left'));

    expect(onDelete).not.toHaveBeenCalled();
  });
});
