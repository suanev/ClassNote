import {useCallback, useMemo, useState} from 'react';
import {Alert} from 'react-native';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useDispatch} from 'react-redux';

import {useClassesQuery} from '@hooks/useClasses';
import {
  useCreateObservationMutation,
  useDeleteObservationMutation,
  useObservationsQuery,
  useUpdateObservationMutation,
} from '@hooks/useObservations';
import {monitoring, Events} from '@services/monitoring';
import {ObservationsStackParamList} from '@navigation/types';
import {
  ObservationClass,
  ObservationDraft,
  ObservationUpsertPayload,
} from '../../types/observations';
import {showObservationErrorToast} from '@store/observations/slice';
import {AppDispatch} from '@store/index';
import {isNetworkError} from '@utils/network';

type Navigation = StackNavigationProp<ObservationsStackParamList>;
type ObservationFormRoute = RouteProp<ObservationsStackParamList, 'ObservationForm'>;

export type ObservationFormViewModel = {
  mode: 'create' | 'edit';
  student: string;
  className: ObservationClass;
  text: string;
  classOptions: ObservationClass[];
  isFavorite: boolean;
  isLoading: boolean;
  isDeleting: boolean;
  isRouteLoading: boolean;
  onBackPress: () => void;
  onChangeStudent: (value: string) => void;
  onChangeClass: (value: ObservationClass) => void;
  onChangeText: (value: string) => void;
  onToggleFavorite: () => void;
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

  const classOptions = useMemo(
    () => (classesQuery.data ?? []).map(item => item.name),
    [classesQuery.data],
  );

  const existingObservation = useMemo(
    () =>
      (observationsQuery.data ?? []).find(item => item.id === observationId) ??
      null,
    [observationId, observationsQuery.data],
  );

  const [student, setStudent] = useState(existingObservation?.student ?? '');
  const [className, setClassName] = useState<ObservationClass>(
    existingObservation?.className ?? '',
  );
  const [text, setText] = useState(existingObservation?.text ?? '');
  const [favorite, setFavorite] = useState(existingObservation?.favorite ?? false);

  const selectedClassName = className || classOptions[0] || '';

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
      navigation.goBack();
    },
    onError: error => {
      monitoring.logError(error, {action: 'delete_observation_form'});
      dispatch(showObservationErrorToast('Não foi possível apagar a observação.'));
    },
  });

  const handleSave = useCallback(() => {
    const normalizedStudent = student.trim();
    const normalizedText = text.trim();

    if (!normalizedStudent || !normalizedText || !selectedClassName) {
      Alert.alert(
        'Campos obrigatórios',
        'Preencha o nome do aluno, a turma e a observação antes de salvar.',
      );
      return;
    }

    const draft: ObservationDraft = {
      student: normalizedStudent,
      className: selectedClassName,
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
    selectedClassName,
    student,
    text,
    updateMutation,
  ]);

  return {
    mode,
    student,
    className: selectedClassName,
    text,
    classOptions,
    isFavorite: favorite,
    isLoading: createMutation.isPending || updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isRouteLoading: mode === 'edit' && observationsQuery.isLoading,
    onBackPress: () => navigation.goBack(),
    onChangeStudent: setStudent,
    onChangeClass: setClassName,
    onChangeText: setText,
    onToggleFavorite: () => setFavorite(prev => !prev),
    onSave: handleSave,
    onDelete:
      mode === 'edit' && existingObservation
        ? () => deleteMutation.mutate(existingObservation.id)
        : undefined,
  };
}
