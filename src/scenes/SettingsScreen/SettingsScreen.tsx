import React from 'react';
import { Platform, Pressable } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from 'styled-components/native';

import { AppHeader, BottomSheet, Hint, ScreenContainer } from '@components/index';
import { Button } from '@components/Button';
import { SchoolClass } from '../../types/classes';
import { ThemePreference } from '@theme/ThemeContext';
import { APP_VERSION } from '@constants/appMetadata';
import { DEV_DEVICE_SYNC_NOTICE, ENV_LABEL, isDev } from '@constants/environment';
import { formatLastSync } from '@utils/date';

import {
  Card,
  ClassInfoContent,
  ClassRow,
  ClassRowName,
  ClassRowShift,
  ClassRowWrapper,
  Container,
  DeleteSheetActions,
  DeleteSheetBody,
  DeleteSheetDescription,
  DeleteSheetDescriptionStrong,
  DeleteSheetSection,
  DialogButtonContainer,
  Divider,
  ListItem,
  ListItemContent,
  ListItemDescription,
  ListItemIcon,
  ListItemTitle,
  Section,
  SectionLabel,
  SectionsList,
  SegmentedControl,
  SegmentedOption,
  SegmentedOptionLabel,
} from './styles';
import { AppIconVariant } from '@services/appIcon';

const normalizeForTestId = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();

const THEME_OPTIONS: Array<{ value: ThemePreference; label: string; icon: string }> = [
  { value: 'light', label: 'Claro', icon: 'sun' },
  { value: 'dark', label: 'Escuro', icon: 'moon' },
  { value: 'system', label: 'Sistema', icon: 'monitor' },
];

type PendingClassDeletion = {
  id: string;
  name: string;
  observationsCount: number;
};

interface SettingsScreenProps {
  preference: ThemePreference;
  lastSync: string | null;
  classes: SchoolClass[];
  classPendingDeletion: PendingClassDeletion | null;
  deleteClassErrorVisible: boolean;
  isDeletingClass: boolean;
  appIcon: AppIconVariant;
  onBack: () => void;
  onAppIconChange: (value: AppIconVariant) => void;
  onPreferenceChange: (value: ThemePreference) => void;
  onDeleteClass: (id: string) => void;
  onConfirmDeleteClass: () => void;
  onDismissDeleteClassSheet: () => void;
  onDismissDeleteClassErrorSheet: () => void;
  onOpenDesignSystem?: () => void;
}

