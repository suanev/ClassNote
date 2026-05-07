export const formatObservationDate = (date: Date): string => date.toISOString();

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
