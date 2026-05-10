import React from 'react';
import {View} from 'react-native';
import type {Meta, StoryObj} from '@storybook/react';

import {DocNote} from '../../../.storybook/DocNote';
import {IconButton} from './IconButton';

const noop = () => {};

const meta = {
  title: 'Components/IconButton',
  component: IconButton,
  parameters: {
    docs: {
      description: {
        component:
          'Botão de ícone 40×40 sem fundo visível. Usado no header da tela de observações para engrenagem (Settings) e filtros. Suporta um badge numérico para indicar filtros ativos.',
      },
    },
  },
  argTypes: {
    icon: {
      description: 'Nome do ícone Feather.',
      control: {type: 'text'},
    },
    iconLibrary: {
      description: 'Biblioteca do ícone.',
      control: {type: 'radio'},
      options: ['feather', 'material-community'],
    },
    badgeCount: {
      description:
        'Número exibido no badge vermelho no canto superior direito. Omitir ou zero oculta o badge.',
      control: {type: 'number'},
    },
    onPress: {action: 'pressed'},
  },
  args: {
    icon: 'settings',
    onPress: noop,
  },
  decorators: [
    Story => (
      <View style={{padding: 24, flexDirection: 'row', gap: 8, alignItems: 'center'}}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Docs: Story = {
  render: () => (
    <DocNote
      title="IconButton"
      description="Botão de ícone 40×40 sem fundo, usado no header. Suporta badge numérico para filtros ativos. Ícone em textMutedStrong."
      notes={[
        'Badge aparece quando badgeCount > 0, oculto quando undefined ou 0',
        'Badge exibe "9+" para valores acima de 9',
        'hitSlop de 8 px para área de toque mais confortável',
      ]}
      props={[
        {name: 'icon', type: 'string', required: true, description: 'Nome do ícone Feather.'},
        {name: 'onPress', type: '() => void', required: true, description: 'Callback de clique.'},
        {name: 'badgeCount', type: 'number', description: 'Número no badge. Omitir ou 0 oculta o badge.'},
        {name: 'accessibilityLabel', type: 'string', description: 'Label para leitores de tela.'},
      ]}
    />
  ),
};

export const Settings: Story = {
  args: {icon: 'settings', accessibilityLabel: 'Abrir configurações'},
};

export const Filters: Story = {
  args: {
    icon: 'filter-variant',
    iconLibrary: 'material-community',
    accessibilityLabel: 'Abrir filtros',
  },
};

export const WithBadge: Story = {
  args: {
    icon: 'filter-variant',
    iconLibrary: 'material-community',
    badgeCount: 2,
    accessibilityLabel: 'Filtros — 2 ativos',
  },
};

export const BadgeOverflow: Story = {
  args: {
    icon: 'filter-variant',
    iconLibrary: 'material-community',
    badgeCount: 12,
    accessibilityLabel: 'Filtros — muitos ativos',
  },
};

export const AllIcons: Story = {
  render: () => (
    <View style={{padding: 24, flexDirection: 'row', gap: 8, flexWrap: 'wrap'}}>
      <IconButton icon="settings" onPress={noop} accessibilityLabel="settings" />
      <IconButton
        icon="filter-variant"
        iconLibrary="material-community"
        onPress={noop}
        accessibilityLabel="filtros"
      />
      <IconButton
        icon="filter-variant"
        iconLibrary="material-community"
        badgeCount={3}
        onPress={noop}
        accessibilityLabel="filtros ativos"
      />
      <IconButton icon="chevron-left" onPress={noop} accessibilityLabel="voltar" />
    </View>
  ),
};
