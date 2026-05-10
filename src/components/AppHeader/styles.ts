import styled from 'styled-components/native';

interface TitleProps {
  home: boolean;
}
export const FlexSpacer = styled.View`
  flex: 1;
`;

export const HeaderTitle = styled.Text<TitleProps>`
  flex: 1;
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme, home }) =>
    home ? theme.typography.fonts.displayMedium : theme.typography.fonts.uiMedium};
  font-size: ${({ theme, home }) => (home ? theme.typography.size['3xl'] : 17)}px;
  line-height: ${({ home }) => (home ? 36 : 22)}px;
  padding-left: ${({ home }) => (home ? 20 : 4)}px;
`;
