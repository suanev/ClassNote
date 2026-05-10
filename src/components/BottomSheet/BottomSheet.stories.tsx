import React, {useState} from 'react';
import {Text, View} from 'react-native';
import type {Meta, StoryObj} from '@storybook/react';
import {useTheme} from 'styled-components/native';

import {DocNote} from '../../../.storybook/DocNote';
import {Button} from '@components/Button';
import {BottomSheet} from './BottomSheet';

const noop = () => {};

const meta = {
  title: 'Components/BottomSheet',
  component: BottomSheet,
  parameters: {
    docs: {
      description: {
        component:
          'Modal deslizante de baixo para cima baseado em `@gorhom/bottom-sheet`. Altura dinâmica (até 85 % da tela). Handle de 40×4 px no topo, título em Newsreader 22/500, backdrop semitransparente. Fecha ao arrastar para baixo, pressionar o backdrop ou chamar `onClose`.',
      },
    },
  },
  argTypes: {
    title: {description: 'Título exibido no cabeçalho do sheet.', control: {type: 'text'}},
    isOpen: {description: 'Controla a visibilidade do sheet.', control: {type: 'boolean'}},
    onClose: {action: 'closed'},
  },
  args: {
    isOpen: false,
    onClose: noop,
    children: null,
  },
} satisfies Meta<typeof BottomSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

const SheetText = ({children}: {children: React.ReactNode}) => {
  const theme = useTheme();
  return (
    <Text style={{padding: 16, color: theme.colors.textMutedStrong, lineHeight: 22}}>
      {children}
    </Text>
  );
};

const DefaultBottomSheetStory = () => {
  const [open, setOpen] = useState(false);
  return (
    <View style={{padding: 24}}>
      <Button variant="primary" onPress={() => setOpen(true)}>
        Abrir sheet
      </Button>
      <BottomSheet isOpen={open} onClose={() => setOpen(false)} title="Título do sheet">
        <SheetText>Conteúdo do bottom sheet.</SheetText>
      </BottomSheet>
    </View>
  );
};

const WithoutTitleBottomSheetStory = () => {
  const [open, setOpen] = useState(false);
  return (
    <View style={{padding: 24}}>
      <Button variant="secondary" onPress={() => setOpen(true)}>
        Sheet sem título
      </Button>
      <BottomSheet isOpen={open} onClose={() => setOpen(false)}>
        <SheetText>Sheet sem cabeçalho.</SheetText>
      </BottomSheet>
    </View>
  );
};

const TallContentBottomSheetStory = () => {
  const [open, setOpen] = useState(false);
  return (
    <View style={{padding: 24}}>
      <Button variant="primary" onPress={() => setOpen(true)}>
        Sheet com conteúdo longo
      </Button>
      <BottomSheet isOpen={open} onClose={() => setOpen(false)} title="Conteúdo longo">
        <View style={{padding: 16, gap: 12}}>
          {Array.from({length: 10}, (_, i) => (
            <SheetText key={i}>Linha de conteúdo {i + 1}</SheetText>
          ))}
        </View>
      </BottomSheet>
    </View>
  );
};

const DisableCloseBottomSheetStory = () => {
  const [open, setOpen] = useState(false);
  return (
    <View style={{padding: 24}}>
      <Button variant="dangerSolid" onPress={() => setOpen(true)}>
        Abrir confirmação crítica
      </Button>
      <BottomSheet
        isOpen={open}
        disableClose
        onClose={() => setOpen(false)}
        title="Excluir observações?"
      >
        <View style={{paddingTop: 8, gap: 20}}>
          <SheetText>
            Durante uma ação destrutiva em andamento, o usuário não deve conseguir fechar o sheet por gesto ou backdrop.
          </SheetText>
          <View style={{flexDirection: 'row', gap: 12, paddingHorizontal: 16, paddingBottom: 16}}>
            <View style={{flex: 1}}>
              <Button variant="secondary" onPress={noop} disabled>
                Cancelar
              </Button>
            </View>
            <View style={{flex: 1}}>
              <Button variant="dangerStrong" onPress={noop} loading>
                Excluindo
              </Button>
            </View>
          </View>
        </View>
      </BottomSheet>
    </View>
  );
};

export const Docs: Story = {
  args: {
    isOpen: false,
    onClose: noop,
  },
  render: () => (
    <DocNote
      title="BottomSheet"
      description="Container reutilizável para confirmações, filtros e formulários curtos do app."
      notes={[
        'Usado como padrão no lugar de Alert/Modal nativo.',
        'Pode receber título, ação no header e bloqueio de fechamento com disableClose.',
        'Precisa acomodar CTA primária e secundária sem quebrar no dark mode.',
      ]}
      props={[
        {name: 'isOpen', type: 'boolean', required: true, description: 'Controla a abertura do sheet.'},
        {name: 'onClose', type: '() => void', required: true, description: 'Callback disparado ao fechar.'},
        {name: 'title', type: 'string', description: 'Título opcional do cabeçalho.'},
        {name: 'headerAction', type: 'ReactNode', description: 'Ação opcional no topo à direita.'},
        {name: 'disableClose', type: 'boolean', description: 'Bloqueia gesto, backdrop e dismiss enquanto uma ação crítica estiver em progresso.'},
      ]}
    />
  ),
};

export const Default: Story = {
  render: () => <DefaultBottomSheetStory />,
};

export const WithoutTitle: Story = {
  render: () => <WithoutTitleBottomSheetStory />,
};

export const TallContent: Story = {
  render: () => <TallContentBottomSheetStory />,
};

export const DisableCloseDuringAction: Story = {
  render: () => <DisableCloseBottomSheetStory />,
};
