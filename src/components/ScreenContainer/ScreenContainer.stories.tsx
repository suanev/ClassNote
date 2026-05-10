import React from 'react';
import {Text} from 'react-native';
import type {Meta, StoryObj} from '@storybook/react';

import {DocNote} from '../../../.storybook/DocNote';
import {ScreenContainer} from './ScreenContainer';

const meta = {
  title: 'Components/ScreenContainer',
  component: ScreenContainer,
  parameters: {
    docs: {
      description: {
        component:
          'Wrapper de tela que aplica `backgroundColor: bg` do tema e, opcionalmente, um `paddingBottom` para não sobrepor a tab bar ou o FAB. Garante fundo correto no light e dark mode sem repetir estilos em cada tela.',
      },
    },
  },
  argTypes: {
    withBottom: {
      description: 'Adiciona padding inferior para acomodar FAB ou tab bar.',
      control: {type: 'boolean'},
    },
  },
  args: {
    withBottom: false,
  },
} satisfies Meta<typeof ScreenContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: args => (
    <ScreenContainer {...args}>
      <Text style={{padding: 24, color: '#555'}}>Conteúdo da tela</Text>
    </ScreenContainer>
  ),
};

export const WithBottom: Story = {
  args: {withBottom: true},
  render: args => (
    <ScreenContainer {...args}>
      <Text style={{padding: 24, color: '#555'}}>Conteúdo com espaço para FAB</Text>
    </ScreenContainer>
  ),
};
