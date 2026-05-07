import React, {useCallback, useMemo, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {ObservationsStackParamList} from '@navigation/types';
import {formatCalendarHeading, formatRelativeObservationTime} from '@utils/date';

import {ObservationsScreen as ObservationsScreenView} from './ObservationsScreen';

type ClassFilter = 'Todas' | '5º A' | '6º B' | '7º C';

type ObservationItem = {
  id: string;
  student: string;
  className: '5º A' | '6º B' | '7º C';
  text: string;
  createdAt: string;
  favorite: boolean;
};

const MOCK_OBSERVATIONS: ObservationItem[] = [
  {
    id: '1',
    student: 'Ana Silva',
    className: '5º A',
    text: 'Demonstrou liderança no trabalho em grupo e apoiou colegas com calma.',
    createdAt: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
    favorite: true,
  },
  {
    id: '2',
    student: 'Pedro Lima',
    className: '5º A',
    text: 'Precisou de reforço para manter o foco durante a atividade de matemática.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    favorite: false,
  },
  {
    id: '3',
    student: 'Júlia Costa',
    className: '6º B',
    text: 'Excelente clareza na apresentação oral, com boa argumentação e postura.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(),
    favorite: true,
  },
  {
    id: '4',
    student: 'Caio Martins',
    className: '6º B',
    text: 'Mostrou evolução na leitura em voz alta e participação mais confiante.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    favorite: false,
  },
  {
    id: '5',
    student: 'Mariana Alves',
    className: '7º C',
    text: 'Organizou bem as etapas da tarefa e ajudou a equipe a cumprir o prazo.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    favorite: false,
  },
  {
    id: '6',
    student: 'Rafael Souza',
    className: '7º C',
    text: 'Teve dificuldade inicial, mas persistiu e concluiu a atividade com autonomia.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    favorite: true,
  },
];

type Navigation = StackNavigationProp<ObservationsStackParamList>;

const ObservationsScreenContainer = () => {
  const navigation = useNavigation<Navigation>();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ClassFilter>('Todas');
  const [observations, setObservations] = useState(MOCK_OBSERVATIONS);

  const handleToggleFavorite = useCallback((id: string) => {
    setObservations(current =>
      current.map(item =>
        item.id === id ? {...item, favorite: !item.favorite} : item,
      ),
    );
  }, []);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 700);
  }, []);

  const classFilters = useMemo(
    () =>
      (['Todas', '5º A', '6º B', '7º C'] as const).map(filter => ({
        label:
          filter === 'Todas'
            ? `Todas · ${observations.length}`
            : filter,
        value: filter,
      })),
    [observations.length],
  );

  const filteredObservations = useMemo(() => {
    if (selectedClass === 'Todas') {
      return observations;
    }

    return observations.filter(item => item.className === selectedClass);
  }, [observations, selectedClass]);

  return (
    <ObservationsScreenView
      dateLabel={formatCalendarHeading(new Date())}
      greetingName="Profa. Marina"
      classFilters={classFilters}
      selectedClass={selectedClass}
      onSelectClass={setSelectedClass}
      observations={filteredObservations.map(item => ({
        ...item,
        relativeTime: formatRelativeObservationTime(item.createdAt),
      }))}
      isRefreshing={isRefreshing}
      onRefresh={handleRefresh}
      onToggleFavorite={handleToggleFavorite}
      onCreateObservation={() => navigation.navigate('ObservationForm')}
    />
  );
};

export {ObservationsScreenContainer as ObservationsScreen};
