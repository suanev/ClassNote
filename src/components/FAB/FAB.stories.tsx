import React from 'react';
import {View} from 'react-native';
import type {Meta, StoryObj} from '@storybook/react';

import {DocNote} from '../../../.storybook/DocNote';
import {FAB} from './FAB';

const noop = () => {};

const meta = {
  title: 'Components/FAB',
  component: FAB,
  parameters: {
    docs: {
      description: {
        component:
          'Botão de ação flutuante 60×60, posicionado absolutamente no canto inferior direito. Background `primary` do tema (adapta light/dark). Ícone usa `onPrimary` para contraste correto em ambos os modos. Sombra navy de 24 px de blur. Suporta qualquer ícone Feather.',
      },
    },
  },
  argTypes: {
    icon: {description: 'Nome do ícone Feather. Padrão: `plus`.', control: {type: 'text'}},
    disabled: {description: 'Opacidade 0.5, sem interação.', control: {type: 'boolean'}},
    right: {description: 'Distância da borda direita em pixels.', control: {type: 'number'}},
    bottom: {description: 'Distância da borda inferior em pixels.', control: {type: 'number'}},
  },
  args: {
    icon: 'plus',
    onPress: noop,
    disabled: false,
  },
  decorators: [
    Story => (
      <View style={{height: 160, justifyContent: 'center', alignItems: 'center'}}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof FAB>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Docs: Story = {
  render: () => (
    <DocNote
      title="FAB"
      description="Botão flutuante principal da tela de observações. É uma CTA persistente, então precisa ser legível, tocável e não colidir com a navegação inferior."
      notes={[
        'Costuma ficar sobreposto à lista, não centralizado na tela.',
        'O offset inferior muda quando a tela precisa respeitar tab bar ou safe area.',
        'Convém sempre checar contraste e presença do ícone no dark mode.',
      ]}
      props={[
        {name: 'icon', type: 'string', description: 'Nome do ícone Feather.'},
        {name: 'onPress', type: '() => void', required: true, description: 'Ação principal do botão.'},
        {name: 'disabled', type: 'boolean', description: 'Desabilita interação e reduz opacidade.'},
        {name: 'right', type: 'number', description: 'Offset da borda direita.'},
        {name: 'bottom', type: 'number', description: 'Offset da borda inferior.'},
      ]}
    />
  ),
};

export const Default: Story = {
  args: {onPress: noop},
};

export const Disabled: Story = {
  args: {onPress: noop, disabled: true},
};

export const EditIcon: Story = {
  args: {onPress: noop, icon: 'edit-3', accessibilityLabel: 'Editar observação'},
};

export const InScreenCorner: Story = {
  render: () => (
    <View
      style={{
        height: 320,
        borderRadius: 20,
        overflow: 'hidden',
        position: 'relative',
      }}>
      <View style={{flex: 1}} />
      <FAB onPress={noop} />
    </View>
  ),
};