const SettingsScreen = ({
  preference,
  lastSync,
  classes,
  classPendingDeletion,
  deleteClassErrorVisible,
  isDeletingClass,
  appIcon,
  onBack,
  onAppIconChange,
  onPreferenceChange,
  onDeleteClass,
  onConfirmDeleteClass,
  onDismissDeleteClassSheet,
  onDismissDeleteClassErrorSheet,
  onOpenDesignSystem,
}: SettingsScreenProps) => {
  const theme = useTheme();
  const deleteObservationsLabel = classPendingDeletion?.observationsCount === 1
    ? '1 observação'
    : `${classPendingDeletion?.observationsCount ?? 0} observações`;
  const deleteTitle = classPendingDeletion?.observationsCount
    ? 'Excluir turma e observações?'
    : 'Excluir turma?';

  return (
    <ScreenContainer>
      <AppHeader mode="navigation" title="Ajustes" onBack={onBack} />
      <Container>
        <SectionsList>
          <Section>
            <SectionLabel>APARÊNCIA</SectionLabel>
            <SegmentedControl>
              {THEME_OPTIONS.map((option) => {
                const isActive = preference === option.value;
                return (
                  <SegmentedOption
                    key={option.value}
                    active={isActive}
                    onPress={() => onPreferenceChange(option.value)}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: isActive }}
                    accessibilityLabel={option.label}
                    testID={`theme-option-${option.value}`}
                  >
                    <Feather
                      name={option.icon}
                      size={16}
                      color={isActive ? theme.colors.surface : theme.colors.textMutedStrong}
                    />
                    <SegmentedOptionLabel active={isActive}>{option.label}</SegmentedOptionLabel>
                  </SegmentedOption>
                );
              })}
            </SegmentedControl>

            <Hint>Preferência salva localmente.</Hint>

            <SectionLabel>Ícone do app</SectionLabel>
            <SegmentedControl>
              {[
                { value: 'default', label: 'Padrão', icon: 'image-outline' },
                { value: 'second_option', label: 'Alternativo', icon: 'image-multiple-outline' },
              ].map((option) => {
                const isActive = appIcon === option.value;
                return (
                  <SegmentedOption
                    key={option.value}
                    active={isActive}
                    onPress={() => onAppIconChange(option.value as AppIconVariant)}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: isActive }}
                    accessibilityLabel={option.label}
                    testID={`app-icon-option-${option.value}`}
                  >
                    <MaterialCommunityIcons
                      name={option.icon}
                      size={16}
                      color={isActive ? theme.colors.surface : theme.colors.textMutedStrong}
                    />
                    <SegmentedOptionLabel active={isActive}>{option.label}</SegmentedOptionLabel>
                  </SegmentedOption>
                );
              })}
            </SegmentedControl>
            <Hint testID="app-icon-hint">
              {Platform.OS === 'ios'
                ? 'O sistema vai exibir um alerta e reiniciar o app para aplicar o ícone — isso é normal.'
                : 'O novo ícone aparece no launcher em instantes. Feche e abra o app para confirmar a mudança.'}
            </Hint>
          </Section>

          <Section>
            <SectionLabel>MINHAS TURMAS</SectionLabel>
            <Card>
              {classes.length === 0 ? (
                <ListItem>
                  <ListItemDescription>Nenhuma turma criada ainda.</ListItemDescription>
                </ListItem>
              ) : (
                classes.map((cls, index) => (
                  <ClassRowWrapper key={cls.id}>
                    {index > 0 ? <Divider /> : null}
                    <ClassRow testID={`class-row-${normalizeForTestId(cls.name)}`}>
                      <ClassInfoContent>
                        <ClassRowName>{cls.name}</ClassRowName>
                        <ClassRowShift>{cls.shift}</ClassRowShift>
                      </ClassInfoContent>
                      <Pressable
                        onPress={() => onDeleteClass(cls.id)}
                        disabled={isDeletingClass}
                        hitSlop={8}
                        accessibilityRole="button"
                        accessibilityLabel={`Apagar turma ${cls.name}`}
                        testID={`delete-class-${normalizeForTestId(cls.name)}`}
                      >
                        <Feather name="trash-2" size={18} color={theme.colors.danger} />
                      </Pressable>
                    </ClassRow>
                  </ClassRowWrapper>
                ))
              )}
            </Card>
          </Section>

          <Section>
            <SectionLabel>DADOS</SectionLabel>
            <Card>
              <ListItem>
                <ListItemIcon>
                  <Feather name="refresh-cw" size={18} color={theme.colors.textMutedStrong} />
                </ListItemIcon>
                <ListItemContent>
                  <ListItemTitle>Última sincronização</ListItemTitle>
                  <ListItemDescription>{formatLastSync(lastSync)}</ListItemDescription>
                </ListItemContent>
              </ListItem>
            </Card>
            {isDev ? <Hint testID="dev-sync-hint">{DEV_DEVICE_SYNC_NOTICE}</Hint> : null}
          </Section>

          {isDev && onOpenDesignSystem ? (
            <Section>
              <SectionLabel>DESENVOLVEDOR</SectionLabel>
              <Card>
                <Pressable
                  onPress={onOpenDesignSystem}
                  accessibilityRole="button"
                  accessibilityLabel="Abrir Design System"
                  testID="open-design-system-button"
                >
                  <ListItem>
                    <ListItemIcon>
                      <Feather name="layers" size={18} color={theme.colors.textMutedStrong} />
                    </ListItemIcon>
                    <ListItemContent>
                      <ListItemTitle>Design System</ListItemTitle>
                      <ListItemDescription>Componentes e stories</ListItemDescription>
                    </ListItemContent>
                    <Feather name="chevron-right" size={18} color={theme.colors.textMuted} />
                  </ListItem>
                </Pressable>
              </Card>
            </Section>
          ) : null}

          <Section>
            <SectionLabel>VERSÃO</SectionLabel>
            <Card>
              <ListItem>
                <ListItemIcon>
                  <MaterialCommunityIcons
                    name="information-outline"
                    size={18}
                    color={theme.colors.textMutedStrong}
                  />
                </ListItemIcon>
                <ListItemContent>
                  <ListItemTitle>ClassNotes</ListItemTitle>
                  <ListItemDescription>{`v${APP_VERSION}`}</ListItemDescription>
                </ListItemContent>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <MaterialCommunityIcons
                    name={isDev ? 'hammer-wrench' : 'rocket-launch-outline'}
                    size={18}
                    color={theme.colors.textMutedStrong}
                  />
                </ListItemIcon>
                <ListItemContent>
                  <ListItemTitle>Ambiente</ListItemTitle>
                  <ListItemDescription>{ENV_LABEL}</ListItemDescription>
                </ListItemContent>
              </ListItem>
            </Card>
          </Section>
        </SectionsList>

        <BottomSheet
          isOpen={classPendingDeletion !== null}
          disableClose={isDeletingClass}
          onClose={onDismissDeleteClassSheet}
          title={deleteTitle}
        >
          <DeleteSheetBody>
            <DeleteSheetSection>
              {classPendingDeletion?.observationsCount ? (
                <DeleteSheetDescription>
                  Na turma {classPendingDeletion.name} existem{' '}
                  <DeleteSheetDescriptionStrong>
                    {deleteObservationsLabel}
                  </DeleteSheetDescriptionStrong>{' '}
                  que também serão excluídas. Essa ação é permanente.
                </DeleteSheetDescription>
              ) : (
                <DeleteSheetDescription>
                  A turma {classPendingDeletion?.name ?? ''} será excluída. Essa ação é permanente.
                </DeleteSheetDescription>
              )}
            </DeleteSheetSection>
            <DeleteSheetActions>
              <DialogButtonContainer>
                <Button
                  variant="secondary"
                  onPress={onDismissDeleteClassSheet}
                  disabled={isDeletingClass}
                  testID="cancel-delete-class-button">
                  Cancelar
                </Button>
              </DialogButtonContainer>
              <DialogButtonContainer>
                <Button
                  variant="dangerStrong"
                  onPress={onConfirmDeleteClass}
                  loading={isDeletingClass}
                  disabled={isDeletingClass}
                  testID="confirm-delete-class-button">
                  Excluir
                </Button>
              </DialogButtonContainer>
            </DeleteSheetActions>
          </DeleteSheetBody>
        </BottomSheet>

        <BottomSheet
          isOpen={deleteClassErrorVisible}
          onClose={onDismissDeleteClassErrorSheet}
          title="Não foi possível apagar a turma"
        >
          <DeleteSheetBody>
            <DeleteSheetSection>
              <DeleteSheetDescription>
                Tente novamente em instantes.
              </DeleteSheetDescription>
            </DeleteSheetSection>
            <DeleteSheetActions>
              <DialogButtonContainer>
                <Button
                  onPress={onDismissDeleteClassErrorSheet}
                  testID="delete-class-error-close-button"
                >
                  Fechar
                </Button>
              </DialogButtonContainer>
            </DeleteSheetActions>
          </DeleteSheetBody>
        </BottomSheet>
      </Container>
    </ScreenContainer>
  );
};

export default SettingsScreen;
