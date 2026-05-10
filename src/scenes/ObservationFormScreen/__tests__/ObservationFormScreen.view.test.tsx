import React from 'react';
import {fireEvent, screen} from '@testing-library/react-native';

import {renderWithProviders} from '@test-utils';
import ObservationFormScreen from '../ObservationFormScreen';

const mockClasses = [
  {id: 'c1', name: '5º Ano A', shift: 'Manhã' as const},
  {id: 'c2', name: '6º Ano B', shift: 'Tarde' as const},
  {id: 'c3', name: '7º Ano C', shift: 'Noite' as const},
];

const baseProps = {
  student: '',
  className: '5º Ano A',
  classId: 'c1',
  text: '',
  classes: mockClasses,
  isFavorite: false,
  isLoading: false,
  isDeleting: false,
  isCreatingClass: false,
  canSave: false,
  onBackPress: jest.fn(),
  onChangeStudent: jest.fn(),
  onSelectClass: jest.fn(),
  onChangeText: jest.fn(),
  onToggleFavorite: jest.fn(),
  onCreateClass: jest.fn(),
  onSave: jest.fn(),
};

describe('ObservationFormScreen (view)', () => {
  describe('create mode', () => {
    it('should render title and save button', () => {
      renderWithProviders(<ObservationFormScreen mode="create" {...baseProps} />);

      expect(screen.getByText('Nova observação')).toBeOnTheScreen();
      expect(screen.getByText('Salvar observação')).toBeOnTheScreen();
    });

    it('should call onSave when pressing save', () => {
      const onSave = jest.fn();
      renderWithProviders(
        <ObservationFormScreen mode="create" {...baseProps} canSave onSave={onSave} />,
      );

      fireEvent.press(screen.getByText('Salvar observação'));
      expect(onSave).toHaveBeenCalledTimes(1);
    });

    it('should keep save button disabled until required fields are filled', () => {
      renderWithProviders(<ObservationFormScreen mode="create" {...baseProps} />);

      expect(screen.getByTestId('save-observation-button')).toBeDisabled();
    });

    it('should call onBackPress when pressing back', () => {
      const onBackPress = jest.fn();
      renderWithProviders(
        <ObservationFormScreen mode="create" {...baseProps} onBackPress={onBackPress} />,
      );

      fireEvent.press(screen.getByTestId('app-header-back-button'));
      expect(onBackPress).toHaveBeenCalledTimes(1);
    });

    it('should not render favorite toggle in create mode', () => {
      renderWithProviders(<ObservationFormScreen mode="create" {...baseProps} />);
      expect(screen.queryByTestId('favorite-toggle')).not.toBeOnTheScreen();
    });

    it('should call onSelectClass when pressing a class chip', () => {
      const onSelectClass = jest.fn();
      renderWithProviders(
        <ObservationFormScreen mode="create" {...baseProps} onSelectClass={onSelectClass} />,
      );

      fireEvent.press(screen.getByTestId('select-class-6-ano-b'));
      expect(onSelectClass).toHaveBeenCalledWith('c2');
    });

    it('should show student input and call onChangeStudent', () => {
      const onChangeStudent = jest.fn();
      renderWithProviders(
        <ObservationFormScreen mode="create" {...baseProps} onChangeStudent={onChangeStudent} />,
      );

      fireEvent.changeText(screen.getByLabelText('Nome do aluno'), 'Pedro');
      expect(onChangeStudent).toHaveBeenCalledWith('Pedro');
    });

    it('should open the new class sheet and create a class', () => {
      const onCreateClass = jest.fn();
      renderWithProviders(
        <ObservationFormScreen mode="create" {...baseProps} onCreateClass={onCreateClass} />,
      );

      fireEvent.press(screen.getByTestId('add-class-chip'));
      expect(screen.getByTestId('new-class-name-input')).toBeOnTheScreen();

      fireEvent.changeText(screen.getByTestId('new-class-name-input'), 'Nova Turma E2E');
      fireEvent.press(screen.getByTestId('new-class-shift-tarde'));
      fireEvent.press(screen.getByTestId('create-class-confirm-button'));

      expect(onCreateClass).toHaveBeenCalledWith('Nova Turma E2E', 'Tarde');
    });

    it('should render unfavorite state correctly in edit mode', () => {
      renderWithProviders(
        <ObservationFormScreen mode="edit" {...baseProps} onDelete={jest.fn()} isFavorite={false} />,
      );
      expect(screen.getByTestId('favorite-toggle')).toBeOnTheScreen();
    });

    it('should render favorited state correctly in edit mode', () => {
      renderWithProviders(
        <ObservationFormScreen mode="edit" {...baseProps} onDelete={jest.fn()} isFavorite={true} />,
      );
      expect(screen.getByTestId('favorite-toggle')).toBeOnTheScreen();
    });
  });

  describe('edit mode', () => {
    const editProps = {
      ...baseProps,
      mode: 'edit' as const,
      student: 'João Silva',
      text: 'Participou ativamente.',
      canSave: true,
      onDelete: jest.fn(),
    };

    it('should render edit title and update button', () => {
      renderWithProviders(<ObservationFormScreen {...editProps} />);

      expect(screen.getByText('Editar observação')).toBeOnTheScreen();
      expect(screen.getByText('Atualizar observação')).toBeOnTheScreen();
    });

    it('should disable update button when required fields are missing', () => {
      renderWithProviders(
        <ObservationFormScreen {...editProps} canSave={false} />,
      );

      expect(screen.getByTestId('update-observation-button')).toBeDisabled();
    });

    it('should render delete button in edit mode', () => {
      renderWithProviders(<ObservationFormScreen {...editProps} />);

      expect(screen.getByTestId('delete-observation-button')).toBeOnTheScreen();
    });

    it('should call onToggleFavorite when pressing favorite in edit mode', () => {
      const onToggleFavorite = jest.fn();
      renderWithProviders(
        <ObservationFormScreen {...editProps} onToggleFavorite={onToggleFavorite} />,
      );

      fireEvent.press(screen.getByTestId('favorite-toggle'));
      expect(onToggleFavorite).toHaveBeenCalledTimes(1);
    });

    it('should call onDelete after confirming', () => {
      const onDelete = jest.fn();
      renderWithProviders(<ObservationFormScreen {...editProps} onDelete={onDelete} />);

      fireEvent.press(screen.getByTestId('delete-observation-button'));
      expect(screen.getByText('Apagar observação?')).toBeOnTheScreen();
      fireEvent.press(screen.getByText('Apagar'));
      expect(onDelete).toHaveBeenCalledTimes(1);
      expect(screen.getByText('Apagar observação?')).toBeOnTheScreen();
    });

    it('should dismiss delete sheet on cancel', () => {
      const onDelete = jest.fn();
      renderWithProviders(<ObservationFormScreen {...editProps} onDelete={onDelete} />);

      fireEvent.press(screen.getByTestId('delete-observation-button'));
      fireEvent.press(screen.getByText('Cancelar'));
      expect(onDelete).not.toHaveBeenCalled();
    });

    it('should show loading state on delete button while deleting', () => {
      renderWithProviders(<ObservationFormScreen {...editProps} isDeleting />);
      expect(screen.getByTestId('delete-observation-button')).toBeOnTheScreen();
    });

    it('should keep the delete sheet open and disable actions while deleting', () => {
      const onDelete = jest.fn();
      const {rerender} = renderWithProviders(
        <ObservationFormScreen {...editProps} onDelete={onDelete} />,
      );

      fireEvent.press(screen.getByTestId('delete-observation-button'));
      fireEvent.press(screen.getByTestId('confirm-delete-observation-button'));

      expect(onDelete).toHaveBeenCalledTimes(1);
      expect(screen.getByText('Apagar observação?')).toBeOnTheScreen();

      rerender(
        <ObservationFormScreen
          {...editProps}
          onDelete={onDelete}
          isDeleting
        />,
      );

      expect(screen.getByText('Apagar')).toBeOnTheScreen();
      expect(screen.getByTestId('cancel-delete-observation-button')).toBeDisabled();
      expect(screen.getByTestId('confirm-delete-observation-button')).toBeDisabled();
    });

    it('should not render delete button when onDelete is not provided', () => {
      renderWithProviders(
        <ObservationFormScreen
          {...editProps}
          onDelete={undefined}
        />,
      );
      expect(screen.queryByTestId('delete-observation-button')).not.toBeOnTheScreen();
    });
  });
});
