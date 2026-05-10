import React from 'react';
import {Text} from 'react-native';
import {fireEvent, screen} from '@testing-library/react-native';

import {renderWithProviders} from '@test-utils';
import {Card} from '../Card';

describe('Card', () => {
  it('should render its children', () => {
    renderWithProviders(
      <Card variant="elevated" padding={20}>
        <Text>Test card</Text>
      </Card>,
    );

    expect(screen.getByText('Test card')).toBeOnTheScreen();
  });

  it('should render with default variant when no variant is provided', () => {
    renderWithProviders(
      <Card>
        <Text>Default card</Text>
      </Card>,
    );

    expect(screen.getByText('Default card')).toBeOnTheScreen();
  });

  it('should render as pressable and trigger onPress when provided', () => {
    const onPress = jest.fn();

    renderWithProviders(
      <Card onPress={onPress}>
        <Text>Pressable card</Text>
      </Card>,
    );

    fireEvent.press(screen.getByText('Pressable card'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
