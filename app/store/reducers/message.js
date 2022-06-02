import Toast from 'react-native-toast-message';
import {SET_MESSAGE, CLEAR_MESSAGE} from '../actions/types';

const initialState = {};

export default function (state = initialState, action) {
  const {type, payload} = action;

  switch (type) {
    case SET_MESSAGE:
      Toast.show({
        type: 'error',
        text1: payload,
        autoHide: true,
        visibilityTime: 10 * 1e3, //10 seconds
        onPress: () => Toast.hide(),
      });
      return {message: payload};
    case CLEAR_MESSAGE:
      return {message: ''};
    default:
      return state;
  }
}
