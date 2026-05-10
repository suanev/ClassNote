import React from 'react';
import {View} from 'react-native';
import type {Meta, StoryObj} from '@storybook/react';

import {DocNote} from '../../../.storybook/DocNote';
import {ErrorBoundary} from './ErrorBoundary';

const ThrowError = () => {
  throw new Error('Erro simulado para Storybook');
};

const meta = {
  title: 'Components/ErrorBoundary',
  component: ErrorBoundary,
  parameters: {
    docs: {
      description: {
        component:
          'Class component que captura exceções em qualquer filho e exibe um fallback com botão "Tentar novamente" em vez de quebrar a tela inteira. Reporta o erro ao `monitoring` (Sentry) via `componentDidCatch`. O botão de retry chama `setState({hasError: false})`, permitindo nova tentativa sem reiniciar o app.',
      },
    },
  },
  args: {
    children: null,
  },
  decorators: [
    Story => (
      <View style={{flex: 1, padding: 24}}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof ErrorBoundary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ErrorState: Story = {
  render: () => (
    <ErrorBoundary>
      <ThrowError />
    </ErrorBoundary>
  ),
};

export const WithChildren: Story = {
  render: () => (
    <ErrorBoundary>
      <View style={{padding: 16}}>
        {/* Nenhum erro — renderiza o conteúdo normalmente */}
      </View>
    </ErrorBoundary>
  ),
};
