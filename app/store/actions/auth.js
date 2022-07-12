// import dependencies
import AsyncStorage from '@react-native-async-storage/async-storage';
import I18n from '../../assets/i18n/i18n';

// action & types
import {messageActionTypes} from '../reducers/message';
import {authActionTypes} from '../reducers/auth';
import {userActionTypes} from '../reducers/user';

import {callLogin, callRegister} from '../../api/Auth';

const getErrorString = error => {
  return (
    (error.response && error.response.data && error.response.data.error) ||
    error.error ||
    error.toString()
  );
};

export const getUser = () => {};

export const register = (username, phone, phoneExt, password) => dispatch => {
  return callRegister(username, phone, phoneExt, password).then(
    response => {
      dispatch({
        type: authActionTypes.REGISTER_SUCCESS,
      });
      dispatch({
        type: messageActionTypes.CLEAR_MESSAGE,
      });

      return Promise.resolve();
    },
    error => {
      const message = getErrorString(error);
      const res = error?.response?.data;
      let errMessage;
      // FAIL Register
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
        if (res?.error_field === 'username') {
          errMessage = I18n.t('error_username');
        }
      }
      if (res?.error_code === 103) {
        errMessage = I18n.t('error_phone_exists');
      }
      if (res?.error_code === 104) {
        errMessage = I18n.t('error_username_exists');
      }
      dispatch({
        type: authActionTypes.REGISTER_FAIL,
      });
      dispatch({
        type: messageActionTypes.SET_MESSAGE,
        payload: errMessage || message,
      });
      return Promise.reject();
    },
  );
};

export const login = (phone, phoneExt, password) => dispatch => {
  return callLogin(phone, phoneExt, password).then(
    response => {
      AsyncStorage.setItem('@access_token', response.data.access_token);
      AsyncStorage.setItem('@refresh_token', response.data.refresh_token);

      dispatch({
        type: authActionTypes.LOGIN_SUCCESS,
        payload: {user: response.data.user},
      });
      dispatch({
        type: userActionTypes.USER_UPDATE,
        payload: response.data.user,
      });
      dispatch({
        type: messageActionTypes.CLEAR_MESSAGE,
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
        type: messageActionTypes.SET_MESSAGE,
        payload: errMessage || message,
      });
      return Promise.reject();
    },
  );
};
