// import dependencies
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import I18n from '../assets/i18n/i18n';
import {getToken} from './Auth';

// config
import config from '../config';

export const getUser = async () => {
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
    // console.log(error.response.data);
    return error.response.data;
  }
};

export const getAccounts = async () => {
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
    // console.log(error.response.data);
    return error.response.data;
  }
};

export const selectAccount = async userId => {
  try {
    const token = await getToken();
    const response = await axios({
      url: `${config.api_address}accounts/${userId}/select`,
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': I18n.language,
        'auth-token': token,
      },
      method: 'put',
    });
    return response;
  } catch (error) {
    console.log(error);
    // console.log(error.response.data);
    return error.response.data;
  }
};
