import React from 'react';
import {View} from 'react-native';
import type {Meta, StoryObj} from '@storybook/react';

import {DocNote} from '../../../.storybook/DocNote';
import {Button} from './Button';

const noop = () => {};

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    docs: {
      description: {
        component:
          'Botão principal do design system. Altura 48 px, Geist 15/500, border-radius 6. Cinco variantes semânticas: `primary` (ação principal), `secondary` (ação secundária com borda), `ghost` (sem borda, ação terciária), `danger` (destructive com borda), `dangerSolid` (destructive preenchido para confirmações). Suporta ícone Feather à esquerda, estado de loading (spinner substitui label) e disabled (opacidade 0.5).',
      },
    },
  },
  argTypes: {
    variant: {
      description: 'Hierarquia visual do botão.',
      control: {type: 'select'},
      options: ['primary', 'secondary', 'ghost', 'danger', 'dangerSolid'],
    },
    children: {description: 'Texto do botão.', control: {type: 'text'}},
    icon: {description: 'Nome do ícone Feather exibido à esquerda do texto.', control: {type: 'text'}},
    loading: {description: 'Exibe spinner e desabilita interação.', control: {type: 'boolean'}},
    disabled: {description: 'Opacidade 0.5, sem interação.', control: {type: 'boolean'}},
  },
  args: {
    children: 'Botão',
    variant: 'primary',
    onPress: noop,
    disabled: false,
    loading: false,
  },
  decorators: [
    Story => (
      <View style={{padding: 24, alignItems: 'flex-start', gap: 12}}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Docs: Story = {
  render: () => (
    <DocNote
      title="Button"
      description="Botão principal do design system. Altura 48 px, Geist 15/500, border-radius 6. Cinco variantes semânticas para diferentes hierarquias de ação."
      notes={[
        'loading: spinner substitui o label — o botão mantém o tamanho e fica não-interativo',
        'disabled: opacidade 0.5, sem clique',
        'icon: ícone Feather à esquerda do texto (qualquer nome válido do Feather)',
        'Aliases aceitos: fill → primary, outline → secondary, text → ghost',
      ]}
      props={[
        {name: 'variant', type: "'primary' | 'secondary' | 'ghost' | 'danger' | 'dangerSolid'", description: 'Hierarquia visual. primary = ação principal; secondary = ação com borda; ghost = sem borda; danger = destructive com borda; dangerSolid = destructive preenchido.'},
        {name: 'children', type: 'ReactNode', required: true, description: 'Conteúdo do botão (normalmente texto).'},
        {name: 'icon', type: 'string', description: 'Nome do ícone Feather exibido à esquerda.'},
        {name: 'loading', type: 'boolean', description: 'Exibe spinner e bloqueia interação.'},
        {name: 'disabled', type: 'boolean', description: 'Opacidade 0.5 e sem clique.'},
        {name: 'onPress', type: '() => void', required: true, description: 'Callback de clique.'},
      ]}
    />
  ),
};

export const Primary: Story = {
  args: {children: 'Salvar observação', variant: 'primary', onPress: noop},
};

export const Secondary: Story = {
  args: {children: 'Filtros', variant: 'secondary', icon: 'sliders', onPress: noop},
};

export const Ghost: Story = {
  args: {children: 'Cancelar', variant: 'ghost', onPress: noop},
};

export const Danger: Story = {
  args: {children: 'Apagar', variant: 'danger', onPress: noop},
};

export const DangerSolid: Story = {
  args: {children: 'Confirmar exclusão', variant: 'dangerSolid', onPress: noop},
};

export const WithIcon: Story = {
  args: {children: 'Nova observação', icon: 'plus', variant: 'primary', onPress: noop},
};

export const Loading: Story = {
  args: {children: 'Salvando...', loading: true, onPress: noop},
};

export const Disabled: Story = {
  args: {children: 'Indisponível', disabled: true, onPress: noop},
};
