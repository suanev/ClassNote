import React, {useState} from 'react';
import {View} from 'react-native';
import type {Meta, StoryObj} from '@storybook/react';

import {DocNote} from '../../../.storybook/DocNote';
import {Chip} from './Chip';

const noop = () => {};

const meta = {
  title: 'Components/Chip',
  component: Chip,
  parameters: {
    docs: {
      description: {
        component:
          'Pill compacto de seleção. Usado em filtros (turno, turma, favoritos) e no formulário de observação para escolher a turma. A variante `dashed` sinaliza uma ação de criação, como "+ Nova turma".',
      },
    },
  },
  argTypes: {
    label: {
      description: 'Texto exibido dentro do chip.',
      control: {type: 'text'},
    },
    active: {
      description: 'Quando `true`, o chip fica preenchido com a cor primária.',
      control: {type: 'boolean'},
    },
    variant: {
      description:
        '`default` = borda sólida; `dashed` = borda tracejada com ícone `+`, indica ação de criação.',
      control: {type: 'select'},
      options: ['default', 'dashed'],
    },
    onPress: {action: 'pressed'},
  },
  args: {
    label: 'Chip',
    active: false,
    variant: 'default',
    onPress: noop,
  },
  decorators: [
    Story => (
      <View style={{padding: 24, flexDirection: 'row', flexWrap: 'wrap', gap: 8}}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Docs: Story = {
  render: () => (
    <DocNote
      title="Chip"
      description="Pill compacto de seleção para filtros e formulários. Atua como radio button em grupos de turno e como toggle individual para turma ou favoritos."
      notes={[
        "active: fundo primary (#1F3A5F / #7DA3D4 dark), texto branco",
        "inativo: fundo transparente, borda border (1 px sólida)",
        "dashed: borda tracejada borderStrong + ícone '+' — indica ação de criação (Nova turma)",
        "accessibilityRole='radio' para grupos mutuamente exclusivos (turno)",
      ]}
      props={[
        {name: 'label', type: 'string', required: true, description: 'Texto exibido no chip.'},
        {name: 'active', type: 'boolean', description: 'Estado selecionado. Padrão: false.'},
        {name: 'variant', type: "'default' | 'dashed'", description: 'default = sólido; dashed = borda tracejada com ícone +.'},
        {name: 'onPress', type: '() => void', description: 'Callback de seleção.'},
      ]}
    />
  ),
};

export const Default: Story = {
  args: {label: 'Manhã'},
};

export const Active: Story = {
  args: {label: 'Manhã', active: true},
};

export const Dashed: Story = {
  args: {label: 'Nova turma', variant: 'dashed'},
};

export const ShiftFilter: Story = {
  render: () => {
    const shifts = ['Todos', 'Manhã', 'Tarde', 'Noite', 'Outro'];
    const [selected, setSelected] = useState<string>('Todos');
    return (
      <View style={{padding: 24, flexDirection: 'row', flexWrap: 'wrap', gap: 8}}>
        {shifts.map(shift => (
          <Chip
            key={shift}
            label={shift}
            active={selected === shift}
            onPress={() => setSelected(shift)}
            accessibilityRole="radio"
          />
        ))}
      </View>
    );
  },
};

export const ClassSelector: Story = {
  render: () => {
    const classes = ['5º Ano A', '5º Ano B', '6º Ano A'];
    const [selected, setSelected] = useState<string | null>(null);
    return (
      <View style={{padding: 24, flexDirection: 'row', flexWrap: 'wrap', gap: 8}}>
        {classes.map(cls => (
          <Chip
            key={cls}
            label={cls}
            active={selected === cls}
            onPress={() => setSelected(selected === cls ? null : cls)}
          />
        ))}
        <Chip label="Nova turma" variant="dashed" onPress={noop} />
      </View>
    );
  },
};
