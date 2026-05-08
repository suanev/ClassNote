import {Pressable} from 'react-native';
import styled from 'styled-components/native';

import {Card} from '@components/Card';

export const EmptyCard = styled(Card).attrs({
  padding: 24,
  variant: 'default',
})`
  align-items: center;
  margin-top: ${({theme}) => theme.spacing[3]}px;
`;

export const IconBadge = styled.View`
  width: 56px;
  height: 56px;
  border-radius: ${({theme}) => theme.radii.pill}px;
  align-items: center;
  justify-content: center;
  background-color: ${({theme}) => theme.colors.primarySubtle};
  border-width: 1px;
  border-color: ${({theme}) => theme.colors.primaryBorder};
`;

export const Title = styled.Text`
  margin-top: ${({theme}) => theme.spacing[4]}px;
  color: ${({theme}) => theme.colors.text};
  font-size: ${({theme}) => theme.typography.size.xl}px;
  font-family: ${({theme}) => theme.typography.fontFamily.ui};
  font-weight: ${({theme}) => theme.typography.fontWeights.semibold};
  text-align: center;
`;

export const Description = styled.Text`
  margin-top: ${({theme}) => theme.spacing[2]}px;
  color: ${({theme}) => theme.colors.textMuted};
  font-size: ${({theme}) => theme.typography.size.md}px;
  font-family: ${({theme}) => theme.typography.fontFamily.ui};
  line-height: 24px;
  text-align: center;
`;

export const ActionButton = styled(Pressable)`
  margin-top: ${({theme}) => theme.spacing[5]}px;
  min-height: 48px;
  padding-horizontal: ${({theme}) => theme.spacing[5]}px;
  border-radius: ${({theme}) => theme.radii.pill}px;
  align-items: center;
  justify-content: center;
  background-color: ${({theme}) => theme.colors.primary};
`;

export const ActionLabel = styled.Text`
  color: ${({theme}) => theme.colors.onPrimary};
  font-size: ${({theme}) => theme.typography.size.md}px;
  font-family: ${({theme}) => theme.typography.fontFamily.ui};
  font-weight: ${({theme}) => theme.typography.fontWeights.semibold};
`;
