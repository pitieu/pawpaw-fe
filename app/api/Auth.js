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
  await AsyncStorage.removeItem('@user');
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
    let userInfo = response.data.user;
    let account = response.data.user.selected_account;
    // userInfo.selected_account = account._id;
    AsyncStorage.setItem('@access_token', response.data.access_token);
    AsyncStorage.setItem('@refresh_token', response.data.refresh_token);
    AsyncStorage.setItem('@user', JSON.stringify(userInfo));
    AsyncStorage.setItem('@account', JSON.stringify(account));

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
