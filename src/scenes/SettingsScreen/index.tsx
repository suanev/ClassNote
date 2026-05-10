import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { ThemePreference, useThemeContext } from '@theme/ThemeContext';
import {
  getItem,
  getLastSync,
  setItem,
  storageKeys,
  touchLastSync,
} from '@storage/index';
import { useClassesQuery } from '@hooks/useClasses';
import { useObservationsQuery } from '@hooks/useObservations';
import { RootStackParamList } from '@navigation/types';
import { isDev } from '@constants/environment';
import { deleteClass } from '@services/classes';
import { deleteObservation } from '@services/observations';
import SettingsScreen from './SettingsScreen';
import { appIconService, AppIconVariant } from '@services/appIcon';
import { queryKeys } from '@constants/queryKeys';
import { Observation } from '../../types/observations';
import { SchoolClass } from '../../types/classes';
import { queryClient } from '../../store/queryClient';

type Navigation = StackNavigationProp<RootStackParamList>;

const SettingsScreenContainer = () => {
  const navigation = useNavigation<Navigation>();
  const { preference, setPreference } = useThemeContext();
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [classPendingDeletionId, setClassPendingDeletionId] = useState<string | null>(null);
  const [isDeletingClass, setIsDeletingClass] = useState(false);
  const [deleteClassErrorVisible, setDeleteClassErrorVisible] = useState(false);
  const [appIcon, setAppIcon] = useState<AppIconVariant>('default');

  const classesQuery = useClassesQuery();
  const observationsQuery = useObservationsQuery();

  const classes = useMemo(() => classesQuery.data ?? [], [classesQuery.data]);
  const observations = useMemo(() => observationsQuery.data ?? [], [observationsQuery.data]);

  const getObservationsForClass = useCallback(
    (classId: string, className: string) =>
      observations.filter(
        obs => obs.classId === classId || (!obs.classId && obs.className === className),
      ),
    [observations],
  );

  const classPendingDeletion = useMemo(() => {
    if (!classPendingDeletionId) {
      return null;
    }

    const schoolClass = classes.find(cls => cls.id === classPendingDeletionId);
    if (!schoolClass) {
      return null;
    }

    return {
      id: schoolClass.id,
      name: schoolClass.name,
      observationsCount: getObservationsForClass(
        schoolClass.id,
        schoolClass.name,
      ).length,
    };
  }, [classPendingDeletionId, classes, getObservationsForClass]);

  const handlePreferenceChange = (value: ThemePreference) => {
    setPreference(value);
  };

  const handleDeleteClass = useCallback(
    (id: string) => {
      setClassPendingDeletionId(id);
    },
    [],
  );

  const handleDismissDeleteClassSheet = useCallback(() => {
    if (!isDeletingClass) {
      setClassPendingDeletionId(null);
    }
  }, [isDeletingClass]);

  const handleDismissDeleteClassErrorSheet = useCallback(() => {
    setDeleteClassErrorVisible(false);
  }, []);

  const handleConfirmDeleteClass = useCallback(async () => {
    if (!classPendingDeletion) {
      return;
    }

    const affectedObservations = getObservationsForClass(
      classPendingDeletion.id,
      classPendingDeletion.name,
    );

    setIsDeletingClass(true);

    try {
      await Promise.all(
        affectedObservations.map(observation => deleteObservation(observation.id)),
      );
      await deleteClass(classPendingDeletion.id);
      const lastSyncAt = await touchLastSync();

      queryClient.setQueryData<Observation[]>(
        queryKeys.observations,
        current =>
          (current ?? []).filter(
            observation =>
              observation.classId !== classPendingDeletion.id &&
              !(!observation.classId && observation.className === classPendingDeletion.name),
          ),
      );
      queryClient.setQueryData<SchoolClass[]>(
        queryKeys.classes,
        current => (current ?? []).filter(item => item.id !== classPendingDeletion.id),
      );

      await Promise.all([
        queryClient.invalidateQueries({queryKey: queryKeys.observations}),
        queryClient.invalidateQueries({queryKey: queryKeys.classes}),
      ]);

      setLastSync(lastSyncAt);
      setClassPendingDeletionId(null);
    } catch {
      setClassPendingDeletionId(null);
      setDeleteClassErrorVisible(true);
    } finally {
      setIsDeletingClass(false);
    }
  }, [classPendingDeletion, getObservationsForClass]);

  const handleOpenDesignSystem = () => navigation.navigate('DesignSystem');

  const handleAppIconChange = async (value: AppIconVariant) => {
    try {
      await appIconService.setAppIcon(value);
      await setItem(storageKeys.appIcon, value);
      setAppIcon(value);
    } catch {
      // native module unavailable (simulator or missing build)
    }
  };

  useEffect(() => {
    let isActive = true;

    void (async () => {
      const syncAt = await getLastSync();

      if (!isActive) {
        return;
      }

      setLastSync(syncAt);

      try {
        const stored = await getItem(storageKeys.appIcon);

        if (!isActive) {
          return;
        }

        if (stored === 'default' || stored === 'second_option') {
          setAppIcon(stored);
          return;
        }

        const nativeIcon = await appIconService.getCurrentAppIcon();

        if (!isActive) {
          return;
        }

        setAppIcon(nativeIcon);
        await setItem(storageKeys.appIcon, nativeIcon);
      } catch {
        if (isActive) {
          setAppIcon('default');
        }
      }
    })();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    getLastSync().then(setLastSync);
  }, [classes, observations]);

  return (
    <SettingsScreen
      preference={preference}
      lastSync={lastSync}
      classes={classes}
      classPendingDeletion={classPendingDeletion}
      deleteClassErrorVisible={deleteClassErrorVisible}
      isDeletingClass={isDeletingClass}
      appIcon={appIcon}
      onBack={() => navigation.goBack()}
      onPreferenceChange={handlePreferenceChange}
      onAppIconChange={handleAppIconChange}
      onDeleteClass={handleDeleteClass}
      onConfirmDeleteClass={handleConfirmDeleteClass}
      onDismissDeleteClassSheet={handleDismissDeleteClassSheet}
      onDismissDeleteClassErrorSheet={handleDismissDeleteClassErrorSheet}
      onOpenDesignSystem={isDev ? handleOpenDesignSystem : undefined}
    />
  );
};

export default SettingsScreenContainer;
