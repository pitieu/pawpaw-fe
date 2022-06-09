import {messageActionTypes} from '../reducers/message';

export const toast = message => {
  return {
    type: messageActionTypes.SET_MESSAGE,
    payload: message,
  };
};
