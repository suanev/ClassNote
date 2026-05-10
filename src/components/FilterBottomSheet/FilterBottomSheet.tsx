import React from 'react';
import Feather from 'react-native-vector-icons/Feather';
import {useTheme} from 'styled-components/native';

import {ClassShift, SchoolClass} from '../../types/classes';
import {ObservationSortOrder} from '@store/observations/slice';
import {BottomSheet} from '@components/BottomSheet';
import {Chip} from '@components/Chip';

import {
  ChipsRow,
  HeaderResetAction,
  HeaderResetLabel,
  RadioDot,
  RadioOuter,
  Section,
  SectionTitle,
  SortOption,
  SortOptionLabel,
  SortOptionRow,
} from './styles';

const SHIFTS: Array<{label: string; value: ClassShift | null}> = [
  {label: 'Todos', value: null},
  {label: 'Manhã', value: 'Manhã'},
  {label: 'Tarde', value: 'Tarde'},
  {label: 'Noite', value: 'Noite'},
  {label: 'Outro', value: 'Outro'},
];

const SORT_OPTIONS: Array<{label: string; value: ObservationSortOrder}> = [
  {label: 'Mais recentes primeiro', value: 'recent-first'},
  {label: 'Mais antigas primeiro', value: 'old-first'},
  {label: 'Favoritas primeiro', value: 'favorites-first'},
];

interface FilterBottomSheetProps {
  filterByShift: ClassShift | null;
  filterByClass: string | null;
  filterByFavorites: boolean;
  availableClasses: SchoolClass[];
  isOpen: boolean;
  sortOrder: ObservationSortOrder;
  onClose: () => void;
  onReset: () => void;
  onSelectShift: (value: ClassShift | null) => void;
  onSelectClass: (value: string | null) => void;
  onToggleFavorites: () => void;
  onSelectSortOrder: (value: ObservationSortOrder) => void;
}

export const FilterBottomSheet = ({
  filterByShift,
  filterByClass,
  filterByFavorites,
  availableClasses,
  isOpen,
  sortOrder,
  onClose,
  onReset,
  onSelectShift,
  onSelectClass,
  onToggleFavorites,
  onSelectSortOrder,
}: FilterBottomSheetProps) => {
  const theme = useTheme();
  const normalizeForTestId = (value: string) => {
    const normalized = value.normalize('NFD').toLowerCase();
    let result = '';
    let lastWasHyphen = false;

    for (const char of normalized) {
      const code = char.charCodeAt(0);
      const isDigit = code >= 48 && code <= 57;
      const isLowercaseLetter = code >= 97 && code <= 122;

      // Skip combining diacritical marks created by NFD normalization.
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
        <SectionTitle>TURNO</SectionTitle>
        <ChipsRow>
          {SHIFTS.map(({label, value}) => (
            <Chip
              key={label}
              label={label}
              active={filterByShift === value}
              onPress={() => onSelectShift(value)}
              testID={`shift-filter-${value === null ? 'all' : normalizeForTestId(value)}`}
              accessibilityRole="radio"
              accessibilityState={{selected: filterByShift === value}}
            />
          ))}
        </ChipsRow>
      </Section>

      <Section>
        <SectionTitle>TURMA</SectionTitle>
        <ChipsRow>
          <Chip
            label="Todas"
            active={filterByClass === null}
            onPress={() => onSelectClass(null)}
            testID="class-filter-all"
            accessibilityRole="radio"
            accessibilityState={{selected: filterByClass === null}}
            accessibilityLabel="Todas as turmas"
          />
          {availableClasses.map(cls => {
            const isActive = cls.id === filterByClass;
            return (
              <Chip
                key={cls.id}
                label={cls.name}
                active={isActive}
                onPress={() => onSelectClass(isActive ? null : cls.id)}
                testID={`class-filter-${normalizeForTestId(cls.name)}`}
                accessibilityRole="radio"
                accessibilityState={{selected: isActive}}
              />
            );
          })}
        </ChipsRow>
      </Section>

      <Section>
        <SectionTitle>TIPO</SectionTitle>
        <ChipsRow>
          <Chip
            label="Somente favoritas"
            active={filterByFavorites}
            onPress={onToggleFavorites}
            testID="favorites-filter-chip"
            accessibilityRole="checkbox"
            accessibilityState={{checked: filterByFavorites}}
          />
        </ChipsRow>
      </Section>

      <Section>
        <SectionTitle>ORDENAÇÃO</SectionTitle>
        {SORT_OPTIONS.map(option => {
          const isActive = option.value === sortOrder;
          return (
            <SortOption
              key={option.value}
              onPress={() => onSelectSortOrder(option.value)}
              testID={isActive ? `sort-order-selected-${option.value}` : `sort-order-${option.value}`}
              accessibilityRole="radio"
              accessibilityState={{selected: isActive}}
              accessibilityLabel={option.label}>
              <SortOptionRow>
                <RadioOuter active={isActive}>
                  {isActive ? <RadioDot /> : null}
                </RadioOuter>
                <SortOptionLabel active={isActive}>{option.label}</SortOptionLabel>
              </SortOptionRow>
            </SortOption>
          );
        })}
      </Section>

    </BottomSheet>
  );
};
