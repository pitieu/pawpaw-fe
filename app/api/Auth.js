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

export const login = async (phone, phoneExt, password) => {
  try {
    const response = await axios({
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
    return response;
  } catch (error) {
    // console.log(error);
    // console.log(error.response.data);
    return error.response.data;
  }
};

export const register = async (username, phone, phoneExt, password) => {
  try {
    const response = await axios({
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
    return response;
  } catch (error) {
    // console.log(error);
    // console.log(error.response.data);
    return error.response.data;
  }
};
