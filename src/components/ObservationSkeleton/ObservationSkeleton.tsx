import React from 'react';

import {FAB as Fab, ScreenContainer, Skeleton} from '@components/index';

import {
  SafeAreaContainer,
  SkeletonCard,
  SkeletonDashedLine,
  SkeletonHorizontalScrollView,
  SkeletonChipRow,
  SkeletonMetaRow,
  SkeletonRow,
  SkeletonScrollView,
  SkeletonScreen,
  SkeletonStack,
} from './styles';

const CHIP_SKELETONS = [
  {id: 'chip-all', width: 132},
  {id: 'chip-1', width: 88},
  {id: 'chip-2', width: 88},
  {id: 'chip-3', width: 88},
] as const;

export const ObservationSkeleton = () => {
  /* istanbul ignore next */
  const handleDisabledFabPress = () => undefined;

  return (
    <ScreenContainer>
      <SafeAreaContainer>
        <SkeletonScreen>
          <SkeletonScrollView>
            <SkeletonRow>
              <Skeleton height={30} width={160} radius={6} />
              <SkeletonRow>
                <Skeleton height={40} width={40} radius={8} />
                <Skeleton height={40} width={40} radius={8} />
              </SkeletonRow>
            </SkeletonRow>

            <SkeletonHorizontalScrollView>
              <SkeletonChipRow>
                {CHIP_SKELETONS.map(({id, width}) => (
                  <Skeleton key={id} height={36} width={width} radius={9999} />
                ))}
              </SkeletonChipRow>
            </SkeletonHorizontalScrollView>

            <SkeletonStack style={{marginTop: 24}}>
              {[0, 1, 2].map(index => (
                <SkeletonCard key={`card-${index}`}>
                  <SkeletonRow>
                    <Skeleton height={22} width="56%" radius={6} />
                    <Skeleton height={18} width={18} radius={4} />
                  </SkeletonRow>
                  <SkeletonMetaRow>
                    <Skeleton height={13} width={110} radius={4} />
                  </SkeletonMetaRow>
                  <SkeletonStack>
                    <Skeleton height={15} width="100%" radius={4} />
                    <Skeleton height={15} width="78%" radius={4} />
                  </SkeletonStack>
                  <SkeletonDashedLine />
                  <Skeleton height={11} width={72} radius={4} />
                </SkeletonCard>
              ))}
            </SkeletonStack>
          </SkeletonScrollView>

          <Fab disabled onPress={handleDisabledFabPress} />
        </SkeletonScreen>
      </SafeAreaContainer>
    </ScreenContainer>
  );
};
