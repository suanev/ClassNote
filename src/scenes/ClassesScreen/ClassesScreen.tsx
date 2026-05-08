import React from 'react';
import {FlatList, Pressable, ScrollView} from 'react-native';

import {Badge, Card, EmptyState, ScreenContainer} from '@components/index';

import {
  CardMeta,
  CardTitle,
  EmptyStateWrapper,
  HeaderRow,
  PageTitle,
  Screen,
  SectionLabel,
  SegmentButton,
  SegmentLabel,
  SegmentsRow,
  StatText,
  StatValue,
  SummaryRow,
} from './styles';

export type SegmentOption = 'Hoje' | 'Semana';

export type ClassItem = {
  id: string;
  name: string;
  shift: string;
  students: number;
  observationCount: number;
  lastObservation: string | null;
  hasActivityInPeriod: boolean;
};

interface ClassesScreenProps {
  selectedSegment: SegmentOption;
  onSelectSegment: (value: SegmentOption) => void;
  summary: {
    totalClasses: number;
    totalStudents: number;
  };
  classes: ClassItem[];
  onPressClass: (id: string, name: string) => void;
}

export function ClassesScreen({
  selectedSegment,
  onSelectSegment,
  summary,
  classes,
  onPressClass,
}: ClassesScreenProps): React.JSX.Element {
  return (
    <ScreenContainer>
      <Screen>
        <FlatList
          data={classes}
          keyExtractor={item => item.id}
          contentContainerStyle={{paddingHorizontal: 20, paddingTop: 12, paddingBottom: 40}}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => (
            <Pressable
              onPress={() => onPressClass(item.id, item.name)}
              accessibilityRole="button"
              accessibilityLabel={`Ver detalhes de ${item.name}`}>
              <Card variant="default" padding={18} style={{marginBottom: 12}}>
                <HeaderRow>
                  <CardTitle>{item.name}</CardTitle>
                  <Badge variant={item.hasActivityInPeriod ? 'success' : 'neutral'}>
                    {item.observationCount}{' '}
                    {item.observationCount === 1 ? 'registro' : 'registros'}
                  </Badge>
                </HeaderRow>
                <CardMeta>
                  {item.shift} · {item.students} alunos
                </CardMeta>
                {item.lastObservation ? (
                  <StatText numberOfLines={2}>{item.lastObservation}</StatText>
                ) : (
                  <StatText muted>Nenhuma observação recente</StatText>
                )}
              </Card>
            </Pressable>
          )}
          ListHeaderComponent={
            <>
              <HeaderRow>
                <SectionLabel>VISÃO GERAL</SectionLabel>
              </HeaderRow>

              <PageTitle>Turmas</PageTitle>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{paddingRight: 20}}>
                <SegmentsRow>
                  {(['Hoje', 'Semana'] as const).map(option => {
                    const active = option === selectedSegment;
                    return (
                      <SegmentButton
                        key={option}
                        $active={active}
                        onPress={() => onSelectSegment(option)}
                        accessibilityRole="tab"
                        accessibilityState={{selected: active}}
                        accessibilityLabel={option}>
                        <SegmentLabel $active={active}>{option}</SegmentLabel>
                      </SegmentButton>
                    );
                  })}
                </SegmentsRow>
              </ScrollView>

              <SummaryRow>
                <Card variant="dark" padding={18} style={{flex: 1}}>
                  <StatValue $inverse>{summary.totalClasses}</StatValue>
                  <StatText $inverse>Turmas acompanhadas</StatText>
                </Card>
                <Card variant="default" padding={18} style={{flex: 1}}>
                  <StatValue>{summary.totalStudents}</StatValue>
                  <StatText>Total de alunos</StatText>
                </Card>
              </SummaryRow>

              <SectionLabel style={{marginTop: 24, marginBottom: 12}}>
                LISTA DE TURMAS
              </SectionLabel>
            </>
          }
          ListEmptyComponent={
            <EmptyStateWrapper>
              <EmptyState
                title="Nenhuma turma por aqui"
                description="Quando turmas forem cadastradas no sistema, elas vão aparecer aqui."
              />
            </EmptyStateWrapper>
          }
        />
      </Screen>
    </ScreenContainer>
  );
}
