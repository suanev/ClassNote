import React from 'react';
import {View} from 'react-native';
import type {Meta, StoryObj} from '@storybook/react';

import {DocNote} from '../../../.storybook/DocNote';
import {Badge} from './Badge';

const meta = {
  title: 'Components/Badge',
  component: Badge,
  parameters: {
    docs: {
      description: {
        component:
          'Etiqueta inline de status. Usada em contextos como estado de sincronização ou indicadores de turma. Três variantes: `default` (azul primário), `success` (verde), `neutral` (cinza). Tamanho fixo, não interativa.',
      },
    },
  },
  argTypes: {
    variant: {
      description: '`default` = primário; `success` = verde; `neutral` = cinza.',
      control: {type: 'select'},
      options: ['default', 'success', 'neutral'],
    },
    children: {
      description: 'Texto exibido dentro do badge.',
      control: {type: 'text'},
    },
  },
  args: {
    children: 'Badge',
    variant: 'default',
  },
  decorators: [
    Story => (
      <View style={{padding: 24, flexDirection: 'row', gap: 8, flexWrap: 'wrap'}}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Docs: Story = {
  render: () => (
    <DocNote
      title="Badge"
      description="Etiqueta inline de status. Pequena, não interativa, usada ao lado de textos para indicar estado de sincronização, turno ou destaque."
      notes={[
        'default: fundo primarySubtle, texto primary',
        'success: fundo successSubtle, texto success (verde)',
        'neutral: fundo surfaceAlt, texto textMuted (cinza)',
        'Não é clicável — para ações use Chip ou Button',
      ]}
      props={[
        {name: 'children', type: 'ReactNode', required: true, description: 'Texto exibido dentro do badge.'},
        {name: 'variant', type: "'default' | 'success' | 'neutral'", description: 'Estilo visual. Padrão: default.'},
      ]}
    />
  ),
};

export const Default: Story = {
  args: {children: 'Padrão', variant: 'default'},
};

export const Success: Story = {
  args: {children: 'Ativo', variant: 'success'},
};

export const Neutral: Story = {
  args: {children: 'Inativo', variant: 'neutral'},
};

export const AllVariants: Story = {
  render: () => (
    <View style={{flexDirection: 'row', gap: 8, padding: 24, flexWrap: 'wrap'}}>
      <Badge variant="default">Padrão</Badge>
      <Badge variant="success">Ativo</Badge>
      <Badge variant="neutral">Inativo</Badge>
    </View>
  ),
};
