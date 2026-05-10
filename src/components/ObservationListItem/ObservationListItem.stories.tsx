import React, {useState} from 'react';
import {View} from 'react-native';
import type {Meta, StoryObj} from '@storybook/react';

import {DocNote} from '../../../.storybook/DocNote';
import {ObservationListItem} from './ObservationListItem';

const noop = () => {};

const meta = {
  title: 'Components/ObservationListItem',
  component: ObservationListItem,
  parameters: {
    docs: {
      description: {
        component:
          'Card de observação individual exibido na lista principal. Mostra nome do aluno (Newsreader), turma e turno, prévia do texto (2 linhas), separador dashed e tempo relativo em Geist Mono. O ícone de estrela alterna entre preenchido (favorito) e contorno (não favorito) via `MaterialCommunityIcons`.',
      },
    },
  },
  argTypes: {
    student: {description: 'Nome completo do aluno.', control: {type: 'text'}},
    className: {description: 'Nome da turma (ex: "5º Ano A").', control: {type: 'text'}},
    shift: {
      description: 'Turno da turma. Exibido após o nome como "Turma · Turno".',
      control: {type: 'select'},
      options: [undefined, 'Manhã', 'Tarde', 'Noite', 'Outro'],
    },
    relativeTime: {
      description: 'Tempo relativo (ex: "há 35 min"). Renderizado em Geist Mono.',
      control: {type: 'text'},
    },
    text: {description: 'Texto da observação. Truncado em 2 linhas.', control: {type: 'text'}},
    isFavorite: {description: 'Quando `true`, exibe estrela preenchida.', control: {type: 'boolean'}},
    isDisabled: {
      description: 'Opacidade reduzida durante exclusão otimista.',
      control: {type: 'boolean'},
    },
    onPress: {action: 'pressed'},
    onToggleFavorite: {action: 'favorite toggled'},
  },
  args: {
    id: 'obs-story-1',
    student: 'Ana Clara Ferreira',
    className: '5º Ano A',
    shift: 'Manhã',
    relativeTime: 'há 35 min',
    text: 'Demonstrou excelente raciocínio lógico na atividade de geometria. Conseguiu resolver os problemas de forma independente e ainda ajudou os colegas.',
    isFavorite: false,
    isDisabled: false,
    onPress: noop,
    onToggleFavorite: noop,
  },
  decorators: [
    Story => (
      <View style={{padding: 16, gap: 8}}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof ObservationListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Docs: Story = {
  render: () => (
    <DocNote
      title="ObservationListItem"
      description="Card de observação individual. Layout em 5 linhas: nome do aluno (Newsreader), turma · turno, prévia do texto (2 linhas), separador dashed, tempo relativo mono."
      notes={[
        'Estrela: MaterialCommunityIcons star (preenchida) vs star-outline — visível e acessível',
        'shift opcional: exibe "Turma · Turno" quando presente, só "Turma" quando ausente',
        'isDisabled: opacidade reduzida durante exclusão otimista pendente',
        'Memoizado — não re-renderiza se props não mudarem (comparação manual)',
      ]}
      props={[
        {name: 'student', type: 'string', required: true, description: 'Nome completo do aluno.'},
        {name: 'className', type: 'string', required: true, description: 'Nome da turma.'},
        {name: 'shift', type: 'string', description: 'Turno. Exibido como "Turma · Turno".'},
        {name: 'relativeTime', type: 'string', required: true, description: 'Tempo relativo em Geist Mono.'},
        {name: 'text', type: 'string', required: true, description: 'Texto da observação (truncado em 2 linhas).'},
        {name: 'isFavorite', type: 'boolean', required: true, description: 'Controla ícone preenchido vs contorno.'},
        {name: 'onToggleFavorite', type: '() => void', required: true, description: 'Callback do botão de estrela.'},
      ]}
    />
  ),
};

export const Default: Story = {};

export const Favorited: Story = {
  args: {isFavorite: true},
};

export const WithoutShift: Story = {
  args: {shift: undefined},
};

export const ShortText: Story = {
  args: {
    student: 'Marcos Oliveira',
    className: '6º Ano B',
    shift: 'Tarde',
    text: 'Faltou à aula.',
    relativeTime: 'há 2 dias',
  },
};

export const LongName: Story = {
  args: {
    student: 'Maria Eduarda dos Santos Rodrigues Albuquerque',
    className: '9º Ano A',
    shift: 'Noite',
    text: 'Apresentou o trabalho de história com muita propriedade e desenvoltura.',
    relativeTime: 'há 1 semana',
    isFavorite: true,
  },
};

export const Deleting: Story = {
  args: {isDisabled: true},
};

export const InteractiveFavorite: Story = {
  render: args => {
    const [fav, setFav] = useState(false);
    return (
      <View style={{padding: 16}}>
        <ObservationListItem {...args} isFavorite={fav} onToggleFavorite={() => setFav(f => !f)} />
      </View>
    );
  },
};
