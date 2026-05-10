import React from 'react';
import {View} from 'react-native';
import type {Meta, StoryObj} from '@storybook/react';
import {DocNote} from '../../../.storybook/DocNote';

import {Hint} from './Hint';

const meta = {
  title: 'Components/Hint',
  component: Hint,
  parameters: {
    docs: {
      description: {
        component:
          'Texto auxiliar curto exibido abaixo de controles de formulário ou seletores. Usa a cor `textMuted` e tamanho `xs` do tema.',
      },
    },
  },
  argTypes: {
    children: {description: 'Texto do hint', control: {type: 'text'}},
    testID: {description: 'ID para testes automatizados', control: {type: 'text'}},
  },
  args: {
    children: 'Preferência salva localmente.',
  },
  decorators: [
    (Story: React.ComponentType) => (
      <View style={{padding: 24}}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof Hint>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Docs: Story = {
  render: () => (
    <DocNote
      title="Hint"
      description="Texto auxiliar discreto usado para contextualizar controles e ajustes sem competir com o conteúdo principal."
      notes={[
        'Aparece logo abaixo de seletores, segmented controls e áreas de configuração.',
        'Precisa continuar legível no dark mode porque costuma carregar orientações importantes.',
        'Funciona melhor com 1 ou 2 linhas curtas, mas deve tolerar textos mais longos sem quebrar layout.',
      ]}
      props={[
        {
          name: 'children',
          type: 'ReactNode',
          required: true,
          description: 'Texto auxiliar exibido abaixo do controle.',
        },
        {
          name: 'testID',
          type: 'string',
          description: 'Identificador opcional para testes automatizados.',
        },
      ]}
    />
  ),
};

export const Default: Story = {};

export const LongText: Story = {
  args: {
    children:
      'O sistema vai exibir um alerta e reiniciar o app para aplicar o ícone — isso é normal.',
  },
};

export const BelowControl: Story = {
  render: () => (
    <View style={{padding: 24, gap: 10}}>
      <View
        style={{
          minHeight: 44,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: '#CFC8B3',
          justifyContent: 'center',
          paddingHorizontal: 14,
        }}
      />
      <Hint>
        Preferência salva localmente e aplicada na próxima abertura completa do app.
      </Hint>
    </View>
  ),
};
