import React from 'react';
import {View} from 'react-native';
import type {Meta, StoryObj} from '@storybook/react';
import {useTheme} from 'styled-components/native';

import {DocNote} from '../../../.storybook/DocNote';
import {Skeleton} from './Skeleton';

const SkeletonCardComposition = () => {
  const theme = useTheme();

  return (
    <View style={{padding: 24, gap: 10}}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Skeleton height={20} width="52%" radius={6} />
        <Skeleton height={18} width={18} radius={4} />
      </View>
      <Skeleton height={13} width={110} radius={4} />
      <Skeleton height={15} width="100%" radius={4} />
      <Skeleton height={15} width="72%" radius={4} />
      <View style={{height: 1, backgroundColor: theme.colors.border, marginVertical: 4}} />
      <Skeleton height={11} width={72} radius={4} />
    </View>
  );
};

const meta = {
  title: 'Components/Skeleton',
  component: Skeleton,
  parameters: {
    docs: {
      description: {
        component:
          'Bloco animado de carregamento (shimmer de opacidade). Primitivo base usado dentro de `ObservationSkeleton` para compor o estado de loading da lista. Aceita qualquer dimensão e raio de borda.',
      },
    },
  },
  argTypes: {
    height: {
      description: 'Altura em pixels.',
      control: {type: 'range', min: 8, max: 200, step: 4},
    },
    width: {
      description: 'Largura em pixels ou porcentagem (ex: `"100%"`, `120`).',
      control: {type: 'text'},
    },
    radius: {
      description: 'Border radius. Use `9999` para pill (chip skeleton).',
      control: {type: 'range', min: 0, max: 9999, step: 2},
    },
  },
  args: {
    height: 18,
    width: '80%',
    radius: 4,
  },
  decorators: [
    Story => (
      <View style={{padding: 24, gap: 12}}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Docs: Story = {
  render: () => (
    <DocNote
      title="Skeleton"
      description="Primitivo base de carregamento usado para compor outros estados de loading do app."
      notes={[
        'Aceita largura numérica ou percentual.',
        'Pode representar texto, avatar, chip, ícone ou separador.',
        'A composição final deve lembrar a UI real, não só blocos aleatórios.',
      ]}
      props={[
        {name: 'height', type: 'number', required: true, description: 'Altura do bloco.'},
        {
          name: 'width',
          type: 'number | string',
          required: true,
          description: 'Largura do bloco, em pixels ou porcentagem.',
        },
        {name: 'radius', type: 'number', description: 'Raio da borda.'},
      ]}
    />
  ),
};

export const Default: Story = {};

export const Title: Story = {
  args: {height: 28, width: '55%', radius: 6},
};

export const Chip: Story = {
  args: {height: 36, width: 88, radius: 9999},
};

export const Avatar: Story = {
  args: {height: 40, width: 40, radius: 9999},
};

export const CardComposition: Story = {
  render: () => <SkeletonCardComposition />,
};
