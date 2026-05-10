import React from 'react';
import {View} from 'react-native';
import type {Meta, StoryObj} from '@storybook/react';

import {DocNote} from '../../../.storybook/DocNote';
import {NetworkToast} from './NetworkToast';

const meta = {
  title: 'Components/NetworkToast',
  component: NetworkToast,
  parameters: {
    docs: {
      description: {
        component:
          'Banner que aparece no topo da tela para indicar status de conectividade. Exibe cor vermelha quando offline e verde quando a conexão é restaurada. Inclui botão de dismiss e usa animação FadeInDown do Reanimated.',
      },
    },
  },
  argTypes: {
    status: {
      description: 'Estado atual da conectividade.',
      control: {type: 'radio'},
      options: ['offline', 'restored'],
    },
  },
  decorators: [
    (Story: React.ComponentType) => (
      <View style={{height: 120}}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof NetworkToast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Docs: Story = {
  args: {
    status: 'offline',
  },
  render: () => (
    <DocNote
      title="NetworkToast"
      description="Toast temporário de conectividade usado no topo da tela para comunicar perda e restauração de rede."
      notes={[
        'Precisa ser legível sem competir com o conteúdo principal.',
        'Offline e restored têm mensagens longas e cores semânticas diferentes.',
        'Quando há dismiss, ele precisa continuar confortável para toque em telas pequenas.',
      ]}
      props={[
        {name: 'status', type: "'offline' | 'restored'", required: true, description: 'Tipo de mensagem exibida.'},
        {name: 'onDismiss', type: '() => void', description: 'Callback opcional para fechar o toast manualmente.'},
      ]}
    />
  ),
};

export const Offline: Story = {
  args: {
    status: 'offline',
  },
};

export const Restored: Story = {
  args: {
    status: 'restored',
  },
};

export const DismissibleOffline: Story = {
  args: {
    status: 'offline',
    onDismiss: () => {},
  },
};

export const DismissibleRestored: Story = {
  args: {
    status: 'restored',
    onDismiss: () => {},
  },
};
