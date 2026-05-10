import React from 'react';
import {screen} from '@testing-library/react-native';

import {renderWithProviders} from '@test-utils';
import {Badge} from '../Badge';

describe('Badge', () => {
  it('should render the badge label', () => {
    renderWithProviders(<Badge variant="success">Sincronizado</Badge>);

    expect(screen.getByText('Sincronizado')).toBeOnTheScreen();
  });

  it('should render with default variant when none is provided', () => {
    renderWithProviders(<Badge>Pendente</Badge>);

    expect(screen.getByText('Pendente')).toBeOnTheScreen();
  });
});
