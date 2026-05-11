import React from 'react';
import {View} from 'react-native';
import type {Meta, StoryObj} from '@storybook/react';

import {DocNote} from '../../../.storybook/DocNote';
import {EmptyState} from './EmptyState';

const baseEmptyTitle = 'Nenhuma observação por aqui';
const baseAction = 'Criar observação';

const meta = {
  title: 'Components/EmptyState',
  component: EmptyState,
  parameters: {
    docs: {
      description: {
        component:
          'Estado vazio centralizado na tela. Círculo de 140×140 com ícone de 56 px (stroke 1.4), título em Newsreader 18/500 e descrição em Geist 15. Botão de ação opcional (variante `secondary`). Usado na lista de observações vazia, sem resultados de filtro, e em outros estados zero-data.',
      },
    },
  },
  argTypes: {
    title: {description: 'Título principal em Newsreader.', control: {type: 'text'}},
    description: {description: 'Texto descritivo em Geist.', control: {type: 'text'}},
    actionLabel: {description: 'Rótulo do botão de ação. Omitir oculta o botão.', control: {type: 'text'}},
    icon: {description: 'Nome do ícone Feather exibido no círculo.', control: {type: 'text'}},
    onAction: {action: 'action pressed'},
  },
  args: {
    title: baseEmptyTitle,
    description:
      'Quando você registrar novas observações, elas vão aparecer aqui com destaque e contexto da turma.',
    actionLabel: baseAction,
  },
  decorators: [
    Story => (
      <View style={{padding: 24, flex: 1, justifyContent: 'center'}}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Docs: Story = {
  render: () => (
    <DocNote
      title="EmptyState"
      description="Estado vazio semântico usado em cenários diferentes: lista vazia, filtro sem resultado, erro e ausência de favoritos."
      notes={[
        'O texto muda bastante conforme o contexto, então a story precisa cobrir mais do que só o caso default.',
        'A ação é opcional e costuma levar para criar observação ou tentar novamente.',
        'Esse componente precisa continuar respirando bem com descrições longas no dark mode.',
      ]}
      props={[
        {name: 'title', type: 'string', required: true, description: 'Título principal do estado.'},
        {name: 'description', type: 'string', required: true, description: 'Explicação curta com contexto.'},
        {name: 'actionLabel', type: 'string', description: 'Rótulo opcional da ação principal.'},
        {name: 'icon', type: 'string', description: 'Nome do ícone Feather.'},
        {name: 'onAction', type: '() => void', description: 'Callback opcional da ação.'},
      ]}
    />
  ),
};

export const WithAction: Story = {};

export const WithoutAction: Story = {
  args: {
    actionLabel: undefined,
    onAction: undefined,
    title: 'Sem favoritos',
    description:
      'Quando você marcar observações com estrela, elas vão aparecer aqui para acesso mais rápido.',
  },
};

export const ErrorState: Story = {
  args: {
    title: 'Erro ao carregar',
    description:
      'Não foi possível buscar as observações. Verifique sua conexão e tente novamente.',
    actionLabel: 'Tentar novamente',
  },
};

export const OfflineState: Story = {
  args: {
    title: 'Sem conexão',
    description:
      'Você está offline. Quando houver dados salvos no aparelho, eles continuam aparecendo aqui. Se não houver nada salvo, a lista volta assim que a conexão for restaurada.',
    actionLabel: 'Tentar novamente',
    icon: 'wifi-off',
  },
};

export const ClassFilter: Story = {
  args: {
    title: 'Nenhuma observação por aqui',
    description:
      'Ainda não há observações para 5º Ano A. Você pode criar a primeira e começar o histórico dessa turma.',
    actionLabel: baseAction,
  },
};

export const FavoritesAndClassFilter: Story = {
  args: {
    title: 'Nenhuma favorita nesta turma',
    description:
      'Você filtrou 5º Ano A e favoritas ao mesmo tempo. Quando houver observações marcadas com estrela nessa turma, elas aparecerão aqui.',
    actionLabel: undefined,
    onAction: undefined,
    icon: 'star',
  },
};
