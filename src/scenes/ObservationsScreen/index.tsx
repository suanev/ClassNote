import React from 'react';

import {useObservationsViewModel} from './useObservationsViewModel';
import {ObservationsScreen as ObservationsScreenView} from './ObservationsScreen';

const ObservationsScreenContainer = () => {
  const vm = useObservationsViewModel();
  return <ObservationsScreenView {...vm} />;
};

export {ObservationsScreenContainer as ObservationsScreen};
