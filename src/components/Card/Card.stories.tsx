import React from 'react';
import {Text, View} from 'react-native';
import type {Meta, StoryObj} from '@storybook/react';

import {DocNote} from '../../../.storybook/DocNote';
import {Card} from './Card';

const Placeholder = () => (
  <Text style={{padding: 16, color: '#555'}}>Conteúdo do card</Text>
);

const meta = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    docs: {
      description: {
        component:
          'Contêiner com borda de 1 px (`border`) e border-radius 8 ("Notebook"). Sem sombra por padrão — a elevação visual vem da borda sutil sobre o fundo papel. A variante `elevated` adiciona uma sombra leve. Aceita `onPress` para comportamento clicável (opacidade 0.7 ao pressionar).',
      },
    },
  },
  argTypes: {
    variant: {
      description: '`default` = somente borda; `elevated` = borda + sombra.',
      control: {type: 'select'},
      options: ['default', 'elevated'],
    },
    padding: {
      description: 'Padding interno em pixels. Usa `spacing[4]` (16) do tema quando omitido.',
      control: {type: 'range', min: 0, max: 32, step: 4},
    },
  },
  args: {
    variant: 'default',
  },
  decorators: [
    Story => (
      <View style={{padding: 24, gap: 12}}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Docs: Story = {
  render: () => (
    <DocNote
      title="Card"
      description='Contêiner "Notebook" com borda de 1 px e border-radius 8. Sem sombra por padrão — a separação visual vem da borda sutil sobre o fundo papel. Clicável quando onPress é fornecido (opacidade 0.7).'
      notes={[
        'default: somente borda border (1 px, #E5DFCE)',
        'elevated: borda + sombra leve para conteúdo destacado',
        'onPress opcional: envolve com Pressable e aplica opacity 0.7 ao pressionar',
      ]}
      props={[
        {name: 'variant', type: "'default' | 'elevated'", description: 'Estilo visual do card.'},
        {name: 'padding', type: 'number', description: 'Padding interno. Padrão: spacing[4] (16 px).'},
        {name: 'onPress', type: '() => void', description: 'Torna o card clicável com feedback de opacidade.'},
      ]}
    />
  ),
};

export const Default: Story = {
  render: args => (
    <Card {...args}>
      <Placeholder />
    </Card>
  ),
};

export const Elevated: Story = {
  args: {variant: 'elevated'},
  render: args => (
    <Card {...args}>
      <Placeholder />
    </Card>
  ),
};

export const WithCustomPadding: Story = {
  args: {padding: 24},
  render: args => (
    <Card {...args}>
      <Text style={{color: '#555'}}>Card com padding customizado</Text>
    </Card>
  ),
};
