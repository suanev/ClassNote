import {useCallback, useMemo, useState} from 'react';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useDispatch} from 'react-redux';

import {useClassesQuery, useCreateClassMutation} from '@hooks/useClasses';
import {
  useCreateObservationMutation,
  useDeleteObservationMutation,
  useObservationsQuery,
  useUpdateObservationMutation,
} from '@hooks/useObservations';
import {monitoring, Events} from '@services/monitoring';
import {RootStackParamList} from '@navigation/types';
import {SchoolClass} from '../../types/classes';
import {
  ObservationDraft,
  ObservationUpsertPayload,
} from '../../types/observations';
import {showObservationErrorToast} from '@store/observations/slice';
import {AppDispatch} from '@store/index';
import {isNetworkError} from '@utils/network';

type Navigation = StackNavigationProp<RootStackParamList>;
type ObservationFormRoute = RouteProp<RootStackParamList, 'ObservationForm'>;

export type ObservationFormViewModel = {
  mode: 'create' | 'edit';
  student: string;
  className: string;
  classId: string;
  text: string;
  classes: SchoolClass[];
  isFavorite: boolean;
  isLoading: boolean;
  isDeleting: boolean;
  isRouteLoading: boolean;
  isCreatingClass: boolean;
  canSave: boolean;
  onBackPress: () => void;
  onChangeStudent: (value: string) => void;
  onSelectClass: (id: string) => void;
  onChangeText: (value: string) => void;
  onToggleFavorite: () => void;
  onCreateClass: (name: string, shift: SchoolClass['shift']) => void;
  onSave: () => void;
  onDelete?: () => void;
};

export function useObservationFormViewModel(): ObservationFormViewModel {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<Navigation>();
  const route = useRoute<ObservationFormRoute>();
  const {mode} = route.params;
  const observationId = mode === 'edit' ? route.params.observationId : null;

  const observationsQuery = useObservationsQuery();
  const classesQuery = useClassesQuery();

  const classes: SchoolClass[] = useMemo(
    () => classesQuery.data ?? [],
    [classesQuery.data],
  );

  const existingObservation = useMemo(
    () =>
      (observationsQuery.data ?? []).find(item => item.id === observationId) ??
      null,
    [observationId, observationsQuery.data],
  );

  const initialClassId = useMemo(() => {
    if (existingObservation?.classId) return existingObservation.classId;
    if (existingObservation?.className) {
      return classes.find(c => c.name === existingObservation.className)?.id ?? '';
    }
    return classes[0]?.id ?? '';
  }, [existingObservation, classes]);

  const [student, setStudent] = useState(existingObservation?.student ?? '');
  const [classId, setClassId] = useState<string>(initialClassId);
  const [text, setText] = useState(existingObservation?.text ?? '');
  const [favorite, setFavorite] = useState(existingObservation?.favorite ?? false);

  const selectedClassId = classId || classes[0]?.id || '';
  const selectedClass = classes.find(c => c.id === selectedClassId);
  const selectedClassName = selectedClass?.name ?? '';
  const normalizedStudent = student.trim();
  const normalizedText = text.trim();
  const canSave = Boolean(normalizedStudent && normalizedText && selectedClassName);

  const navigateToObservationsHome = useCallback(() => {
    navigation.popToTop();
    navigation.navigate('ObservationsHome');
  }, [navigation]);

  const createClassMutation = useCreateClassMutation({
    onSuccess: newClass => {
      // Auto-select newly created class
      setClassId(newClass.id);
    },
    onError: error => {
      monitoring.logError(error, {action: 'create_class'});
    },
  });

  const createMutation = useCreateObservationMutation({
    onSuccess: () => {
      monitoring.logEvent(Events.OBSERVATION_CREATED);
      monitoring.breadcrumb('observation_created');
      navigation.goBack();
    },
    onError: error => {
      if (isNetworkError(error)) {
        monitoring.breadcrumb('observation_created_offline');
        navigation.goBack();
        return;
      }
      monitoring.logError(error, {action: 'create_observation'});
      dispatch(showObservationErrorToast('Não foi possível criar a observação.'));
    },
  });

  const updateMutation = useUpdateObservationMutation({
    onSuccess: () => {
      monitoring.logEvent(Events.OBSERVATION_EDITED);
      monitoring.breadcrumb('observation_edited');
      navigation.goBack();
    },
    onError: error => {
      monitoring.logError(error, {action: 'edit_observation'});
      dispatch(
        showObservationErrorToast('Não foi possível atualizar a observação.'),
      );
    },
  });

  const deleteMutation = useDeleteObservationMutation({
    onSuccess: () => {
      monitoring.logEvent(Events.OBSERVATION_DELETED);
      monitoring.breadcrumb('observation_deleted_from_form');
      navigateToObservationsHome();
    },
    onError: error => {
      if (isNetworkError(error)) {
        monitoring.breadcrumb('observation_deleted_offline_from_form');
        navigateToObservationsHome();
        return;
      }
      monitoring.logError(error, {action: 'delete_observation_form'});
      dispatch(showObservationErrorToast('Não foi possível apagar a observação.'));
    },
  });

  const handleCreateClass = useCallback(
    (name: string, shift: SchoolClass['shift']) => {
      createClassMutation.mutate({name, shift});
    },
    [createClassMutation],
  );

  const handleSave = useCallback(() => {
    if (!canSave) {
      return;
    }

    const draft: ObservationDraft = {
      student: normalizedStudent,
      className: selectedClassName,
      classId: selectedClassId || undefined,
      text: normalizedText,
    };

    if (mode === 'edit' && existingObservation) {
      const payload: ObservationUpsertPayload = {
        ...draft,
        favorite,
      };
      updateMutation.mutate({
        id: existingObservation.id,
        payload: {
          ...payload,
          updatedAt: new Date().toISOString(),
        },
      });
      return;
    }

    const now = new Date().toISOString();
    createMutation.mutate({
      ...draft,
      createdAt: now,
      updatedAt: now,
      favorite,
    });
  }, [
    createMutation,
    existingObservation,
    favorite,
    mode,
    canSave,
    selectedClassId,
    selectedClassName,
    normalizedStudent,
    normalizedText,
    updateMutation,
  ]);

  return {
    mode,
    student,
    className: selectedClassName,
    classId: selectedClassId,
    text,
    classes,
    isFavorite: favorite,
    isLoading: createMutation.isPending || updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isRouteLoading: mode === 'edit' && observationsQuery.isLoading,
    isCreatingClass: createClassMutation.isPending,
    canSave,
    onBackPress: () => navigation.goBack(),
    onChangeStudent: setStudent,
    onSelectClass: setClassId,
    onChangeText: setText,
    onToggleFavorite: () => setFavorite(prev => !prev),
    onCreateClass: handleCreateClass,
    onSave: handleSave,
    onDelete:
      mode === 'edit' && existingObservation
        ? () => deleteMutation.mutate(existingObservation.id)
        : undefined,
  };
}
