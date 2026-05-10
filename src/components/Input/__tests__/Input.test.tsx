import React from 'react';
import {fireEvent, screen} from '@testing-library/react-native';

import {renderWithProviders} from '@test-utils';
import {Input} from '../Input';

describe('Input', () => {
  it('should render the placeholder and trigger text changes', () => {
    const onChangeText = jest.fn();

    renderWithProviders(
      <Input
        icon="search"
        placeholder="Buscar turma ou aluno"
        value=""
        onChangeText={onChangeText}
      />,
    );

    const input = screen.getByPlaceholderText('Buscar turma ou aluno');
    fireEvent.changeText(input, 'Ana');

    expect(onChangeText).toHaveBeenCalledWith('Ana');
  });

  it('should forward testID and accessibilityLabel and handle focus transitions', () => {
    renderWithProviders(
      <Input
        placeholder="Nome do aluno"
        value=""
        testID="student-input"
        accessibilityLabel="Campo nome do aluno"
      />,
    );

    const input = screen.getByTestId('student-input');

    expect(screen.getByLabelText('Campo nome do aluno')).toBeOnTheScreen();

    fireEvent(input, 'focus');
    fireEvent(input, 'blur');
  });

  it('should support multiline input props without crashing', () => {
    renderWithProviders(
      <Input
        placeholder="Observação"
        value="Texto inicial"
        multiline
        numberOfLines={6}
        autoCapitalize="none"
      />,
    );

    expect(screen.getByDisplayValue('Texto inicial')).toBeOnTheScreen();
  });
});
