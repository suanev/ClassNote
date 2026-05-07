import {format, formatDistanceToNow} from 'date-fns';
import {ptBR} from 'date-fns/locale';

export const formatObservationDate = (date: Date): string => date.toISOString();

export const formatCalendarHeading = (date: Date): string =>
  format(date, "EEEE, d 'de' MMMM", {locale: ptBR}).toLocaleUpperCase('pt-BR');

export const formatRelativeObservationTime = (iso: string): string =>
  formatDistanceToNow(new Date(iso), {
    addSuffix: true,
    locale: ptBR,
  });

export const formatLastSync = (iso: string | null): string => {
  if (!iso) {return 'Nunca sincronizado';}
  return new Date(iso).toLocaleString('pt-BR', {
    day:    '2-digit',
    month:  '2-digit',
    year:   'numeric',
    hour:   '2-digit',
    minute: '2-digit',
  });
};
