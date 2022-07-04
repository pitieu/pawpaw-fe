import {Platform} from 'react-native';

const baseUrl =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:1000'
    : 'http://192.168.18.249:1000';
console.log('Plaftorm', Platform.OS, baseUrl);
const config = {
  theme: 'main',
  api_address: baseUrl + '/api/v1/',
};

export default config;
