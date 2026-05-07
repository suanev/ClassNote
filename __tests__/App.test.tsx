import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

jest.mock('../src/providers', () => ({
  __esModule: true,
  default: ({children}: {children: React.ReactNode}) => children,
}));

jest.mock('../src/navigation/RootNavigator', () => ({
  RootNavigator: () => null,
}));

import App from '../App';

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});
