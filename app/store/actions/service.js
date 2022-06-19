import {serviceActionTypes} from '../reducers/service';

export const setServices = services => dispatch => {
  return {
    type: serviceActionTypes.SET_SERVICES,
    payload: services,
  };
};
