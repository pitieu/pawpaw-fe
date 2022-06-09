export const authActionTypes = {
  REGISTER_SUCCESS: 'REGISTER_SUCCESS',
  REGISTER_FAIL: 'REGISTER_FAIL',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAIL: 'LOGIN_FAIL',
  LOGOUT: 'LOGOUT',
};

const initialState = {isLoggedIn: false, user: null, account: null};

export default function (state = initialState, {type, payload}) {
  switch (type) {
    case authActionTypes.REGISTER_SUCCESS:
      return {
        ...state,
        isLoggedIn: false,
      };
    case authActionTypes.REGISTER_FAIL:
      return {
        ...state,
        isLoggedIn: false,
      };
    case authActionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        isLoggedIn: true,
        user: payload.user,
        account: payload.user.selected_account,
      };
    case authActionTypes.LOGIN_FAIL:
      return {
        ...state,
        isLoggedIn: false,
        user: null,
        account: null,
      };
    case authActionTypes.LOGOUT:
      return {
        ...state,
        isLoggedIn: false,
        user: null,
        account: null,
      };
    default:
      return state;
  }
}
