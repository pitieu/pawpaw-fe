import {serviceActionTypes} from '../reducers/service';
import {messageActionTypes} from '../reducers/message';

import {
  callAddService,
  callFetchService,
  callListServices,
} from '../../api/Services';

const getErrorString = error => {
  return (
    (error.response && error.response.data && error.response.data.error) ||
    error.error ||
    error.toString()
  );
};

export const setServices = services => dispatch => {
  return {
    type: serviceActionTypes.SET_SERVICES,
    payload: services,
  };
};

export const addService = data => dispatch => {
  return callAddService(data).then(
    response => {
      // dispatch({
      //   type: serviceActionTypes.ADD_SERVICE_SUCCESS,
      // });
      dispatch({
        type: messageActionTypes.CLEAR_MESSAGE,
      });

      return Promise.resolve();
    },
    error => {
      const message = getErrorString(error);
      let errMessage;
      dispatch({
        type: messageActionTypes.SET_MESSAGE,
        payload: errMessage || message,
      });
      return Promise.reject();
    },
  );
};

export const listServices = () => dispatch => {
  return callListServices().then(
    response => {
      return response.data;
    },
    error => {},
  );
};

export const fetchService = id => dispatch => {
  return callFetchService(id).then(
    response => {
      return response.data;
    },
    error => {},
  );
};
