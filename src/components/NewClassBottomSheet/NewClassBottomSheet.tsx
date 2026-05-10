import React, {useState} from 'react';

import {ClassShift, SchoolClass} from '../../types/classes';
import {BottomSheet} from '@components/BottomSheet';
import {Button} from '@components/Button';
import {Chip} from '@components/Chip';
import {Input} from '@components/Input';

import {
  ButtonContainer,
  ChipsRow,
  FooterRow,
  SectionLabel,
  ShiftSection,
} from './styles';

const SHIFTS: Array<{label: string; value: ClassShift}> = [
  {label: 'Manhã', value: 'Manhã'},
  {label: 'Tarde', value: 'Tarde'},
  {label: 'Noite', value: 'Noite'},
  {label: 'Outro', value: 'Outro'},
];

interface NewClassBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (name: string, shift: SchoolClass['shift']) => void;
  isLoading?: boolean;
}

export const NewClassBottomSheet = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: NewClassBottomSheetProps) => {
  const [name, setName] = useState('');
  const [shift, setShift] = useState<ClassShift | null>(null);
  const normalizeForTestId = (value: string) => {
    const normalized = value.normalize('NFD').toLowerCase();
    let result = '';
    let lastWasHyphen = false;

    for (const char of normalized) {
      const code = char.charCodeAt(0);
      const isDigit = code >= 48 && code <= 57;
      const isLowercaseLetter = code >= 97 && code <= 122;

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

    return lastWasHyphen ? result.slice(0, -1) : result;
  };

  const canSubmit = name.trim().length > 0 && shift !== null;

  const handleConfirm = () => {
    if (!canSubmit || shift === null) return;
    onConfirm(name.trim(), shift);
    setName('');
    setShift(null);
  };

  const handleClose = () => {
    setName('');
    setShift(null);
    onClose();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={handleClose} title="Nova turma">
      <Input
        placeholder="ex. 2º Ano A"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
        testID="new-class-name-input"
      />

      <ShiftSection>
        <SectionLabel>TURNO</SectionLabel>
        <ChipsRow>
          {SHIFTS.map(({label, value}) => (
            <Chip
              key={value}
              label={label}
              active={shift === value}
              onPress={() => setShift(shift === value ? null : value)}
              testID={`new-class-shift-${normalizeForTestId(value)}`}
              accessibilityRole="radio"
              accessibilityState={{selected: shift === value}}
            />
          ))}
        </ChipsRow>
      </ShiftSection>

      <FooterRow>
        <ButtonContainer>
          <Button variant="secondary" onPress={handleClose} disabled={isLoading}>
            Cancelar
          </Button>
        </ButtonContainer>
        <ButtonContainer>
          <Button
            variant="primary"
            onPress={handleConfirm}
            disabled={!canSubmit}
            loading={isLoading}
            testID="create-class-confirm-button">
            Criar turma
          </Button>
        </ButtonContainer>
      </FooterRow>
    </BottomSheet>
  );
};
