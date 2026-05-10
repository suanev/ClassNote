import React from 'react';
import {fireEvent, screen} from '@testing-library/react-native';
import ReactTestRenderer, {act} from 'react-test-renderer';
import {ThemeProvider} from 'styled-components/native';

import {renderWithProviders} from '@test-utils';
import {FAB} from '../FAB';
import {theme} from '../../../theme';

describe('FAB', () => {
  it('renders and fires onPress', () => {
    const onPress = jest.fn();
    renderWithProviders(<FAB onPress={onPress} />);
    fireEvent.press(screen.getByTestId('floating-action-button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not fire onPress when disabled', () => {
    const onPress = jest.fn();
    renderWithProviders(<FAB onPress={onPress} disabled />);
    fireEvent.press(screen.getByTestId('floating-action-button'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('has correct accessibility role', () => {
    renderWithProviders(<FAB onPress={jest.fn()} />);
    expect(screen.getByRole('button')).toBeTruthy();
  });

  it('should reduce opacity when pressed', () => {
    let renderer!: ReactTestRenderer.ReactTestRenderer;

    act(() => {
      renderer = ReactTestRenderer.create(
        <ThemeProvider theme={theme}>
          <FAB onPress={jest.fn()} />
        </ThemeProvider>,
      );
    });

    const button = renderer.root.findByProps({testID: 'floating-action-button'});
    const pressedStyles: object[] = button.props.style({pressed: true});
    const idleStyles: object[] = button.props.style({pressed: false});

    const opacityPressed = pressedStyles.find(
      (s): s is {opacity: number} => s != null && typeof s === 'object' && 'opacity' in s,
    )?.opacity;
    const opacityIdle = idleStyles.find(
      (s): s is {opacity: number} => s != null && typeof s === 'object' && 'opacity' in s,
    )?.opacity;

    expect(opacityPressed).toBeLessThan(opacityIdle!);
  });
});
