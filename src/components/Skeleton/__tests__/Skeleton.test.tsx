import React from 'react';
import {Text} from 'react-native';
import {screen} from '@testing-library/react-native';

import {renderWithProviders} from '@test-utils';
import {Skeleton} from '../Skeleton';

describe('Skeleton', () => {
  it('should render its children inside the animated block', () => {
    renderWithProviders(
      <Skeleton height={20} width={80} radius={12}>
        <Text>Loading content</Text>
      </Skeleton>,
    );

    expect(screen.getByText('Loading content')).toBeOnTheScreen();
  });

  it('should use the default width when width is not provided', () => {
    renderWithProviders(
      <Skeleton height={24}>
        <Text>Default skeleton width</Text>
      </Skeleton>,
    );

    expect(screen.getByText('Default skeleton width')).toBeOnTheScreen();
  });
});
