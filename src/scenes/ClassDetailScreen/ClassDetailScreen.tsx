import React from 'react';
import {FlatList, Pressable} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from 'styled-components/native';

import {EmptyState, ScreenContainer} from '@components/index';

import {
  BackButton,
  BackLabel,
  ClassMeta,
  ClassName,
  EmptyStateWrapper,
  Header,
  HeaderRow,
  ObservationCard,
  ObservationFooter,
  ObservationStudent,
  ObservationText,
  ObservationTime,
  Screen,
  SectionLabel,
  StarIcon,
} from './styles';

export type ClassDetailObservation = {
  id: string;
  student: string;
  text: string;
  relativeTime: string;
  favorite: boolean;
};

interface ClassDetailScreenProps {
  className: string;
  shift: string;
  students: number;
  observations: ClassDetailObservation[];
  onBack: () => void;
  onPressObservation: (id: string) => void;
}

export function ClassDetailScreen({
  className,
  shift,
  students,
  observations,
  onBack,
  onPressObservation,
}: ClassDetailScreenProps): React.JSX.Element {
  const theme = useTheme();

  return (
    <ScreenContainer>
      <Screen>
        <FlatList
          data={observations}
          keyExtractor={item => item.id}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 12,
            paddingBottom: 40,
          }}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => (
            <Pressable
              onPress={() => onPressObservation(item.id)}
              accessibilityRole="button"
              accessibilityLabel={`Observação de ${item.student}`}>
              <ObservationCard>
                <HeaderRow>
                  <ObservationStudent>{item.student}</ObservationStudent>
                  {item.favorite && (
                    <StarIcon>
                      <MaterialCommunityIcons
                        name="star"
                        size={16}
                        color={theme.colors.favorite}
                      />
                    </StarIcon>
                  )}
                </HeaderRow>
                <ObservationText numberOfLines={3}>{item.text}</ObservationText>
                <ObservationFooter>
                  <ObservationTime>{item.relativeTime}</ObservationTime>
                </ObservationFooter>
              </ObservationCard>
            </Pressable>
          )}
          ListHeaderComponent={
            <Header>
              <BackButton
                onPress={onBack}
                accessibilityRole="button"
                accessibilityLabel="Voltar para Turmas">
                <Feather name="chevron-left" size={18} color={theme.colors.text} />
                <BackLabel>Turmas</BackLabel>
              </BackButton>
              <ClassName>{className}</ClassName>
              <ClassMeta>
                {shift} · {students} alunos
              </ClassMeta>
              <SectionLabel style={{marginTop: 24, marginBottom: 12}}>
                OBSERVAÇÕES
              </SectionLabel>
            </Header>
          }
          ListEmptyComponent={
            <EmptyStateWrapper>
              <EmptyState
                title="Sem observações ainda"
                description={`Nenhuma observação registrada para ${className}. Crie a primeira pela tela principal.`}
              />
            </EmptyStateWrapper>
          }
        />
      </Screen>
    </ScreenContainer>
  );
}
