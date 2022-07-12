// import dependencies
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import I18n from '../assets/i18n/i18n';
import {getToken} from './Auth';

// config
import config from '../config';

export const setUserSelectAccount = async account => {
  let user = await getUser();
  user.selected_account = account;
  return await AsyncStorage.setItem('@user', JSON.stringify(user));
};

export const getAccount = async () => {
  const account = await AsyncStorage.getItem('@account');
  if (account) {
    return JSON.parse(account);
  } else {
    return {};
  }
};

export const getUser = async () => {
  const user = await AsyncStorage.getItem('@user');
  if (user) {
    return JSON.parse(user);
  } else {
    return {};
  }
};

export const fetchUser = async () => {
  try {
    const token = await getToken();
    const response = await axios({
      url: `${config.api_address}accounts/fetch`,
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': I18n.language,
        'auth-token': token,
      },
      method: 'get',
      params: {},
    });
    return response;
  } catch (error) {
    console.log(error);
    return error.response.data;
  }
};

export const fetchAccounts = async () => {
  try {
    const token = await getToken();
    const response = await axios({
      url: `${config.api_address}accounts/`,
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': I18n.language,
        'auth-token': token,
      },
      method: 'get',
      params: {},
    });
    return response;
  } catch (error) {
    console.log(error);
    return error.response.data;
  }
};

export const selectAccount = async accountId => {
  try {
    const token = await getToken();
    const response = await axios({
      url: `${config.api_address}accounts/${accountId}/select`,
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': I18n.language,
        'auth-token': token,
      },
      method: 'put',
    });
    await setUserSelectAccount(response.data.user.selected_account);
    return response;
  } catch (error) {
    console.log(error);
    return error.response.data;
  }
};
