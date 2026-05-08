import React from 'react';
import {
  Button,
  Dialog,
  Divider,
  List,
  Portal,
  SegmentedButtons,
  Text,
} from 'react-native-paper';
import Config from 'react-native-config';
import {useTheme} from 'styled-components/native';

import {ThemePreference} from '@theme/ThemeContext';
import {formatLastSync} from '@utils/date';

import {Card, ClearButton, Container, Section, SectionLabel, SectionsList} from './styles';

const SEGMENT_BUTTONS: {value: ThemePreference; label: string; icon: string}[] = [
  {value: 'light', label: 'Claro', icon: 'weather-sunny'},
  {value: 'dark', label: 'Escuro', icon: 'weather-night'},
  {value: 'system', label: 'Sistema', icon: 'theme-light-dark'},
];

interface SettingsScreenProps {
  preference: ThemePreference;
  lastSync: string | null;
  clearVisible: boolean;
  onPreferenceChange: (value: ThemePreference) => void;
  onClearPress: () => void;
  onClearConfirm: () => void;
  onClearDismiss: () => void;
  onOpenDesignSystem?: () => void;
}

const SettingsScreen = ({
  preference,
  lastSync,
  clearVisible,
  onPreferenceChange,
  onClearPress,
  onClearConfirm,
  onClearDismiss,
  onOpenDesignSystem,
}: SettingsScreenProps) => {
  const theme = useTheme();

  return (
    <Container>
      <SectionsList>
        <Section>
          <SectionLabel variant="labelSmall">Aparência</SectionLabel>
          <SegmentedButtons
            value={preference}
            onValueChange={value => onPreferenceChange(value as ThemePreference)}
            buttons={SEGMENT_BUTTONS}
          />
        </Section>

        <Section>
          <SectionLabel variant="labelSmall">Dados</SectionLabel>
          <Card>
            <List.Item
              title="Última sincronização"
              description={formatLastSync(lastSync)}
              left={props => <List.Icon {...props} icon="sync" />}
            />
          </Card>
          <ClearButton mode="outlined" textColor={theme.colors.danger} onPress={onClearPress}>
            Limpar cache local
          </ClearButton>
        </Section>

        {__DEV__ && onOpenDesignSystem ? (
          <Section>
            <SectionLabel variant="labelSmall">Desenvolvedor</SectionLabel>
            <Card>
              <List.Item
                title="Design System"
                description="Componentes e stories do Storybook"
                left={props => <List.Icon {...props} icon="palette-outline" />}
                right={props => <List.Icon {...props} icon="chevron-right" />}
                onPress={onOpenDesignSystem}
                accessibilityRole="button"
                accessibilityLabel="Abrir Design System"
              />
            </Card>
          </Section>
        ) : null}

        <Section>
          <SectionLabel variant="labelSmall">Versão</SectionLabel>
          <Card>
            <List.Item
              title="ClassNotes"
              description={`v${Config.APP_VERSION}`}
              left={props => <List.Icon {...props} icon="information-outline" />}
            />
            <Divider />
            <List.Item
              title="Ambiente"
              description={__DEV__ ? 'Desenvolvimento' : 'Produção'}
              left={props => (
                <List.Icon {...props} icon={__DEV__ ? 'bug-outline' : 'rocket-launch-outline'} />
              )}
            />
          </Card>
        </Section>
      </SectionsList>

      <Portal>
        <Dialog visible={clearVisible} onDismiss={onClearDismiss}>
          <Dialog.Title>Limpar cache</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Os dados locais serão removidos. Você precisará de conexão para recarregá-los.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={onClearDismiss}>Cancelar</Button>
            <Button onPress={onClearConfirm} textColor={theme.colors.danger}>
              Limpar
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </Container>
  );
};

export default SettingsScreen;
