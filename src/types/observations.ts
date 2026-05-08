export type ObservationClass = string;

export type Observation = {
  id: string;
  student: string;
  className: ObservationClass;
  text: string;
  createdAt: string;
  updatedAt: string;
  favorite: boolean;
};

export type ObservationDraft = {
  student: string;
  className: ObservationClass;
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
