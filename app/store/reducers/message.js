import Toast from 'react-native-toast-message';

export const messageActionTypes = {
  SET_MESSAGE: 'SET_MESSAGE',
  CLEAR_MESSAGE: 'CLEAR_MESSAGE',
};

const initialState = {};

export default function (state = initialState, action) {
  const {type, payload} = action;

  switch (type) {
    case messageActionTypes.SET_MESSAGE:
      Toast.show({
        type: 'error',
        text1: payload,
        autoHide: true,
        visibilityTime: 10 * 1e3, //10 seconds
        onPress: () => Toast.hide(),
      });
      return {message: payload};
    case messageActionTypes.CLEAR_MESSAGE:
      return {message: ''};
    default:
      return state;
  }
}
