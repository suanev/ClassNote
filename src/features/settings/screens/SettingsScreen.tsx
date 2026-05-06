import React, {useCallback, useEffect, useState} from 'react';
import {Alert, ScrollView, TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {useThemeContext, ThemePreference} from '@app/providers/ThemeContext';
import {version} from '../../../../package.json';

// ---------------------------------------------------------------------------
// Styled components
// ---------------------------------------------------------------------------

const Container = styled.View`
  flex: 1;
  background-color: ${({theme}) => theme.colors.background};
`;

const Section = styled.View`
  margin-top: ${({theme}) => theme.spacing.lg}px;
  margin-horizontal: ${({theme}) => theme.spacing.md}px;
`;

const SectionTitle = styled.Text`
  font-size: ${({theme}) => theme.typography.fontSizes.sm}px;
  font-weight: ${({theme}) => theme.typography.fontWeights.semibold};
  color: ${({theme}) => theme.colors.mutedText};
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-bottom: ${({theme}) => theme.spacing.sm}px;
`;

const Card = styled.View`
  background-color: ${({theme}) => theme.colors.surface};
  border-radius: 12px;
  overflow: hidden;
  border-width: 1px;
  border-color: ${({theme}) => theme.colors.border};
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  padding: ${({theme}) => theme.spacing.md}px;
`;

const RowDivider = styled.View`
  height: 1px;
  background-color: ${({theme}) => theme.colors.border};
  margin-left: ${({theme}) => theme.spacing.md}px;
`;

const RowLabel = styled.Text`
  font-size: ${({theme}) => theme.typography.fontSizes.md}px;
  color: ${({theme}) => theme.colors.text};
  flex: 1;
`;

const RowValue = styled.Text`
  font-size: ${({theme}) => theme.typography.fontSizes.md}px;
  color: ${({theme}) => theme.colors.mutedText};
`;

const ChipRow = styled.View`
  flex-direction: row;
  gap: 8px;
  padding: ${({theme}) => theme.spacing.md}px;
`;

const Chip = styled(TouchableOpacity)<{selected: boolean}>`
  flex: 1;
  padding-vertical: 8px;
  border-radius: 8px;
  align-items: center;
  border-width: 1.5px;
  border-color: ${({theme, selected}) =>
    selected ? theme.colors.primary : theme.colors.border};
  background-color: ${({theme, selected}) =>
    selected ? `${theme.colors.primary}18` : theme.colors.surface};
`;

const ChipText = styled.Text<{selected: boolean}>`
  font-size: ${({theme}) => theme.typography.fontSizes.sm}px;
  font-weight: ${({theme}) => theme.typography.fontWeights.semibold};
  color: ${({theme, selected}) =>
    selected ? theme.colors.primary : theme.colors.mutedText};
`;

const DangerButton = styled(TouchableOpacity)`
  margin-top: ${({theme}) => theme.spacing.md}px;
  padding: ${({theme}) => theme.spacing.md}px;
  border-radius: 12px;
  align-items: center;
  background-color: #FEE2E2;
  border-width: 1px;
  border-color: #FECACA;
`;

const DangerText = styled.Text`
  font-size: ${({theme}) => theme.typography.fontSizes.md}px;
  font-weight: ${({theme}) => theme.typography.fontWeights.semibold};
  color: #DC2626;
`;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const LAST_SYNC_KEY = '@TeacherApp:lastSync';

const PREFERENCE_LABELS: Record<ThemePreference, string> = {
  light: 'Claro',
  dark: 'Escuro',
  system: 'Sistema',
};

function formatLastSync(iso: string | null): string {
  if (!iso) {
    return 'Nunca sincronizado';
  }
  const date = new Date(iso);
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

export function SettingsScreen(): React.JSX.Element {
  const {preference, setPreference} = useThemeContext();
  const [lastSync, setLastSync] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(LAST_SYNC_KEY).then(val => setLastSync(val));
  }, []);

  const handleClearCache = useCallback(() => {
    Alert.alert(
      'Limpar cache',
      'Os dados locais serão removidos. Você precisará de conexão para recarregá-los.',
      [
        {text: 'Cancelar', style: 'cancel'},
        {
          text: 'Limpar',
          style: 'destructive',
          onPress: async () => {
            const allKeys = await AsyncStorage.getAllKeys();
            const appKeys = allKeys.filter(k => k.startsWith('@TeacherApp:'));
            await AsyncStorage.multiRemove(appKeys);
            setLastSync(null);
          },
        },
      ],
    );
  }, []);

  return (
    <Container>
      <ScrollView contentContainerStyle={{paddingBottom: 40}}>

        {/* Aparência */}
        <Section>
          <SectionTitle>Aparência</SectionTitle>
          <Card>
            <ChipRow>
              {(['light', 'dark', 'system'] as ThemePreference[]).map(pref => (
                <Chip
                  key={pref}
                  selected={preference === pref}
                  onPress={() => setPreference(pref)}
                  activeOpacity={0.7}>
                  <ChipText selected={preference === pref}>
                    {PREFERENCE_LABELS[pref]}
                  </ChipText>
                </Chip>
              ))}
            </ChipRow>
          </Card>
        </Section>

        {/* Dados */}
        <Section>
          <SectionTitle>Dados</SectionTitle>
          <Card>
            <Row>
              <RowLabel>Última sincronização</RowLabel>
              <RowValue>{formatLastSync(lastSync)}</RowValue>
            </Row>
          </Card>
          <DangerButton onPress={handleClearCache} activeOpacity={0.8}>
            <DangerText>Limpar cache local</DangerText>
          </DangerButton>
        </Section>

        {/* Versão */}
        <Section>
          <SectionTitle>Versão</SectionTitle>
          <Card>
            <Row>
              <RowLabel>Teacher Observations</RowLabel>
              <RowValue>v{version}</RowValue>
            </Row>
            <RowDivider />
            <Row>
              <RowLabel>Ambiente</RowLabel>
              <RowValue>{__DEV__ ? 'Desenvolvimento' : 'Produção'}</RowValue>
            </Row>
          </Card>
        </Section>

      </ScrollView>
    </Container>
  );
}
