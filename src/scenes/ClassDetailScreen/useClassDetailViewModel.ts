import {useMemo} from 'react';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {useObservationsQuery} from '@hooks/useObservations';
import {useClassesQuery} from '@hooks/useClasses';
import {ClassesStackParamList} from '@navigation/types';
import {formatRelativeObservationTime} from '@utils/date';
import {ClassDetailObservation} from './ClassDetailScreen';

type Navigation = StackNavigationProp<ClassesStackParamList>;
type ClassDetailRoute = RouteProp<ClassesStackParamList, 'ClassDetail'>;

export type ClassDetailViewModel = {
  className: string;
  shift: string;
  students: number;
  observations: ClassDetailObservation[];
  onBack: () => void;
  onPressObservation: (id: string) => void;
};

export function useClassDetailViewModel(): ClassDetailViewModel {
  const navigation = useNavigation<Navigation>();
  const route = useRoute<ClassDetailRoute>();
  const {classId, className} = route.params;

  const classesQuery = useClassesQuery();
  const observationsQuery = useObservationsQuery();

  const classData = useMemo(
    () => (classesQuery.data ?? []).find(c => c.id === classId),
    [classesQuery.data, classId],
  );

  const observations = useMemo<ClassDetailObservation[]>(() => {
    return (observationsQuery.data ?? [])
      .filter(o => o.className === className)
      .map(o => ({
        id: o.id,
        student: o.student,
        text: o.text,
        relativeTime: formatRelativeObservationTime(o.createdAt),
        favorite: o.favorite,
      }));
  }, [observationsQuery.data, className]);

  const handlePressObservation = (id: string) => {
    navigation
      .getParent()
      ?.navigate('Observations', {
        screen: 'ObservationForm',
        params: {mode: 'edit', observationId: id},
      });
  };

  return {
    className,
    shift: classData?.shift ?? '',
    students: classData?.students ?? 0,
    observations,
    onBack: () => navigation.goBack(),
    onPressObservation: handlePressObservation,
  };
}
