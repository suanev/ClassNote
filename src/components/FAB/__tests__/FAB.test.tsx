import React from 'react';
import {fireEvent, screen} from '@testing-library/react-native';
import ReactTestRenderer, {act} from 'react-test-renderer';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ThemeProvider} from 'styled-components/native';

import {renderWithProviders} from '@test-utils';
import {FAB} from '../FAB';
import {theme} from '../../../theme';

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({children}: {children: React.ReactNode}) => children,
  SafeAreaView: ({children}: {children: React.ReactNode}) => children,
  useSafeAreaInsets: jest.fn(() => ({top: 0, bottom: 0, left: 0, right: 0})),
}));

describe('FAB', () => {
  beforeEach(() => {
    jest.mocked(useSafeAreaInsets).mockReturnValue({top: 0, bottom: 0, left: 0, right: 0});
  });

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

  it('should add bottom safe area inset to the FAB offset', () => {
    jest.mocked(useSafeAreaInsets).mockReturnValue({top: 0, bottom: 18, left: 0, right: 0});

    let renderer!: ReactTestRenderer.ReactTestRenderer;

    act(() => {
      renderer = ReactTestRenderer.create(
        <ThemeProvider theme={theme}>
          <FAB onPress={jest.fn()} bottom={28} />
        </ThemeProvider>,
      );
    });

    const container = renderer.root.findByProps({testID: 'floating-action-container'});
    expect(container.props.$bottom).toBe(46);
  });
});
