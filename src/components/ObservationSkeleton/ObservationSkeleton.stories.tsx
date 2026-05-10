import React from 'react';
import {View} from 'react-native';
import type {Meta, StoryObj} from '@storybook/react';
import {DocNote} from '../../../.storybook/DocNote';

import {ObservationSkeleton} from './ObservationSkeleton';

const meta = {
  title: 'Components/ObservationSkeleton',
  component: ObservationSkeleton,
  parameters: {
    docs: {
      description: {
        component:
          'Estado de carregamento completo da tela de observações. Espelha fielmente o layout real: header com título e botões, linha de chips de filtro, e três cards com o mesmo esqueleto do `ObservationListItem` (nome, meta, texto × 2, separador dashed, tempo mono). Substitui spinners globais para evitar layout shift.',
      },
    },
  },
} satisfies Meta<typeof ObservationSkeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Docs: Story = {
  render: () => (
    <DocNote
      title="ObservationSkeleton"
      description="Estado de carregamento completo da tela de observações. A ideia é preservar estrutura e ritmo visual da tela real para evitar layout shift."
      notes={[
        'Replica header, chips de filtro, cards e FAB desabilitado.',
        'É um skeleton de tela, não só de item isolado.',
        'Vale revisar sempre que a home de observações mudar de hierarquia visual.',
      ]}
      props={[
        {
          name: 'Sem props públicas',
          type: 'n/a',
          description: 'O componente representa um estado visual fixo da tela.',
        },
      ]}
    />
  ),
};

export const Default: Story = {};

export const EmbeddedInScreen: Story = {
  render: () => (
    <View style={{flex: 1, minHeight: 720}}>
      <ObservationSkeleton />
    </View>
  ),
};
