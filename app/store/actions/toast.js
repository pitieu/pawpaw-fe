import {SET_MESSAGE, CLEAR_MESSAGE} from '../actions/types';

export const toast = message => {
  return {
    type: SET_MESSAGE,
    payload: message,
  };
};
