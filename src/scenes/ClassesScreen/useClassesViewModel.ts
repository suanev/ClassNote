import {useMemo, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {useClassesQuery} from '@hooks/useClasses';
import {useObservationsQuery} from '@hooks/useObservations';
import {ClassesStackParamList} from '@navigation/types';
import {ClassItem, SegmentOption} from './ClassesScreen';

type Navigation = StackNavigationProp<ClassesStackParamList>;

function isToday(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

function isThisWeek(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  const msInWeek = 7 * 24 * 60 * 60 * 1000;
  return now.getTime() - d.getTime() <= msInWeek;
}

export type ClassesViewModel = {
  selectedSegment: SegmentOption;
  onSelectSegment: (segment: SegmentOption) => void;
  summary: {totalClasses: number; totalStudents: number};
  classes: ClassItem[];
  onPressClass: (classId: string, className: string) => void;
};

export function useClassesViewModel(): ClassesViewModel {
  const navigation = useNavigation<Navigation>();
  const [selectedSegment, setSelectedSegment] = useState<SegmentOption>('Hoje');
  const classesQuery = useClassesQuery();
  const observationsQuery = useObservationsQuery();

  const classes = useMemo<ClassItem[]>(() => {
    const observations = observationsQuery.data ?? [];
    const inPeriod = selectedSegment === 'Hoje' ? isToday : isThisWeek;

    return (classesQuery.data ?? []).map(item => {
      const classObs = observations
        .filter(o => o.className === item.name)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );

      const periodObs = classObs.filter(o => inPeriod(o.createdAt));

      return {
        id: item.id,
        name: item.name,
        shift: item.shift,
        students: item.students,
        observationCount: classObs.length,
        lastObservation: classObs[0]?.text ?? null,
        hasActivityInPeriod: periodObs.length > 0,
      };
    });
  }, [classesQuery.data, observationsQuery.data, selectedSegment]);

  const summary = useMemo(
    () => ({
      totalClasses: classes.length,
      totalStudents: classes.reduce((sum, item) => sum + item.students, 0),
    }),
    [classes],
  );

  const handlePressClass = (classId: string, className: string) => {
    navigation.navigate('ClassDetail', {classId, className});
  };

  return {
    selectedSegment,
    onSelectSegment: setSelectedSegment,
    summary,
    classes,
    onPressClass: handlePressClass,
  };
}
