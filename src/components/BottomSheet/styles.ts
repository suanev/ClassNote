import {BottomSheetModal} from '@gorhom/bottom-sheet';
import styled from 'styled-components/native';

export const BottomSheetComponent = styled(BottomSheetModal).attrs(({theme}) => ({
  handleIndicatorStyle: {display: 'none'},
  backgroundStyle: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.radii['2xl'],
    borderTopRightRadius: theme.radii['2xl'],
  },
}))``;


export const SheetContainer = styled.View`
  flex: 1;
  padding-horizontal: ${({theme}) => theme.spacing[5]}px;
  padding-top: ${({theme}) => theme.spacing[3]}px;
  padding-bottom: ${({theme}) => theme.spacing[5]}px;
  background-color: ${({theme}) => theme.colors.surface};
`;

export const SheetHandle = styled.View`
  width: 48px;
  height: 4px;
  align-self: center;
  border-radius: ${({theme}) => theme.radii.pill}px;
  background-color: ${({theme}) => theme.colors.borderStrong};
`;

export const SheetHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: ${({theme}) => theme.spacing[4]}px;
  margin-bottom: ${({theme}) => theme.spacing[4]}px;
`;

export const SheetTitle = styled.Text`
  color: ${({theme}) => theme.colors.text};
  font-size: ${({theme}) => theme.typography.size.xl}px;
  font-family: ${({theme}) => theme.typography.fontFamily.ui};
  font-weight: ${({theme}) => theme.typography.fontWeights.semibold};
`;

