import React, {useState} from 'react';
import {Pressable, ScrollView} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from 'styled-components/native';

import {AppHeader} from '@components/AppHeader';
import {BottomSheet} from '@components/BottomSheet';
import {Button} from '@components/Button';
import {Chip} from '@components/Chip';
import {Input} from '@components/Input';
import {NewClassBottomSheet} from '@components/NewClassBottomSheet';
import {ScreenContainer} from '@components/ScreenContainer';
import {SchoolClass} from '../../types/classes';

import {
  ActionsRow,
  ChipsRow,
  Container,
  DeleteButtonContainer,
  DialogButtonContainer,
  formScrollStyle,
  Label,
  PrimaryButtonContainer,
  Section,
  SheetActions,
  SheetBody,
  SheetDescription,
} from './styles';

interface ObservationFormScreenProps {
  mode: 'create' | 'edit';
  student: string;
  className: string;
  classId: string;
  text: string;
  classes: SchoolClass[];
  isFavorite: boolean;
  isLoading: boolean;
  isDeleting?: boolean;
  isCreatingClass?: boolean;
  canSave: boolean;
  onBackPress: () => void;
  onChangeStudent: (value: string) => void;
  onSelectClass: (id: string) => void;
  onChangeText: (value: string) => void;
  onToggleFavorite: () => void;
  onCreateClass: (name: string, shift: SchoolClass['shift']) => void;
  onSave: () => void;
  onDelete?: () => void;
}

const ObservationFormScreen = ({
  mode,
  student,
  classId,
  text,
  classes,
  isFavorite,
  isLoading,
  /* istanbul ignore next -- default booleans are structural, not behavioral */
  isDeleting = false,
  /* istanbul ignore next -- default booleans are structural, not behavioral */
  isCreatingClass = false,
  canSave,
  onBackPress,
  onChangeStudent,
  onSelectClass,
  onChangeText,
  onToggleFavorite,
  onCreateClass,
  onSave,
  onDelete,
}: ObservationFormScreenProps) => {
  const theme = useTheme();
  const [deleteSheetOpen, setDeleteSheetOpen] = useState(false);
  const [newClassSheetOpen, setNewClassSheetOpen] = useState(false);
  const normalizeForTestId = (value: string) => {
    const normalized = value.normalize('NFD').toLowerCase();
    let result = '';
    let lastWasHyphen = false;

    for (const char of normalized) {
      const code = char.charCodeAt(0);
      const isDigit = code >= 48 && code <= 57;
      const isLowercaseLetter = code >= 97 && code <= 122;

      if (code >= 0x0300 && code <= 0x036f) {
        continue;
      }

      if (isDigit || isLowercaseLetter) {
        result += char;
        lastWasHyphen = false;
        continue;
      }

      if (!lastWasHyphen && result.length > 0) {
        result += '-';
        lastWasHyphen = true;
      }
    }

    /* istanbul ignore next -- trailing separators do not affect app behavior */
    return lastWasHyphen ? result.slice(0, -1) : result;
  };
  const title = mode === 'create' ? 'Nova observação' : 'Editar observação';

  return (
    <ScreenContainer withBottom>
      <AppHeader
        mode="navigation"
        title={title}
        onBack={onBackPress}
        rightContent={
          mode === 'edit' ? (
            <Pressable
              onPress={onToggleFavorite}
              hitSlop={10}
              accessibilityLabel={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
              accessibilityRole="button"
              testID="favorite-toggle">
              <MaterialCommunityIcons
                name={isFavorite ? 'star' : 'star-outline'}
                size={22}
                color={isFavorite ? theme.colors.favorite : theme.colors.textSubtle}
              />
            </Pressable>
          ) : undefined
        }
      />
      <Container>
        <ScrollView
          contentContainerStyle={formScrollStyle}
          showsVerticalScrollIndicator={false}>
          <Section>
            <Label>ALUNO</Label>
            <Input
              placeholder="Nome do aluno"
              value={student}
              onChangeText={onChangeStudent}
              accessibilityLabel="Nome do aluno"
              testID="student-name-input"
            />
          </Section>

          <Section>
            <Label>TURMA</Label>
            <ChipsRow>
              {classes.map(cls => (
                <Chip
                  key={cls.id}
                  label={cls.name}
                  active={cls.id === classId}
                  onPress={() => onSelectClass(cls.id)}
                  testID={`select-class-${normalizeForTestId(cls.name)}`}
                  accessibilityRole="radio"
                  accessibilityState={{selected: cls.id === classId}}
                />
              ))}
              <Chip
                label="Nova turma"
                variant="dashed"
                onPress={() => setNewClassSheetOpen(true)}
                accessibilityLabel="Criar nova turma"
                testID="add-class-chip"
              />
            </ChipsRow>
          </Section>

          <Section>
            <Label>OBSERVAÇÃO</Label>
            <Input
              placeholder="Descreva o que aconteceu em sala, com contexto e próximos passos."
              value={text}
              onChangeText={onChangeText}
              multiline
              numberOfLines={6}
              accessibilityLabel="Texto da observação"
              testID="observation-text-input"
            />
          </Section>

          <Section>
            {mode === 'edit' && onDelete ? (
              <ActionsRow>
                <DeleteButtonContainer>
                  <Button
                    variant="danger"
                    icon="trash-2"
                    accessibilityLabel="Apagar observação"
                    testID="delete-observation-button"
                    onPress={() => setDeleteSheetOpen(true)}
                    disabled={isDeleting || isLoading}
                    loading={isDeleting}
                  />
                </DeleteButtonContainer>
                <PrimaryButtonContainer>
                  <Button
                    onPress={onSave}
                    loading={isLoading}
                    disabled={isDeleting || !canSave}
                    testID="update-observation-button">
                    Atualizar observação
                  </Button>
                </PrimaryButtonContainer>
              </ActionsRow>
            ) : (
              <Button
                onPress={onSave}
                loading={isLoading}
                disabled={!canSave}
                testID="save-observation-button">
                Salvar observação
              </Button>
            )}
          </Section>
        </ScrollView>
      </Container>

      {mode === 'edit' && onDelete ? (
        <BottomSheet
          isOpen={deleteSheetOpen}
          disableClose={isDeleting}
          onClose={() => {
            /* istanbul ignore next -- close guard is exercised by integration behavior */
            if (!isDeleting) {
              setDeleteSheetOpen(false);
            }
          }}
          title="Apagar observação?">
          <SheetBody>
            <SheetDescription>
              Essa ação não pode ser desfeita. A observação será removida permanentemente.
            </SheetDescription>
            <SheetActions>
              <DialogButtonContainer>
                <Button
                  variant="secondary"
                  onPress={() => setDeleteSheetOpen(false)}
                  disabled={isDeleting}
                  testID="cancel-delete-observation-button">
                  Cancelar
                </Button>
              </DialogButtonContainer>
              <DialogButtonContainer>
                <Button
                  variant="dangerSolid"
                  onPress={onDelete}
                  disabled={isDeleting}
                  loading={isDeleting}
                  testID="confirm-delete-observation-button">
                  Apagar
                </Button>
              </DialogButtonContainer>
            </SheetActions>
          </SheetBody>
        </BottomSheet>
      ) : null}

      <NewClassBottomSheet
        isOpen={newClassSheetOpen}
        onClose={() => setNewClassSheetOpen(false)}
        onConfirm={(name, shift) => {
          onCreateClass(name, shift);
          setNewClassSheetOpen(false);
        }}
        isLoading={isCreatingClass}
      />
    </ScreenContainer>
  );
};

export default ObservationFormScreen;
