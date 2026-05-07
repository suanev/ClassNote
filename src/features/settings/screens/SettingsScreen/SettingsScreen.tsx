import React from 'react';
import {ScrollView} from 'react-native';
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

import {ThemePreference} from '@app/providers/ThemeContext';
import {formatLastSync} from '@shared/utils/date';
import {Container, Section, SectionLabel, Card, ClearButton, SectionsList} from './styles';

const SEGMENT_BUTTONS: {value: ThemePreference; label: string; icon: string}[] = [
  {value: 'light',  label: 'Claro',   icon: 'weather-sunny'},
  {value: 'dark',   label: 'Escuro',  icon: 'weather-night'},
  {value: 'system', label: 'Sistema', icon: 'theme-light-dark'},
];

interface SettingsScreenProps {
  preference:        ThemePreference;
  lastSync:          string | null;
  clearVisible:      boolean;
  onPreferenceChange: (pref: ThemePreference) => void;
  onClearPress:      () => void;
  onClearConfirm:    () => void;
  onClearDismiss:    () => void;
}

const SettingsScreen = ({
  preference,
  lastSync,
  clearVisible,
  onPreferenceChange,
  onClearPress,
  onClearConfirm,
  onClearDismiss,
}: SettingsScreenProps) => (
  <Container>
    <SectionsList>

      <Section>
        <SectionLabel variant="labelSmall">Aparência</SectionLabel>
        <SegmentedButtons
          value={preference}
          onValueChange={v => onPreferenceChange(v as ThemePreference)}
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
        <ClearButton
          mode="outlined"
          textColor="#DC2626"
          onPress={onClearPress}>
          Limpar cache local
        </ClearButton>
      </Section>

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

    </ScrollView>

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
          <Button onPress={onClearConfirm} textColor="#DC2626">
            Limpar
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  </Container>
);

export default SettingsScreen;
