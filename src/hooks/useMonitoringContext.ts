import {useEffect} from 'react';
import {useSelector} from 'react-redux';

import {useObservationsQuery} from '@hooks/useObservations';
import {monitoring} from '@services/monitoring';
import {syncQueue} from '@services/syncQueue';
import {RootState} from '@store/index';

export const useMonitoringContext = () => {
  const isOffline = useSelector((state: RootState) => state.network.isOffline);
  const observationsQuery = useObservationsQuery();
  const observationsCount = observationsQuery.data?.length ?? 0;

  useEffect(() => {
    monitoring.setAppContext({
      networkStatus: isOffline ? 'offline' : 'online',
      observationsCount,
      pendingSyncCount: syncQueue.getAll().length,
    });
  }, [isOffline, observationsCount]);
};
