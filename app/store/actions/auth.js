// import dependencies
import AsyncStorage from '@react-native-async-storage/async-storage';
import I18n from '../../assets/i18n/i18n';

// action & types
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  SET_MESSAGE,
} from './types';

import {doLogin} from '../../api/Auth';

const getErrorString = error => {
  return (
    (error.response && error.response.data && error.response.data.error) ||
    error.error ||
    error.toString()
  );
};

export const getUser = () => {};

export const register = (username, email, password) => dispatch => {};

export const login = (phone, phone_ext, password) => dispatch => {
  return doLogin(phone, phone_ext, password).then(
    response => {
      AsyncStorage.setItem('@access_token', response.data.access_token);
      AsyncStorage.setItem('@refresh_token', response.data.refresh_token);

      dispatch({
        type: LOGIN_SUCCESS,
        payload: {user: response.data.user},
      });
      dispatch({
        type: CLEAR_MESSAGE,
      });

      return Promise.resolve();
    },
    error => {
      const message = getErrorString(error);
      const res = error?.response?.data;
      let errMessage;
      // FAIL LOGIN
      if (res?.error_code === 100) {
        if (res?.error_field === 'phone') {
          errMessage = I18n.t('error_phone');
        }
        if (res?.error_field === 'phone_ext') {
          errMessage = I18n.t('error_phone_ext');
        }
        if (res?.error_field === 'password') {
          errMessage = I18n.t('error_password');
        }
      }
      if (res?.error_code === 101) {
        errMessage = I18n.t('error_phone_not_found');
      }
      if (res?.error_code === 102) {
        errMessage = I18n.t('error_password_not_match');
      }
      dispatch({
        type: LOGIN_FAIL,
      });
      dispatch({
        type: SET_MESSAGE,
        payload: errMessage || message,
      });
      return Promise.reject();
    },
  );
};
