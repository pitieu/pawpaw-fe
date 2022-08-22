// import dependencies
import AsyncStorage from '@react-native-async-storage/async-storage';

// action & types
import {messageActionTypes} from '../reducers/message';
import {userActionTypes} from '../reducers/user';

// api
import {fetchUser, searchAddressList} from '../../api/Account';

const errorPromise = error => {
  const message = getErrorString(error);
  let errMessage;
  dispatch({
    type: messageActionTypes.SET_MESSAGE,
    payload: errMessage || message,
  });
  return Promise.reject();
};

const getErrorString = error => {
  return (
    (error.response && error.response.data && error.response.data.error) ||
    error.error ||
    error.toString()
  );
};

export const getUser = () => async (dispatch, getState) => {
  try {
    let user = await AsyncStorage.getItem('@user');
    if (!user) {
      const response = await fetchUser();
      if (response.data) {
        await AsyncStorage.setItem('@user', JSON.stringify(response.data));
      }
      user = response.data;
    } else {
      user = JSON.parse(user);
    }
    dispatch({type: userActionTypes.USER_UPDATE, payload: user});
    return Promise.resolve(user);
  } catch (e) {
    errorPromise(e);
    return Promise.reject();
  }
};

export const searchAddress = search => async (dispatch, getState) => {
  try {
    return searchAddressList(search).then(response => {
      return response.data;
    });
  } catch (e) {
    errorPromise(e);
    return Promise.reject();
  }
};
