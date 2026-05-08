import {ScrollView} from 'react-native';
import styled from 'styled-components/native';

export const SafeAreaContainer = styled.View`
  flex: 1;
  background-color: ${({theme}) => theme.colors.bg};
`;

export const SkeletonScreen = styled.View`
  flex: 1;
  background-color: ${({theme}) => theme.colors.bg};
`;

export const SkeletonScrollView = styled(ScrollView).attrs({
  contentContainerStyle: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 140,
  },
  showsVerticalScrollIndicator: false,
})``;

export const SkeletonHorizontalScrollView = styled(ScrollView).attrs({
  contentContainerStyle: {
    paddingRight: 20,
  },
  horizontal: true,
  showsHorizontalScrollIndicator: false,
})``;

export const SkeletonRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: ${({theme}) => theme.spacing[2]}px;
`;

export const SkeletonMetaRow = styled.View`
  margin-top: ${({theme}) => theme.spacing[2]}px;
`;

export const SkeletonStack = styled.View`
  margin-top: ${({theme}) => theme.spacing[3]}px;
  gap: ${({theme}) => theme.spacing[2]}px;
`;

export const SkeletonChipRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({theme}) => theme.spacing[3]}px;
  margin-top: ${({theme}) => theme.spacing[5]}px;
`;

export const SkeletonCard = styled.View`
  margin-bottom: ${({theme}) => theme.spacing[3]}px;
  padding: ${({theme}) => theme.spacing[4]}px;
  border-radius: ${({theme}) => theme.radii['2xl']}px;
  background-color: ${({theme}) => theme.colors.surfaceAlt};
  border-width: 1px;
  border-color: ${({theme}) => theme.colors.borderStrong};
  ${({theme}) => theme.shadows.sm};
`;
