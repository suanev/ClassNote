import styled from 'styled-components/native';

export const Screen = styled.View`
  flex: 1;
  background-color: ${({theme}) => theme.colors.bg};
`;

export const Header = styled.View``;

export const HeaderRow = styled.View`
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
`;

export const BackButton = styled.Pressable`
  flex-direction: row;
  align-items: center;
  align-self: flex-start;
  margin-bottom: ${({theme}) => theme.spacing[4]}px;
`;

export const BackLabel = styled.Text`
  margin-left: ${({theme}) => theme.spacing[1]}px;
  color: ${({theme}) => theme.colors.text};
  font-size: ${({theme}) => theme.typography.fontSizes.sm}px;
  font-family: ${({theme}) => theme.typography.fontFamily.ui};
  font-weight: ${({theme}) => theme.typography.fontWeights.semibold};
`;

export const ClassName = styled.Text`
  color: ${({theme}) => theme.colors.text};
  font-size: ${({theme}) => theme.typography.size['4xl']}px;
  font-family: ${({theme}) => theme.typography.fontFamily.display};
  line-height: 42px;
`;

export const ClassMeta = styled.Text`
  margin-top: ${({theme}) => theme.spacing[1]}px;
  color: ${({theme}) => theme.colors.textMuted};
  font-size: ${({theme}) => theme.typography.fontSizes.sm}px;
  font-family: ${({theme}) => theme.typography.fontFamily.ui};
`;

export const SectionLabel = styled.Text`
  color: ${({theme}) => theme.colors.textMuted};
  font-size: ${({theme}) => theme.typography.fontSizes.xs}px;
  font-family: ${({theme}) => theme.typography.fontFamily.ui};
  font-weight: ${({theme}) => theme.typography.fontWeights.semibold};
  letter-spacing: 1px;
  text-transform: uppercase;
`;

export const ObservationCard = styled.View`
  background-color: ${({theme}) => theme.colors.surface};
  border-radius: ${({theme}) => theme.radii.lg}px;
  padding: ${({theme}) => theme.spacing[4]}px;
  margin-bottom: ${({theme}) => theme.spacing[3]}px;
  border-width: 1px;
  border-color: ${({theme}) => theme.colors.border};
`;

export const ObservationStudent = styled.Text`
  flex: 1;
  color: ${({theme}) => theme.colors.text};
  font-size: ${({theme}) => theme.typography.fontSizes.md}px;
  font-family: ${({theme}) => theme.typography.fontFamily.ui};
  font-weight: ${({theme}) => theme.typography.fontWeights.semibold};
`;

export const StarIcon = styled.View`
  margin-left: ${({theme}) => theme.spacing[2]}px;
`;

export const ObservationText = styled.Text`
  margin-top: ${({theme}) => theme.spacing[2]}px;
  color: ${({theme}) => theme.colors.textMuted};
  font-size: ${({theme}) => theme.typography.fontSizes.sm}px;
  font-family: ${({theme}) => theme.typography.fontFamily.ui};
  line-height: 20px;
`;

export const ObservationFooter = styled.View`
  margin-top: ${({theme}) => theme.spacing[3]}px;
`;

export const ObservationTime = styled.Text`
  color: ${({theme}) => theme.colors.textSubtle};
  font-size: ${({theme}) => theme.typography.fontSizes.xs}px;
  font-family: ${({theme}) => theme.typography.fontFamily.ui};
`;

export const EmptyStateWrapper = styled.View`
  padding-top: ${({theme}) => theme.spacing[10]}px;
`;
