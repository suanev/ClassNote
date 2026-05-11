import React from 'react';
import {fireEvent, screen} from '@testing-library/react-native';

import {renderWithProviders} from '@test-utils';
import {FilterBottomSheet} from '../FilterBottomSheet';

const mockClasses = [
  {id: 'c1', name: '5º Á', shift: 'Manhã' as const},
  {id: 'c2', name: '6º B', shift: 'Tarde' as const},
  {id: 'c3', name: '8º D', shift: 'Noite' as const},
];

const baseProps = {
  filterByShift: null as null,
  filterByClass: null as null,
  filterByFavorites: false,
  availableClasses: mockClasses,
  isOpen: true,
  sortOrder: 'recent-first' as const,
  onClose: jest.fn(),
  onReset: jest.fn(),
  onSelectShift: jest.fn(),
  onSelectClass: jest.fn(),
  onToggleFavorites: jest.fn(),
  onSelectSortOrder: jest.fn(),
};

describe('FilterBottomSheet', () => {
  it('should render class chips and trigger independent selection', () => {
    const onSelectClass = jest.fn();
    const onToggleFavorites = jest.fn();
    const onReset = jest.fn();
    const onSelectSortOrder = jest.fn();
    const onClose = jest.fn();

    renderWithProviders(
      <FilterBottomSheet
        {...baseProps}
        onSelectClass={onSelectClass}
        onToggleFavorites={onToggleFavorites}
        onReset={onReset}
        onSelectSortOrder={onSelectSortOrder}
        onClose={onClose}
      />,
    );

    expect(screen.getByText('Filtros')).toBeOnTheScreen();
    expect(screen.getByText('Todas')).toBeOnTheScreen();
    expect(screen.getByText('5º Á')).toBeOnTheScreen();
    expect(screen.getByText('6º B')).toBeOnTheScreen();
    expect(screen.getByText('8º D')).toBeOnTheScreen();
    expect(screen.getByText('Somente favoritas')).toBeOnTheScreen();

    fireEvent.press(screen.getByText('8º D'));
    fireEvent.press(screen.getByText('Somente favoritas'));
    fireEvent.press(screen.getByText('Limpar filtros'));
    fireEvent.press(screen.getByText('Mais antigas primeiro'));
    fireEvent.press(screen.getAllByTestId('bottom-sheet-dismiss')[0]);

    expect(onSelectClass).toHaveBeenCalledWith('c3');
    expect(onToggleFavorites).toHaveBeenCalledTimes(1);
    expect(onReset).toHaveBeenCalledTimes(1);
    expect(onSelectSortOrder).toHaveBeenCalledWith('old-first');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should deselect a class when pressing the active chip', () => {
    const onSelectClass = jest.fn();

    renderWithProviders(
      <FilterBottomSheet
        {...baseProps}
        filterByClass="c1"
        onSelectClass={onSelectClass}
      />,
    );

    fireEvent.press(screen.getByText('5º Á'));
    expect(onSelectClass).toHaveBeenCalledWith(null);
  });

  it('should select a shift and expose normalized test ids for accented labels', () => {
    const onSelectShift = jest.fn();

    renderWithProviders(
      <FilterBottomSheet
        {...baseProps}
        onSelectShift={onSelectShift}
      />,
    );

    fireEvent.press(screen.getByTestId('shift-filter-manha'));

    expect(onSelectShift).toHaveBeenCalledWith('Manhã');
    expect(screen.getByTestId('class-filter-5-a')).toBeOnTheScreen();
  });

  it('should reset to all classes when pressing the "Todas" chip', () => {
    const onSelectClass = jest.fn();

    renderWithProviders(
      <FilterBottomSheet
        {...baseProps}
        filterByClass="c2"
        onSelectClass={onSelectClass}
      />,
    );

    fireEvent.press(screen.getByText('Todas'));
    expect(onSelectClass).toHaveBeenCalledWith(null);
  });

  it('should not render when the sheet is closed', () => {
    renderWithProviders(
      <FilterBottomSheet
        {...baseProps}
        filterByFavorites
        isOpen={false}
        sortOrder="favorites-first"
      />,
    );

    expect(screen.queryByText('Filtros')).not.toBeOnTheScreen();
  });

  it('should render the filter content inside a scroll container for long class lists', () => {
    renderWithProviders(
      <FilterBottomSheet
        {...baseProps}
        availableClasses={Array.from({length: 20}, (_, index) => ({
          id: `class-${index + 1}`,
          name: `Turma ${index + 1}`,
          shift: 'Tarde' as const,
        }))}
      />,
    );

    expect(screen.getByTestId('filter-bottom-sheet-scroll')).toBeOnTheScreen();
    expect(screen.getByText('Turma 20')).toBeOnTheScreen();
  });
});
