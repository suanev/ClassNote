import { endpoints } from './endpoints';
import { api } from './api';
import { ApiItemResponse, ApiListResponse } from './types';
import { Observation, ObservationCreatePayload, ObservationUpsertPayload } from '../types/observations';

/***
 * Busca todas as observações na API.
 * Ex.: GET /observations.
 */
export const listObservations = async (): Promise<Observation[]> => {
  const response = await api.get<ApiListResponse<Observation>>(endpoints.observations);
  return response.data;
};

/***
 * Cria uma nova observação na API.
 * Ex.: POST /observations.
 */
export const createObservation = async (payload: ObservationCreatePayload): Promise<Observation> => {
  const response = await api.post<ApiItemResponse<Observation>>(endpoints.observations, payload);
  return response.data;
};

/***
 * Atualiza uma observação existente na API.
 * Ex.: PATCH /observations/:id.
 */
export const updateObservation = async (
  id: string,
  payload: ObservationUpsertPayload,
): Promise<Observation> => {
  const response = await api.patch<ApiItemResponse<Observation>>(
    `${endpoints.observations}/${id}`,
    payload,
  );
  return response.data;
};

/***
 * Remove uma observação da API.
 * Ex.: DELETE /observations/:id.
 */
export const deleteObservation = async (id: string): Promise<void> => {
  await api.delete(`${endpoints.observations}/${id}`);
};
