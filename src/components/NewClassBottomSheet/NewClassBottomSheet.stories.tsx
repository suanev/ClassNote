import React, {useState} from 'react';
import {View} from 'react-native';
import type {Meta, StoryObj} from '@storybook/react';

import {DocNote} from '../../../.storybook/DocNote';
import {Button} from '@components/Button';
import {NewClassBottomSheet} from './NewClassBottomSheet';

const noop = () => {};

const DefaultNewClassBottomSheetStory = () => {
  const [open, setOpen] = useState(false);
  return (
    <View style={{padding: 24}}>
      <Button variant="primary" onPress={() => setOpen(true)}>
        + Nova turma
      </Button>
      <NewClassBottomSheet
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() => setOpen(false)}
      />
    </View>
  );
};

const LoadingNewClassBottomSheetStory = () => {
  const [open, setOpen] = useState(false);
  return (
    <View style={{padding: 24}}>
      <Button variant="primary" onPress={() => setOpen(true)}>
        + Nova turma (loading)
      </Button>
      <NewClassBottomSheet
        isOpen={open}
        isLoading
        onClose={() => setOpen(false)}
        onConfirm={noop}
      />
    </View>
  );
};

const meta = {
  title: 'Components/NewClassBottomSheet',
  component: NewClassBottomSheet,
  parameters: {
    docs: {
      description: {
        component:
          'Sheet de criação de turma. Exibe um `Input` para o nome e chips de turno (Manhã/Tarde/Noite/Outro). O botão "Criar turma" fica desabilitado até que nome e turno estejam preenchidos. Abre a partir do chip "+ Nova turma" no formulário de observação.',
      },
    },
  },
  argTypes: {
    isLoading: {
      description: 'Exibe spinner no botão enquanto a turma está sendo criada na API.',
      control: {type: 'boolean'},
    },
    onConfirm: {action: 'confirmed'},
    onClose: {action: 'closed'},
  },
  args: {
    isOpen: false,
    onClose: noop,
    onConfirm: noop,
  },
} satisfies Meta<typeof NewClassBottomSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Docs: Story = {
  args: {
    isOpen: false,
    onClose: noop,
    onConfirm: noop,
  },
  render: () => (
    <DocNote
      title="NewClassBottomSheet"
      description="Sheet de criação rápida de turma usado dentro do formulário de observação."
      notes={[
        'O botão começa desabilitado até existir nome e turno.',
        'Ao fechar, o estado interno é limpo.',
        'Vale cobrir loading porque a criação pode bater na API antes de selecionar a turma nova automaticamente.',
      ]}
      props={[
        {name: 'isOpen', type: 'boolean', required: true, description: 'Controla a abertura do sheet.'},
        {name: 'onClose', type: '() => void', required: true, description: 'Fecha o sheet e reseta o formulário.'},
        {
          name: 'onConfirm',
          type: '(name, shift) => void',
          required: true,
          description: 'Recebe nome e turno da turma criada.',
        },
        {name: 'isLoading', type: 'boolean', description: 'Mostra loading no CTA principal.'},
      ]}
    />
  ),
};

export const Default: Story = {
  render: () => <DefaultNewClassBottomSheetStory />,
};

export const Loading: Story = {
  render: () => <LoadingNewClassBottomSheetStory />,
};

export const OpenInvalidState: Story = {
  args: {
    isOpen: true,
    onClose: noop,
    onConfirm: noop,
  },
};
