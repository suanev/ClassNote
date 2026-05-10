import React from 'react';
import {Appbar} from 'react-native-paper';
import {useTheme} from 'styled-components/native';

import {HeaderTitle} from './styles';

type HomeHeaderProps = {
  mode: 'home';
  title: string;
  rightContent?: React.ReactNode;
};

type NavigationHeaderProps = {
  mode: 'navigation';
  title: string;
  onBack: () => void;
  rightContent?: React.ReactNode;
};

export type AppHeaderProps = HomeHeaderProps | NavigationHeaderProps;

export function AppHeader(props: AppHeaderProps) {
  const theme = useTheme();

  return (
    <Appbar.Header
      style={{backgroundColor: theme.colors.bg}}
      statusBarHeight={0}>
      {props.mode === 'navigation' && (
        <Appbar.BackAction
          onPress={props.onBack}
          color={theme.colors.text}
          accessibilityLabel="Voltar"
          testID="app-header-back-button"
        />
      )}

      <HeaderTitle home={props.mode === 'home'}>{props.title}</HeaderTitle>

      {props.rightContent}
    </Appbar.Header>
  );
}
