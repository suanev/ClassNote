import React from 'react';
import {FlatList, RefreshControl, ScrollView} from 'react-native';
import {FAB, IconButton} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import {useTheme} from 'styled-components/native';

import {Badge, ObservationListItem} from '@components/index';

import {
  BodyText,
  CaptionText,
  ChipLabel,
  ChipPressable,
  ChipsRow,
  ContentContainer,
  HeaderRow,
  HeaderRight,
  Screen,
  SectionLabel,
  GreetingAccent,
  GreetingText,
  TitleText,
} from './styles';

type ClassFilterOption = {
  label: string;
  value: 'Todas' | '5º A' | '6º B' | '7º C';
};

type ObservationItemView = {
  id: string;
  student: string;
  className: string;
  text: string;
  relativeTime: string;
  favorite: boolean;
};

interface ObservationsScreenProps {
  dateLabel: string;
  greetingName: string;
  classFilters: ClassFilterOption[];
  selectedClass: ClassFilterOption['value'];
  onSelectClass: (value: ClassFilterOption['value']) => void;
  observations: ObservationItemView[];
  isRefreshing: boolean;
  onRefresh: () => void;
  onToggleFavorite: (id: string) => void;
  onCreateObservation: () => void;
}

export function ObservationsScreen({
  dateLabel,
  greetingName,
  classFilters,
  selectedClass,
  onSelectClass,
  observations,
  isRefreshing,
  onRefresh,
  onToggleFavorite,
  onCreateObservation,
}: ObservationsScreenProps): React.JSX.Element {
  const theme = useTheme();

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: theme.colors.bg}} edges={['top']}>
      <Screen>
        <FlatList
          data={observations}
          keyExtractor={item => item.id}
          contentContainerStyle={{paddingHorizontal: 20, paddingTop: 12, paddingBottom: 140}}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor={theme.colors.primary}
            />
          }
          renderItem={({item}) => (
            <ObservationListItem
              student={item.student}
              className={item.className}
              relativeTime={item.relativeTime}
              text={item.text}
              isFavorite={item.favorite}
              onToggleFavorite={() => onToggleFavorite(item.id)}
            />
          )}
          ListHeaderComponent={
            <ContentContainer>
              <HeaderRow>
                <CaptionText>{dateLabel}</CaptionText>
                <HeaderRight>
                  <Badge variant="success">Sincronizado</Badge>
                  <IconButton
                    icon={({size}) => (
                      <Feather name="bell" size={size} color={theme.colors.text} />
                    )}
                    size={20}
                    onPress={() => undefined}
                  />
                </HeaderRight>
              </HeaderRow>

              <TitleText>
                Observações
              </TitleText>
              <GreetingText>
                Olá, <GreetingAccent>{greetingName}</GreetingAccent>
              </GreetingText>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{paddingRight: 20}}>
                <ChipsRow>
                  {classFilters.map(filter => {
                    const isActive = filter.value === selectedClass;

                    return (
                      <ChipPressable
                        key={filter.value}
                        $active={isActive}
                        onPress={() => onSelectClass(filter.value)}>
                        <ChipLabel $active={isActive}>{filter.label}</ChipLabel>
                      </ChipPressable>
                    );
                  })}
                </ChipsRow>
              </ScrollView>

              <SectionLabel>OBSERVAÇÕES RECENTES</SectionLabel>
            </ContentContainer>
          }
          ListEmptyComponent={
            <BodyText>Nenhuma observação encontrada para sua busca.</BodyText>
          }
        />

        <FAB
          icon={({size, color}) => <Feather name="plus" size={size} color={color} />}
          onPress={onCreateObservation}
          style={{
            position: 'absolute',
            right: 24,
            bottom: 28,
            backgroundColor: theme.colors.primary,
            borderRadius: 9999,
          }}
          color={theme.colors.onPrimary}
          customSize={64}
        />
      </Screen>
    </SafeAreaView>
  );
}
