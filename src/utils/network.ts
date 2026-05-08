import axios from 'axios';

export const isNetworkError = (error: unknown): boolean =>
  axios.isAxiosError(error) && !error.response;
