import React from 'react';
import {Text} from 'react-native';
import {fireEvent, screen} from '@testing-library/react-native';

import {renderWithProviders} from '@test-utils';
import {ErrorBoundary} from '../ErrorBoundary';
import {monitoring} from '@services/monitoring';

jest.mock('@services/monitoring', () => ({
  monitoring: {
    logError: jest.fn(),
  },
}));

describe('ErrorBoundary', () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('should render the fallback and recover after retry', () => {
    let shouldThrow = true;

    const ProblemChild = () => {
      if (shouldThrow) {
        throw new Error('boom');
      }

      return <Text>Recovered</Text>;
    };

    renderWithProviders(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Algo deu errado')).toBeOnTheScreen();
    expect(monitoring.logError).toHaveBeenCalled();

    shouldThrow = false;
    fireEvent.press(screen.getByText('Tentar novamente'));

    expect(screen.getByText('Recovered')).toBeOnTheScreen();
  });

  it('should log an empty component stack when none is available', () => {
    const instance = new ErrorBoundary({children: <Text>Healthy child</Text>});
    instance.componentDidCatch(new Error('boom'), {} as React.ErrorInfo);

    expect(monitoring.logError).toHaveBeenCalledWith(expect.any(Error), {
      component_stack: '',
    });
  });
});
