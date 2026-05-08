import React, {PropsWithChildren, useEffect} from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import Reanimated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import {SkeletonBlock} from './styles';

interface SkeletonProps extends PropsWithChildren {
  height: number;
  width?: number | `${number}%`;
  radius?: number;
  style?: StyleProp<ViewStyle>;
}

const ANIMATION_DURATION = 700;

export const Skeleton = ({
  children,
  height,
  width = '100%',
  radius,
  style,
}: SkeletonProps) => {
  const opacity = useSharedValue(0.55);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, {duration: ANIMATION_DURATION}),
        withTiming(0.55, {duration: ANIMATION_DURATION}),
      ),
      -1,
      false,
    );

    return () => {
      cancelAnimation(opacity);
    };
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <SkeletonBlock
      as={Reanimated.View}
      style={[{height, width, borderRadius: radius}, animatedStyle, style]}>
      {children}
    </SkeletonBlock>
  );
};
