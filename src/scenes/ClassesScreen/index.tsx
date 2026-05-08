import React from 'react';

import {useClassesViewModel} from './useClassesViewModel';
import {ClassesScreen as ClassesScreenView} from './ClassesScreen';

const ClassesScreenContainer = () => {
  const vm = useClassesViewModel();
  return <ClassesScreenView {...vm} />;
};

export {ClassesScreenContainer as ClassesScreen};
