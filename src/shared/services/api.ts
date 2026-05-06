import axios from 'axios';
import Config from 'react-native-config';

export const api = axios.create({
  baseURL: Config.API_BASE_URL ?? 'http://localhost:3001',
  timeout: 10000,
});
