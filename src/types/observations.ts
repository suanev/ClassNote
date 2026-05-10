export type Observation = {
  id: string;
  student: string;
  className: string;
  classId?: string;
  text: string;
  createdAt: string;
  updatedAt: string;
  favorite: boolean;
};

export type ObservationDraft = {
  student: string;
  className: string;
  classId?: string;
  text: string;
};

export type ObservationUpsertPayload = ObservationDraft & {
  favorite?: boolean;
  updatedAt?: string;
};

export type ObservationCreatePayload = ObservationDraft & {
  favorite: boolean;
  createdAt: string;
  updatedAt: string;
};
