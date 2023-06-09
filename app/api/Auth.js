// import dependencies
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import I18n from '../assets/i18n/i18n';

// config
import config from '../config';

export const getToken = async () => {
  return await AsyncStorage.getItem('@access_token');
};

export const auth = async navigation => {
  const token = await getToken();
  if (!token) {
    navigation.navigate('SignIn');
  } else {
  }
};

export const logout = async () => {
  await AsyncStorage.removeItem('@access_token');
  await AsyncStorage.removeItem('@refresh_token');
};

export const callLogin = async (phone, phoneExt, password) => {
  try {
    return axios({
      url: `${config.api_address}auth/login`,
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': I18n.language,
      },
      method: 'get',
      params: {
        phone_ext: phoneExt,
        phone: phone,
        password: password,
      },
    });
  } catch (error) {
    return Promise.reject(error);
  }
};

export const callRegister = async (username, phone, phoneExt, password) => {
  try {
    return axios({
      url: `${config.api_address}auth/register`,
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': I18n.language,
      },
      method: 'post',
      data: {
        username: username,
        phone_ext: phoneExt,
        phone: phone,
        password: password,
      },
    });
  } catch (error) {
    return Promise.reject(error);
  }
};
