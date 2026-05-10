import React from 'react';
import {View} from 'react-native';
import type {Meta, StoryObj} from '@storybook/react';
import {useTheme} from 'styled-components/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {DocNote} from '../../../.storybook/DocNote';
import {IconButton} from '../IconButton';
import {SyncStatusIcon} from '../SyncStatusIcon';
import {AppHeader} from './AppHeader';

const HeaderStorySurface = ({children}: {children: React.ReactNode}) => {
  const theme = useTheme();
  return <View style={{flex: 1, backgroundColor: theme.colors.bg}}>{children}</View>;
};

const HeaderFavoriteAction = () => {
  const theme = useTheme();
  return <MaterialCommunityIcons name="star-outline" size={22} color={theme.colors.textSubtle} />;
};

const meta = {
  title: 'Components/AppHeader',
  component: AppHeader,
  parameters: {
    docs: {
      description: {
        component:
          'Header unificado com dois modos: `home` (título + ações à direita) e `navigation` (botão voltar + título). Substitui o header nativo do React Navigation.',
      },
    },
  },
  decorators: [
    (Story: React.ComponentType) => (
      <HeaderStorySurface>
        <Story />
      </HeaderStorySurface>
    ),
  ],
} satisfies Meta<typeof AppHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Docs: Story = {
  args: {
    mode: 'navigation',
    title: 'AppHeader',
    onBack: () => {},
  },
  render: () => (
    <DocNote
      title="AppHeader"
      description="Header unificado com dois modos semânticos. Modo home: título fixo à esquerda com slot de ações à direita. Modo navigation: botão voltar sempre visível à esquerda, título à direita do botão."
      notes={[
        'mode="home": título sempre visível; rightContent recebe qualquer ReactNode (ícones, badges)',
        'mode="navigation": onBack obrigatório; botão voltar sempre renderizado',
        'statusBarHeight={0}: SafeAreaView no ScreenContainer já absorve a inset do status bar',
        'Cores e fontes do tema via styled-components — funciona em light e dark mode',
      ]}
      props={[
        {name: 'mode', type: "'home' | 'navigation'", required: true, description: "Define o comportamento. 'home' para tela principal; 'navigation' para telas secundárias."},
        {name: 'title', type: 'string', required: true, description: 'Texto exibido no header.'},
        {name: 'onBack', type: '() => void', description: "(mode='navigation') Callback do botão voltar."},
        {name: 'rightContent', type: 'ReactNode', description: "(mode='home') Conteúdo à direita (ícones de ação, sync, etc.)."},
      ]}
    />
  ),
};

export const HomeWithActions: Story = {
  args: {
    mode: 'home',
    title: 'Observações',
  },
  render: () => (
    <AppHeader
      mode="home"
      title="Observações"
      rightContent={
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 4, paddingRight: 4}}>
          <SyncStatusIcon />
          <IconButton icon="settings" onPress={() => {}} accessibilityLabel="Ajustes" />
        </View>
      }
    />
  ),
};

export const Navigation: Story = {
  args: {
    mode: 'navigation',
    title: 'Ajustes',
    onBack: () => {},
  },
  render: () => (
    <AppHeader mode="navigation" title="Ajustes" onBack={() => {}} />
  ),
};

export const NavigationWithAction: Story = {
  args: {
    mode: 'navigation',
    title: 'Editar observação',
    onBack: () => {},
  },
  render: () => (
    <AppHeader
      mode="navigation"
      title="Editar observação"
      onBack={() => {}}
      rightContent={
        <HeaderFavoriteAction />
      }
    />
  ),
};
