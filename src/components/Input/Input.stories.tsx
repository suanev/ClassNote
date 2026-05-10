import React, {useState} from 'react';
import {View} from 'react-native';
import type {Meta, StoryObj} from '@storybook/react';

import {DocNote} from '../../../.storybook/DocNote';
import {Input} from './Input';

const ControlledInputStory = (args: React.ComponentProps<typeof Input>) => {
  const [value, setValue] = useState(args.value ?? '');
  return <Input {...args} value={value} onChangeText={setValue} />;
};

const meta = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    docs: {
      description: {
        component:
          'Campo de texto estilizado. Altura mínima 48 px (single-line), borda de 1 px que destaca em `primary` ao receber foco. Suporta ícone Feather à esquerda e modo multiline com altura dinâmica. Usado no nome do aluno, texto da observação e nome da nova turma.',
      },
    },
  },
  argTypes: {
    placeholder: {description: 'Texto de placeholder em `textMuted`.', control: {type: 'text'}},
    icon: {description: 'Ícone Feather à esquerda do campo.', control: {type: 'text'}},
    multiline: {description: 'Habilita múltiplas linhas.', control: {type: 'boolean'}},
    numberOfLines: {description: 'Altura inicial em linhas (multiline).', control: {type: 'number'}},
  },
  args: {
    placeholder: 'Digite algo...',
    value: '',
  },
  decorators: [
    Story => (
      <View style={{padding: 24, gap: 12}}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Docs: Story = {
  render: () => (
    <DocNote
      title="Input"
      description="Campo de texto com estilo Notebook. Borda de 1 px que troca para primary ao receber foco. Altura mínima de 48 px (single-line)."
      notes={[
        'Foco: border-color muda para primary (#1F3A5F / #7DA3D4 dark)',
        'Multiline: altura cresce com o conteúdo; use numberOfLines para altura inicial',
        'icon: ícone Feather à esquerda (ex: "user", "file-text")',
        'placeholder exibido em textMuted',
      ]}
      props={[
        {name: 'value', type: 'string', required: true, description: 'Valor controlado do campo.'},
        {name: 'onChangeText', type: '(text: string) => void', required: true, description: 'Callback de mudança de texto.'},
        {name: 'placeholder', type: 'string', description: 'Texto de placeholder.'},
        {name: 'icon', type: 'string', description: 'Nome do ícone Feather à esquerda.'},
        {name: 'multiline', type: 'boolean', description: 'Habilita múltiplas linhas.'},
        {name: 'numberOfLines', type: 'number', description: 'Linhas visíveis iniciais (multiline).'},
      ]}
    />
  ),
};

export const Default: Story = {
  args: {placeholder: 'Nome do aluno'},
  render: args => <ControlledInputStory {...args} />,
};

export const WithIcon: Story = {
  args: {icon: 'user', placeholder: 'Nome do aluno'},
  render: args => <ControlledInputStory {...args} />,
};

export const Multiline: Story = {
  args: {
    icon: 'file-text',
    placeholder: 'Descreva a observação...',
    multiline: true,
    numberOfLines: 5,
  },
  render: args => <ControlledInputStory {...args} />,
};

export const WithValue: Story = {
  args: {icon: 'user', value: 'Ana Silva', placeholder: 'Nome do aluno'},
};

export const NoAutoCapitalize: Story = {
  args: {
    placeholder: 'email@escola.com',
    value: 'teacher@classnote.app',
    autoCapitalize: 'none',
    accessibilityLabel: 'Email',
  },
};

export const LongMultilineValue: Story = {
  args: {
    multiline: true,
    numberOfLines: 7,
    value:
      'Aluno participou bem da atividade em grupo, mas ainda precisa de apoio para organizar a fala e concluir o raciocínio com mais clareza durante a apresentação final.',
    placeholder: 'Descreva a observação',
  },
  render: args => <Input {...args} />,
};
