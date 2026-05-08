import React from 'react';

import {useClassDetailViewModel} from './useClassDetailViewModel';
import {ClassDetailScreen as ClassDetailScreenView} from './ClassDetailScreen';

const ClassDetailContainer = () => {
  const vm = useClassDetailViewModel();
  return <ClassDetailScreenView {...vm} />;
};

export {ClassDetailContainer as ClassDetailScreen};
