import React from 'react';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from 'styled-components/native';

import {ObservationSortOrder} from '@store/observations/slice';
import {BottomSheet} from '@components/BottomSheet';

import {
  ChipLabel,
  ChipPressable,
  ChipsRow,
  HeaderResetAction,
  HeaderResetLabel,
  Section,
  SectionTitle,
  SortOption,
  SortOptionLabel,
} from './styles';

interface FilterBottomSheetProps {
  filterByClass: string | null;
  filterByFavorites: boolean;
  availableClasses: string[];
  isOpen: boolean;
  sortOrder: ObservationSortOrder;
  onClose: () => void;
  onReset: () => void;
  onSelectClass: (value: string | null) => void;
  onToggleFavorites: () => void;
  onSelectSortOrder: (value: ObservationSortOrder) => void;
}

const SORT_OPTIONS: Array<{label: string; value: ObservationSortOrder}> = [
  {label: 'Mais recentes primeiro', value: 'recent-first'},
  {label: 'Mais antigas primeiro', value: 'old-first'},
  {label: 'Favoritas primeiro', value: 'favorites-first'},
];

export const FilterBottomSheet = ({
  filterByClass,
  filterByFavorites,
  availableClasses,
  isOpen,
  sortOrder,
  onClose,
  onReset,
  onSelectClass,
  onToggleFavorites,
  onSelectSortOrder,
}: FilterBottomSheetProps) => {
  const theme = useTheme();

  return (
    <BottomSheet
      headerAction={
        <HeaderResetAction
          onPress={onReset}
          testID="reset-filters-button"
          accessibilityRole="button"
          accessibilityLabel="Limpar filtros">
          <Feather name="x" size={14} color={theme.colors.danger} />
          <HeaderResetLabel>Limpar filtros</HeaderResetLabel>
        </HeaderResetAction>
      }
      isOpen={isOpen}
      onClose={onClose}
      title="Filtros">

      <Section>
        <SectionTitle>Turma</SectionTitle>
        <ChipsRow>
          <ChipPressable
            active={filterByClass === null}
            onPress={() => onSelectClass(null)}
            accessibilityRole="radio"
            accessibilityState={{selected: filterByClass === null}}
            accessibilityLabel="Todas as turmas">
            <ChipLabel active={filterByClass === null}>Todas</ChipLabel>
          </ChipPressable>

          {availableClasses.map(cls => {
            const isActive = cls === filterByClass;
            return (
              <ChipPressable
                key={cls}
                active={isActive}
                onPress={() => onSelectClass(isActive ? null : cls)}
                accessibilityRole="radio"
                accessibilityState={{selected: isActive}}
                accessibilityLabel={cls}>
                <ChipLabel active={isActive}>{cls}</ChipLabel>
              </ChipPressable>
            );
          })}
        </ChipsRow>
      </Section>

      <Section>
        <SectionTitle>Tipo</SectionTitle>
        <ChipsRow>
          <ChipPressable
            active={filterByFavorites}
            onPress={onToggleFavorites}
            testID="favorites-filter-chip"
            accessibilityRole="checkbox"
            accessibilityState={{checked: filterByFavorites}}
            accessibilityLabel="Somente favoritas">
            <MaterialCommunityIcons
              name={filterByFavorites ? 'star' : 'star-outline'}
              size={16}
              color={filterByFavorites ? theme.colors.warning : theme.colors.textSubtle}
            />
            <ChipLabel active={filterByFavorites}>Somente favoritas</ChipLabel>
          </ChipPressable>
        </ChipsRow>
      </Section>

      <Section>
        <SectionTitle>Ordenação</SectionTitle>
        {SORT_OPTIONS.map(option => {
          const isActive = option.value === sortOrder;
          return (
            <SortOption
              key={option.value}
              active={isActive}
              onPress={() => onSelectSortOrder(option.value)}
              accessibilityRole="radio"
              accessibilityState={{selected: isActive}}
              accessibilityLabel={option.label}>
              <SortOptionLabel active={isActive}>{option.label}</SortOptionLabel>
            </SortOption>
          );
        })}
      </Section>

    </BottomSheet>
  );
};
