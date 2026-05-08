import { endpoints } from './endpoints';
import { api } from './api';
import { ApiListResponse } from './types';
import { SchoolClass } from '../types/classes';

/***
 * Busca todas as turmas na API.
 * Ex.: GET /classes.
 */
export const listClasses = async (): Promise<SchoolClass[]> => {
  const response = await api.get<ApiListResponse<SchoolClass>>(endpoints.classes);
  return response.data;
};
