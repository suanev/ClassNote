import React from 'react';

import {FAB, ScreenContainer, Skeleton} from '@components/index';

import {
  SafeAreaContainer,
  SkeletonCard,
  SkeletonChipRow,
  SkeletonHorizontalScrollView,
  SkeletonMetaRow,
  SkeletonRow,
  SkeletonScrollView,
  SkeletonScreen,
  SkeletonStack,
} from './styles';

export const ObservationSkeleton = () => {
  /* istanbul ignore next */
  const handleDisabledFabPress = () => undefined;

  return (
    <ScreenContainer>
      <SafeAreaContainer>
        <SkeletonScreen>
          <SkeletonScrollView>
            <SkeletonRow>
              <Skeleton height={14} width={132} radius={12} />
              <SkeletonRow>
                <Skeleton height={32} width={112} radius={9999} />
                <Skeleton height={36} width={36} radius={18} />
              </SkeletonRow>
            </SkeletonRow>

            <SkeletonStack>
              <Skeleton height={42} width={184} radius={16} />
              <Skeleton height={20} width={168} radius={12} />
            </SkeletonStack>

            <SkeletonHorizontalScrollView>
              <SkeletonChipRow>
                {[132, 88, 88, 88].map((width, index) => (
                  <Skeleton
                    key={`chip-${index}`}
                    height={44}
                    width={width}
                    radius={9999}
                  />
                ))}
              </SkeletonChipRow>
            </SkeletonHorizontalScrollView>

            <SkeletonStack style={{marginTop: 24}}>
              {[0, 1, 2].map(index => (
                <SkeletonCard key={`card-${index}`}>
                  <SkeletonRow>
                    <Skeleton height={22} width="56%" radius={12} />
                    <Skeleton height={18} width={18} radius={9} />
                  </SkeletonRow>
                  <SkeletonMetaRow>
                    <Skeleton height={12} width={96} radius={10} />
                  </SkeletonMetaRow>
                  <SkeletonStack>
                    <Skeleton height={16} width="100%" radius={12} />
                    <Skeleton height={16} width="82%" radius={12} />
                  </SkeletonStack>
                </SkeletonCard>
              ))}
            </SkeletonStack>
          </SkeletonScrollView>

          <FAB disabled onPress={handleDisabledFabPress} />
        </SkeletonScreen>
      </SafeAreaContainer>
    </ScreenContainer>
  );
};
