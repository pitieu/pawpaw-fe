import {SET_MESSAGE, CLEAR_MESSAGE} from '../actions/types';

export const toast = message => dispatch => {
  dispatch({
    type: SET_MESSAGE,
    payload: message,
  });
};
