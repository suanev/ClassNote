import React from 'react';
import {View} from 'react-native';
import type {Meta, StoryObj} from '@storybook/react';

import {DocNote} from '../../../.storybook/DocNote';
import {ObservationUndoToast} from './ObservationUndoToast';

const noop = () => {};

const meta = {
  title: 'Components/ObservationUndoToast',
  component: ObservationUndoToast,
  parameters: {
    docs: {
      description: {
        component:
          'Toast invertido de desfazer exclusão. Aparece na parte inferior da tela por 4 s após o swipe-to-delete. Contém uma mensagem e um botão de ação "Desfazer" opcional. Usa `Portal` e animação `FadeInDown` do Reanimated.',
      },
    },
  },
  argTypes: {
    message: {
      description: 'Texto principal do toast.',
      control: {type: 'text'},
    },
    actionLabel: {
      description: 'Rótulo do botão de ação. `null` ou omitido oculta o botão.',
      control: {type: 'text'},
    },
    onAction: {action: 'action pressed'},
  },
  args: {
    message: 'Observação apagada.',
    actionLabel: 'Desfazer',
    onAction: noop,
  },
  decorators: [
    Story => (
      <View style={{height: 160}}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof ObservationUndoToast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Docs: Story = {
  render: () => (
    <DocNote
      title="ObservationUndoToast"
      description="Toast de confirmação com ação opcional de desfazer usado após exclusão de observações."
      notes={[
        'O botão de desfazer é opcional porque em alguns fluxos a ação pode ficar indisponível.',
        'O texto precisa tolerar singular e plural sem quebrar a hierarquia.',
        'Ele aparece sobre a interface, então convém validar contraste e largura máxima.',
      ]}
      props={[
        {name: 'message', type: 'string', required: true, description: 'Mensagem principal do toast.'},
        {name: 'actionLabel', type: 'string | null', description: 'Texto da ação opcional.'},
        {name: 'onAction', type: '() => void', description: 'Callback da ação de desfazer.'},
      ]}
    />
  ),
};

export const WithUndo: Story = {};

export const WithoutUndo: Story = {
  args: {actionLabel: null, onAction: undefined},
};

export const CustomMessage: Story = {
  args: {message: '3 observações apagadas.', actionLabel: 'Desfazer'},
};

export const LongMessage: Story = {
  args: {
    message:
      'As observações da turma 5º Ano A foram apagadas e podem ser restauradas por alguns instantes.',
    actionLabel: 'Desfazer',
  },
};
