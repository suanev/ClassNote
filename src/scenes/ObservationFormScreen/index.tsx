import React from 'react';

import {ObservationSkeleton} from '@components/ObservationSkeleton';
import {useObservationFormViewModel} from './useObservationFormViewModel';
import ObservationFormScreen from './ObservationFormScreen';

const ObservationFormContainer = () => {
  const vm = useObservationFormViewModel();

  if (vm.isRouteLoading) {
    return <ObservationSkeleton />;
  }

  return <ObservationFormScreen {...vm} />;
};

export default ObservationFormContainer;
