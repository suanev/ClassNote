import {api} from './api';
import {endpoints} from './endpoints';
import {ApiItemResponse, ApiListResponse} from './types';
import {SchoolClass, SchoolClassCreatePayload} from '../types/classes';

export const listClasses = async (): Promise<SchoolClass[]> => {
  const response = await api.get<ApiListResponse<SchoolClass>>(endpoints.classes);
  return response.data;
};

export const createClass = async (payload: SchoolClassCreatePayload): Promise<SchoolClass> => {
  const response = await api.post<ApiItemResponse<SchoolClass>>(endpoints.classes, payload);
  return response.data;
};

export const deleteClass = async (id: string): Promise<void> => {
  await api.delete(`${endpoints.classes}/${id}`);
};
