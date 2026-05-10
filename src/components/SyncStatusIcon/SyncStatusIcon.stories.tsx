import React from 'react';
import {View} from 'react-native';
import {configureStore} from '@reduxjs/toolkit';
import {Provider} from 'react-redux';
import type {Meta, StoryObj} from '@storybook/react';

import {DocNote} from '../../../.storybook/DocNote';

import {rootReducer} from '../../store/rootReducer';
import {SyncStatusIcon} from './SyncStatusIcon';

const buildStore = (isOffline: boolean, isSyncing: boolean) =>
  configureStore({
    reducer: rootReducer,
    middleware: m => m({serializableCheck: false}),
    preloadedState: {network: {isOffline, isSyncing}},
  });

const withNetworkState = (isOffline: boolean, isSyncing: boolean) => {
  const Decorator = (Story: React.ElementType) => (
    <Provider store={buildStore(isOffline, isSyncing)}>
      <Story />
    </Provider>
  );

  Decorator.displayName = `withNetworkState(${String(isOffline)}-${String(isSyncing)})`;
  return Decorator;
};

const meta = {
  title: 'Components/SyncStatusIcon',
  component: SyncStatusIcon,
  parameters: {
    docs: {
      description: {
        component:
          'Ícone no header que comunica o estado de sincronização. Verde (`cloud-check`) = tudo sincronizado; spinner = enviando dados; vermelho (`cloud-off`) = offline. Tap abre tooltip de 3 s com mensagem textual. Lê `network.isOffline` e `network.isSyncing` do Redux.',
      },
    },
  },
  decorators: [
    Story => (
      <View style={{padding: 24, alignItems: 'flex-start'}}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof SyncStatusIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Docs: Story = {
  render: () => (
    <DocNote
      title="SyncStatusIcon"
      description="Indicador de sincronização exibido no header da home. Ele transforma um estado técnico em uma pista visual simples para o usuário."
      notes={[
        'Verde: tudo sincronizado.',
        'Spinner: sincronização em andamento.',
        'Vermelho: offline.',
        'Ao tocar, abre tooltip textual com mais contexto.',
      ]}
      props={[
        {
          name: 'Sem props públicas',
          type: 'n/a',
          description: 'O componente lê o estado de rede pelo Redux.',
        },
      ]}
    />
  ),
};

export const Synced: Story = {
  decorators: [withNetworkState(false, false)],
};

export const Syncing: Story = {
  decorators: [withNetworkState(false, true)],
};

export const Offline: Story = {
  decorators: [withNetworkState(true, false)],
};

export const AllStates: Story = {
  decorators: [withNetworkState(false, false)],
  render: () => (
    <View style={{padding: 24, flexDirection: 'row', gap: 24, alignItems: 'center'}}>
      <Provider store={buildStore(false, false)}>
        <SyncStatusIcon />
      </Provider>
      <Provider store={buildStore(false, true)}>
        <SyncStatusIcon />
      </Provider>
      <Provider store={buildStore(true, false)}>
        <SyncStatusIcon />
      </Provider>
    </View>
  ),
};

export const InHeaderContext: Story = {
  decorators: [withNetworkState(true, false)],
  render: () => (
    <View
      style={{
        paddingHorizontal: 20,
        paddingVertical: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
      <View />
      <SyncStatusIcon />
    </View>
  ),
};
