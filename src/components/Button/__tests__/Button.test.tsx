import React from 'react';
import {fireEvent, screen} from '@testing-library/react-native';

import {renderWithProviders} from '@test-utils';
import {Button} from '../Button';

describe('Button', () => {
  it('should render and trigger the press handler', () => {
    const onPress = jest.fn();

    renderWithProviders(
      <Button icon="tune" minWidth={120} onPress={onPress} variant="secondary">
        Filtros
      </Button>,
    );

    fireEvent.press(screen.getByText('Filtros'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('should render in loading state without crashing', () => {
    renderWithProviders(
      <Button onPress={jest.fn()} loading>
        Salvando
      </Button>,
    );

    expect(screen.getByText('Salvando')).toBeOnTheScreen();
  });

  it('should keep the label visible while loading with an icon', () => {
    renderWithProviders(
      <Button onPress={jest.fn()} loading icon="save" variant="dangerSolid">
        Excluindo
      </Button>,
    );

    expect(screen.getByText('Excluindo')).toBeOnTheScreen();
  });

  it('should render danger variant with label', () => {
    const onPress = jest.fn();

    renderWithProviders(
      <Button onPress={onPress} variant="danger">
        Apagar
      </Button>,
    );

    expect(screen.getByText('Apagar')).toBeOnTheScreen();
    fireEvent.press(screen.getByText('Apagar'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('should render icon-only and trigger press via testID', () => {
    const onPress = jest.fn();

    renderWithProviders(
      <Button
        onPress={onPress}
        variant="danger"
        icon="trash-2"
        testID="delete-btn"
      />,
    );

    fireEvent.press(screen.getByTestId('delete-btn'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('should render icon-only loading button without a text label', () => {
    renderWithProviders(
      <Button
        onPress={jest.fn()}
        variant="dangerStrong"
        icon="trash-2"
        loading
        testID="loading-icon-btn"
      />,
    );

    expect(screen.getByTestId('loading-icon-btn')).toBeDisabled();
  });
});
