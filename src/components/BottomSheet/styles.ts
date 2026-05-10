import {BottomSheetModal} from '@gorhom/bottom-sheet';
import styled from 'styled-components/native';

export const BottomSheetComponent = styled(BottomSheetModal).attrs(({theme}) => ({
  handleIndicatorStyle: {display: 'none'},
  backgroundStyle: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.radii.sheet,
    borderTopRightRadius: theme.radii.sheet,
  },
}))``;

export const SheetContainer = styled.View<{ $bottomInset?: number }>`
  flex: 1;
  padding-horizontal: 20px;
  padding-top: 12px;
  padding-bottom: ${({$bottomInset = 0}) => 24 + $bottomInset}px;
  background-color: ${({theme}) => theme.colors.surface};
`;

export const SheetHandle = styled.Pressable`
  width: 40px;
  height: 4px;
  align-self: center;
  border-radius: 2px;
  background-color: ${({theme}) => theme.colors.borderStrong};
`;

export const SheetHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
  margin-bottom: 16px;
`;

export const SheetTitle = styled.Text`
  color: ${({theme}) => theme.colors.text};
  font-size: ${({theme}) => theme.typography.size.xl}px;
  font-family: ${({theme}) => theme.typography.fonts.displayMedium};
  line-height: 28px;
`;
