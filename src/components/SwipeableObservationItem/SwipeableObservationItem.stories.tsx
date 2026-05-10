import React, {useState} from 'react';
import {View} from 'react-native';
import type {Meta, StoryObj} from '@storybook/react';

import {DocNote} from '../../../.storybook/DocNote';
import {SwipeableObservationItem} from './SwipeableObservationItem';

const noop = () => {};

const MultipleSwipeableItemsStory = () => {
  const [items, setItems] = useState([
    {id: '1', student: 'Ana Clara', className: '5º Ano A', shift: 'Manhã', isFavorite: true,  text: 'Excelente desempenho na redação.', relativeTime: 'há 1 h'},
    {id: '2', student: 'Pedro Alves', className: '5º Ano A', shift: 'Manhã', isFavorite: false, text: 'Teve dificuldade com frações.', relativeTime: 'há 3 h'},
    {id: '3', student: 'Lucas Martins', className: '6º Ano B', shift: 'Tarde', isFavorite: false, text: 'Faltou sem justificativa.', relativeTime: 'ontem'},
  ]);

  return (
    <View style={{padding: 16, gap: 0}}>
      {items.map(item => (
        <SwipeableObservationItem
          key={item.id}
          {...item}
          onPress={noop}
          onDelete={id => setItems(prev => prev.filter(i => i.id !== id))}
          onToggleFavorite={noop}
        />
      ))}
    </View>
  );
};

const meta = {
  title: 'Components/SwipeableObservationItem',
  component: SwipeableObservationItem,
  parameters: {
    docs: {
      description: {
        component:
          'Wrapper de gesto em volta do `ObservationListItem`. Deslizar para a esquerda revela o botão de exclusão (vermelho, ícone de lixeira). Ao soltar além do threshold de 64 px ou pressionar o botão, dispara `onDelete`. Usa `react-native-gesture-handler` e `Reanimated` para animações de entrada/saída e layout transition.',
      },
    },
  },
  argTypes: {
    student: {control: {type: 'text'}},
    className: {control: {type: 'text'}},
    shift: {
      control: {type: 'select'},
      options: [undefined, 'Manhã', 'Tarde', 'Noite', 'Outro'],
    },
    isFavorite: {control: {type: 'boolean'}},
    isDeleting: {
      description: 'Reduz opacidade enquanto a exclusão otimista está pendente.',
      control: {type: 'boolean'},
    },
    onPress: {action: 'pressed'},
    onDelete: {action: 'deleted'},
    onToggleFavorite: {action: 'favorite toggled'},
  },
  args: {
    id: 'obs-1',
    student: 'Beatriz Souza',
    className: '7º Ano A',
    shift: 'Tarde',
    relativeTime: 'há 2 h',
    text: 'Participou ativamente da discussão sobre o texto literário. Fez perguntas relevantes e contribuiu com interpretações originais.',
    isFavorite: false,
    isDeleting: false,
    onPress: noop,
    onDelete: noop,
    onToggleFavorite: noop,
  },
  decorators: [
    Story => (
      <View style={{padding: 16}}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof SwipeableObservationItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Docs: Story = {
  render: () => (
    <DocNote
      title="SwipeableObservationItem"
      description="Item da lista com gesto de swipe para exclusão rápida, mantendo o mesmo conteúdo e favorito do card normal."
      notes={[
        'Precisa continuar claro mesmo quando a ação destrutiva ainda não foi confirmada pelo servidor.',
        'O gesto deve conviver bem com listas longas e animações de remoção.',
        'É importante cobrir favorito, deleting e múltiplos itens em sequência.',
      ]}
      props={[
        {name: 'id', type: 'string', required: true, description: 'ID da observação.'},
        {name: 'student', type: 'string', required: true, description: 'Nome do aluno.'},
        {name: 'className', type: 'string', required: true, description: 'Nome da turma.'},
        {name: 'shift', type: 'string', description: 'Turno da turma.'},
        {name: 'isFavorite', type: 'boolean', description: 'Estado de favorito.'},
        {name: 'isDeleting', type: 'boolean', description: 'Indica remoção pendente.'},
      ]}
    />
  ),
};

export const Default: Story = {};

export const Favorited: Story = {
  args: {isFavorite: true},
};

export const Deleting: Story = {
  args: {isDeleting: true},
};

export const MultipleItems: Story = {
  render: () => <MultipleSwipeableItemsStory />,
};

export const LongTextDeleting: Story = {
  args: {
    isDeleting: true,
    text:
      'Observação longa para validar se o gesto de swipe, a opacidade de exclusão e a composição do card continuam estáveis mesmo com bastante conteúdo textual.',
  },
};
