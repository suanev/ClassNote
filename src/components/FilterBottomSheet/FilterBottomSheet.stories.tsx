import React, {useState} from 'react';
import {View} from 'react-native';
import type {Meta, StoryObj} from '@storybook/react';

import {DocNote} from '../../../.storybook/DocNote';
import {Button} from '@components/Button';
import {ClassShift} from '../../types/classes';
import {ObservationSortOrder} from '@store/observations/slice';
import {FilterBottomSheet} from './FilterBottomSheet';

const MOCK_CLASSES = [
  {id: 'c1', name: '5º Ano A', shift: 'Manhã' as ClassShift},
  {id: 'c2', name: '5º Ano B', shift: 'Manhã' as ClassShift},
  {id: 'c3', name: '6º Ano A', shift: 'Tarde' as ClassShift},
  {id: 'c4', name: '9º Ano B', shift: 'Noite' as ClassShift},
];

const noop = () => {};

const DefaultFilterBottomSheetStory = () => {
  const [open, setOpen] = useState(false);
  const [shift, setShift] = useState<ClassShift | null>(null);
  const [cls, setCls] = useState<string | null>(null);
  const [favs, setFavs] = useState(false);
  const [sort, setSort] = useState<ObservationSortOrder>('recent-first');

  return (
    <View style={{padding: 24}}>
      <Button variant="secondary" icon="sliders" onPress={() => setOpen(true)}>
        Filtros
      </Button>
      <FilterBottomSheet
        isOpen={open}
        filterByShift={shift}
        filterByClass={cls}
        filterByFavorites={favs}
        availableClasses={MOCK_CLASSES}
        sortOrder={sort}
        onClose={() => setOpen(false)}
        onReset={() => {
          setShift(null);
          setCls(null);
          setFavs(false);
          setSort('recent-first');
        }}
        onSelectShift={setShift}
        onSelectClass={setCls}
        onToggleFavorites={() => setFavs(f => !f)}
        onSelectSortOrder={setSort}
      />
    </View>
  );
};

const ActiveFiltersBottomSheetStory = () => {
  const [open, setOpen] = useState(false);
  const [shift, setShift] = useState<ClassShift | null>('Manhã');
  const [cls, setCls] = useState<string | null>('c1');
  const [favs, setFavs] = useState(true);
  const [sort, setSort] = useState<ObservationSortOrder>('favorites-first');

  return (
    <View style={{padding: 24}}>
      <Button variant="secondary" icon="sliders" onPress={() => setOpen(true)}>
        Filtros ativos (3)
      </Button>
      <FilterBottomSheet
        isOpen={open}
        filterByShift={shift}
        filterByClass={cls}
        filterByFavorites={favs}
        availableClasses={MOCK_CLASSES}
        sortOrder={sort}
        onClose={() => setOpen(false)}
        onReset={() => {
          setShift(null);
          setCls(null);
          setFavs(false);
          setSort('recent-first');
        }}
        onSelectShift={setShift}
        onSelectClass={setCls}
        onToggleFavorites={() => setFavs(f => !f)}
        onSelectSortOrder={setSort}
      />
    </View>
  );
};

const LongClassListFilterBottomSheetStory = () => {
  const [open, setOpen] = useState(true);
  return (
    <FilterBottomSheet
      isOpen={open}
      onClose={() => setOpen(false)}
      onReset={() => {}}
      filterByShift="Tarde"
      filterByClass="c4"
      filterByFavorites
      sortOrder="favorites-first"
      onSelectShift={() => {}}
      onSelectClass={() => {}}
      onToggleFavorites={() => {}}
      onSelectSortOrder={() => {}}
      availableClasses={[
        {id: 'c1', name: '2º Ano A', shift: 'Manhã'},
        {id: 'c2', name: '2º Ano B', shift: 'Manhã'},
        {id: 'c3', name: '5º Ano A', shift: 'Tarde'},
        {id: 'c4', name: 'Turma de Projeto Interdisciplinar', shift: 'Tarde'},
        {id: 'c5', name: '7º Ano C', shift: 'Noite'},
        {id: 'c6', name: 'Laboratório de Leitura', shift: 'Outro'},
      ]}
    />
  );
};

const meta = {
  title: 'Components/FilterBottomSheet',
  component: FilterBottomSheet,
  parameters: {
    docs: {
      description: {
        component:
          'Sheet de filtros da lista de observações. Contém quatro seções: Turno (chips), Turma (chips filtrados pelo turno selecionado), Favoritas (toggle chip) e Ordenação (radio buttons). O botão "Limpar filtros" reaparece quando há algum filtro ativo.',
      },
    },
  },
  args: {
    isOpen: false,
    filterByShift: null,
    filterByClass: null,
    filterByFavorites: false,
    availableClasses: MOCK_CLASSES,
    sortOrder: 'recent-first',
    onClose: noop,
    onReset: noop,
    onSelectShift: noop,
    onSelectClass: noop,
    onToggleFavorites: noop,
    onSelectSortOrder: noop,
  },
} satisfies Meta<typeof FilterBottomSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Docs: Story = {
  args: {
    isOpen: false,
    filterByShift: null,
    filterByClass: null,
    filterByFavorites: false,
    availableClasses: [],
    sortOrder: 'recent-first',
    onClose: () => {},
    onReset: () => {},
    onSelectShift: () => {},
    onSelectClass: () => {},
    onToggleFavorites: () => {},
    onSelectSortOrder: () => {},
  },
  render: () => (
    <DocNote
      title="FilterBottomSheet"
      description="Sheet de filtros da home de observações. Ele combina filtros independentes com ordenação, então precisa cobrir interações mistas."
      notes={[
        'O usuário pode aplicar um, dois ou três filtros ao mesmo tempo.',
        'A ação de reset fica no header, não no rodapé.',
        'Vale sempre conferir se turmas longas continuam usáveis em wrap.',
      ]}
      props={[
        {name: 'filterByShift', type: 'ClassShift | null', description: 'Turno selecionado.'},
        {name: 'filterByClass', type: 'string | null', description: 'ID da turma selecionada.'},
        {name: 'filterByFavorites', type: 'boolean', description: 'Filtro de favoritas.'},
        {name: 'availableClasses', type: 'SchoolClass[]', required: true, description: 'Turmas disponíveis para filtrar.'},
        {name: 'sortOrder', type: 'ObservationSortOrder', required: true, description: 'Ordenação atual.'},
      ]}
    />
  ),
};

export const Default: Story = {
  render: () => <DefaultFilterBottomSheetStory />,
};

export const WithActiveFilters: Story = {
  render: () => <ActiveFiltersBottomSheetStory />,
};

export const LongClassList: Story = {
  render: () => <LongClassListFilterBottomSheetStory />,
};
