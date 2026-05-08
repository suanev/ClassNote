import React, {useState} from 'react';
import {Pressable, ScrollView} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from 'styled-components/native';

import {BottomSheet} from '@components/BottomSheet';
import {Button} from '@components/Button';
import {Input} from '@components/Input';
import {ScreenContainer} from '@components/ScreenContainer';
import {ObservationClass} from '../../types/observations';

import {
  ActionsRow,
  BackButton,
  BackLabel,
  ChipLabel,
  ChipPressable,
  ChipsRow,
  Container,
  Header,
  HeaderRow,
  HeaderTitle,
  Label,
  Section,
  SheetActions,
  SheetBody,
  SheetDescription,
} from './styles';

interface ObservationFormScreenProps {
  mode: 'create' | 'edit';
  student: string;
  className: ObservationClass;
  text: string;
  classOptions: ObservationClass[];
  isFavorite: boolean;
  isLoading: boolean;
  isDeleting?: boolean;
  onBackPress: () => void;
  onChangeStudent: (value: string) => void;
  onChangeClass: (value: ObservationClass) => void;
  onChangeText: (value: string) => void;
  onToggleFavorite: () => void;
  onSave: () => void;
  onDelete?: () => void;
}

const ObservationFormScreen = ({
  mode,
  student,
  className,
  text,
  classOptions,
  isFavorite,
  isLoading,
  isDeleting = false,
  onBackPress,
  onChangeStudent,
  onChangeClass,
  onChangeText,
  onToggleFavorite,
  onSave,
  onDelete,
}: ObservationFormScreenProps) => {
  const theme = useTheme();
  const [deleteSheetOpen, setDeleteSheetOpen] = useState(false);

  return (
    <ScreenContainer withBottom>
      <Container>
        <ScrollView
          contentContainerStyle={{paddingHorizontal: 20, paddingTop: 12, paddingBottom: 32}}
          showsVerticalScrollIndicator={false}>
          <Header>
            <HeaderRow>
              <BackButton
                onPress={onBackPress}
                accessibilityRole="button"
                accessibilityLabel="Voltar">
                <Feather name="chevron-left" size={18} color={theme.colors.text} />
                <BackLabel>Voltar</BackLabel>
              </BackButton>
              <Pressable
                onPress={onToggleFavorite}
                hitSlop={10}
                accessibilityLabel={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                accessibilityRole="button"
                testID="favorite-toggle">
                <MaterialCommunityIcons
                  name={isFavorite ? 'star' : 'star-outline'}
                  size={24}
                  color={isFavorite ? theme.colors.favorite : theme.colors.textSubtle}
                />
              </Pressable>
            </HeaderRow>
            <HeaderTitle>
              {mode === 'create' ? 'Nova observação' : 'Editar observação'}
            </HeaderTitle>
          </Header>

          <Section>
            <Label>Aluno</Label>
            <Input
              placeholder="Nome do aluno"
              value={student}
              onChangeText={onChangeStudent}
            />
          </Section>

          <Section>
            <Label>Turma</Label>
            <ChipsRow>
              {classOptions.map(option => {
                const isActive = option === className;
                return (
                  <ChipPressable
                    key={option}
                    $active={isActive}
                    onPress={() => onChangeClass(option)}
                    accessibilityRole="radio"
                    accessibilityState={{selected: isActive}}
                    accessibilityLabel={option}>
                    <ChipLabel $active={isActive}>{option}</ChipLabel>
                  </ChipPressable>
                );
              })}
            </ChipsRow>
          </Section>

          <Section>
            <Label>Observação</Label>
            <Input
              placeholder="Descreva o que aconteceu em sala, com contexto e próximos passos."
              value={text}
              onChangeText={onChangeText}
              multiline
              numberOfLines={6}
            />
          </Section>

          <Section>
            {mode === 'edit' && onDelete ? (
              <ActionsRow>
                <Button
                  variant="danger"
                  icon="trash-2"
                  accessibilityLabel="Apagar observação"
                  testID="delete-observation-button"
                  onPress={() => setDeleteSheetOpen(true)}
                  disabled={isDeleting || isLoading}
                  loading={isDeleting}
                />
                <Button
                  onPress={onSave}
                  loading={isLoading}
                  disabled={isDeleting}>
                  Atualizar observação
                </Button>
              </ActionsRow>
            ) : (
              <Button onPress={onSave} loading={isLoading}>
                Salvar observação
              </Button>
            )}
          </Section>
        </ScrollView>
      </Container>

      {mode === 'edit' && onDelete ? (
        <BottomSheet
          isOpen={deleteSheetOpen}
          onClose={() => setDeleteSheetOpen(false)}
          title="Apagar observação?">
          <SheetBody>
            <SheetDescription>
              Essa ação não pode ser desfeita. A observação será removida permanentemente.
            </SheetDescription>
            <SheetActions>
              <Button
                variant="outline"
                onPress={() => setDeleteSheetOpen(false)}>
                Cancelar
              </Button>
              <Button
                variant="danger"
                onPress={() => {
                  setDeleteSheetOpen(false);
                  onDelete();
                }}
                disabled={isDeleting}>
                Apagar
              </Button>
            </SheetActions>
          </SheetBody>
        </BottomSheet>
      ) : null}
    </ScreenContainer>
  );
};

export default ObservationFormScreen;
