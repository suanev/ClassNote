import React, {useCallback, useEffect, useState} from 'react';
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
import styled from 'styled-components/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {useThemeContext, ThemePreference} from '@app/providers/ThemeContext';
import {version} from '../../../../package.json';

// ---------------------------------------------------------------------------
// Layout (styled-components) — sem nenhum componente interativo aqui
// ---------------------------------------------------------------------------

const Container = styled.View`
  flex: 1;
  background-color: ${({theme}) => theme.colors.background};
`;

const Section = styled.View`
  margin-top: ${({theme}) => theme.spacing.lg}px;
  margin-horizontal: ${({theme}) => theme.spacing.md}px;
`;

const SectionLabel = styled(Text)`
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-bottom: ${({theme}) => theme.spacing.sm}px;
  opacity: 0.55;
`;

const Card = styled.View`
  background-color: ${({theme}) => theme.colors.surface};
  border-radius: 12px;
  overflow: hidden;
  border-width: 1px;
  border-color: ${({theme}) => theme.colors.border};
`;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const LAST_SYNC_KEY = '@TeacherApp:lastSync';

const SEGMENT_BUTTONS: {value: ThemePreference; label: string; icon: string}[] = [
  {value: 'light',  label: 'Claro',   icon: 'weather-sunny'},
  {value: 'dark',   label: 'Escuro',  icon: 'weather-night'},
  {value: 'system', label: 'Sistema', icon: 'theme-light-dark'},
];

function formatLastSync(iso: string | null): string {
  if (!iso) {return 'Nunca sincronizado';}
  return new Date(iso).toLocaleString('pt-BR', {
    day:    '2-digit',
    month:  '2-digit',
    year:   'numeric',
    hour:   '2-digit',
    minute: '2-digit',
  });
}

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

export function SettingsScreen(): React.JSX.Element {
  const {preference, setPreference} = useThemeContext();
  const [lastSync,       setLastSync]       = useState<string | null>(null);
  const [clearVisible,   setClearVisible]   = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(LAST_SYNC_KEY).then(val => setLastSync(val));
  }, []);

  const handleClearConfirm = useCallback(async () => {
    const allKeys = await AsyncStorage.getAllKeys();
    const appKeys = allKeys.filter(k => k.startsWith('@TeacherApp:'));
    await Promise.all(appKeys.map(k => AsyncStorage.removeItem(k)));
    setLastSync(null);
    setClearVisible(false);
  }, []);

  return (
    <Container>
      <ScrollView contentContainerStyle={{paddingBottom: 40}}>

        {/* ── Aparência ────────────────────────────────────────────────── */}
        <Section>
          <SectionLabel variant="labelSmall">Aparência</SectionLabel>
          {/* SegmentedButtons do Paper: seleção exclusiva com ícone + label */}
          <SegmentedButtons
            value={preference}
            onValueChange={v => setPreference(v as ThemePreference)}
            buttons={SEGMENT_BUTTONS}
          />
        </Section>

        {/* ── Dados ────────────────────────────────────────────────────── */}
        <Section>
          <SectionLabel variant="labelSmall">Dados</SectionLabel>
          <Card>
            {/* List.Item do Paper: layout padronizado com suporte a right/left */}
            <List.Item
              title="Última sincronização"
              description={formatLastSync(lastSync)}
              left={props => <List.Icon {...props} icon="sync" />}
            />
          </Card>
          {/* Button outlined com cor de erro — sem styled para botão interativo */}
          <Button
            mode="outlined"
            textColor="#DC2626"
            style={{marginTop: 12, borderColor: '#FECACA'}}
            onPress={() => setClearVisible(true)}>
            Limpar cache local
          </Button>
        </Section>

        {/* ── Versão ───────────────────────────────────────────────────── */}
        <Section>
          <SectionLabel variant="labelSmall">Versão</SectionLabel>
          <Card>
            <List.Item
              title="Teacher Observations"
              description={`v${version}`}
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

      {/* Portal garante z-index correto acima de qualquer navigator */}
      <Portal>
        <Dialog visible={clearVisible} onDismiss={() => setClearVisible(false)}>
          <Dialog.Title>Limpar cache</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Os dados locais serão removidos. Você precisará de conexão para recarregá-los.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setClearVisible(false)}>Cancelar</Button>
            <Button onPress={handleClearConfirm} textColor="#DC2626">
              Limpar
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </Container>
  );
}
