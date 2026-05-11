import axios from 'axios';
import {Platform} from 'react-native';
import Config from 'react-native-config';

const LOCAL_API_BASE_URL =
  Platform.OS === 'android' ? 'http://10.0.2.2:3001' : 'http://localhost:3001';

const configuredApiBaseUrl = Config.API_BASE_URL?.trim();

export const api = axios.create({
  baseURL: configuredApiBaseUrl || LOCAL_API_BASE_URL,
  timeout: 10000,
});
