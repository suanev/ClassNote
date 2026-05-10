import styled from 'styled-components/native';

interface ActiveProps {
  active: boolean;
}

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.bg};
`;

export const SectionsList = styled.ScrollView.attrs({
  contentContainerStyle: {
    paddingBottom: 48,
  },
})``;

export const Section = styled.View`
  margin-top: 24px;
  padding-horizontal: 20px;
`;

export const SectionLabel = styled.Text`
  text-transform: uppercase;
  letter-spacing: 1.1px;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.typography.size.xs}px;
  font-family: ${({ theme }) => theme.typography.fontFamily.ui};
  font-weight: 600;
`;

export const Card = styled.View`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.card}px;
  overflow: hidden;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
`;

export const ListItem = styled.View`
  flex-direction: row;
  align-items: center;
  min-height: 56px;
  padding-horizontal: 16px;
  gap: 12px;
`;

export const ListItemIcon = styled.View`
  width: 24px;
  align-items: center;
`;

export const ListItemTitle = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.size.md}px;
  font-family: ${({ theme }) => theme.typography.fontFamily.ui};
  font-weight: 500;
`;

export const ListItemDescription = styled.Text`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.typography.size.sm}px;
  font-family: ${({ theme }) => theme.typography.fontFamily.ui};
  margin-top: 1px;
`;

export const ClassRow = styled.View`
  flex-direction: row;
  align-items: center;
  min-height: 56px;
  padding-horizontal: 16px;
  gap: 12px;
`;

export const ClassRowName = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.size.md}px;
  font-family: ${({ theme }) => theme.typography.fontFamily.ui};
  font-weight: 500;
`;

export const ClassRowShift = styled.Text`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.typography.size.sm}px;
  font-family: ${({ theme }) => theme.typography.fontFamily.ui};
  margin-top: 1px;
`;

export const SegmentedControl = styled.View`
  flex-direction: row;
  background-color: ${({ theme }) => theme.colors.surface2};
  border-radius: ${({ theme }) => theme.radii.control}px;
  padding: 4px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
`;

export const SegmentedOption = styled.Pressable<ActiveProps>`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 40px;
  border-radius: 4px;
  background-color: ${({ theme, active }) => (active ? theme.colors.primary : 'transparent')};
`;

export const SegmentedOptionLabel = styled.Text<ActiveProps>`
  color: ${({ theme, active }) => (active ? theme.colors.surface : theme.colors.textMutedStrong)};
  font-size: ${({ theme }) => theme.typography.size.sm}px;
  font-family: ${({ theme }) => theme.typography.fontFamily.ui};
  font-weight: 500;
`;

export const Divider = styled.View`
  height: 1px;
  background-color: ${({theme}) => theme.colors.border};
`;

export const ListItemContent = styled.View`
  flex: 1;
`;

export const ClassInfoContent = styled.View`
  flex: 1;
`;

export const ClassRowWrapper = styled.View``;

export const DialogButtonContainer = styled.View`
  flex: 1;
`;

export const DeleteSheetBody = styled.View`
  padding: 4px 0 0;
`;

export const DeleteSheetSection = styled.View`
  margin-bottom: 20px;
`;

export const DeleteSheetDescription = styled.Text`
  color: ${({theme}) => theme.colors.textMutedStrong};
  font-size: ${({theme}) => theme.typography.size.md}px;
  font-family: ${({theme}) => theme.typography.fontFamily.ui};
  line-height: 22px;
`;

export const DeleteSheetDescriptionStrong = styled.Text`
  color: ${({theme}) => theme.colors.text};
  font-size: ${({theme}) => theme.typography.size.md}px;
  font-family: ${({theme}) => theme.typography.fonts?.uiMedium ?? theme.typography.fontFamily.ui};
  font-weight: 600;
`;

export const DeleteSheetActions = styled.View`
  flex-direction: row;
  gap: 12px;
  margin-top: 20px;
`;
