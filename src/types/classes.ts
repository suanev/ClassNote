export type ClassShift = 'Manhã' | 'Tarde' | 'Noite' | 'Outro';

export type SchoolClass = {
  id: string;
  name: string;
  shift: ClassShift;
};

export type SchoolClassCreatePayload = {
  name: string;
  shift: ClassShift;
};
