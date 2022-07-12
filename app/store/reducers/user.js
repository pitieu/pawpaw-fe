export const userActionTypes = {
  USER_UPDATE: 'USER_UPDATE',
};

const initialState = {user: null, account: null};

export default function (state = initialState, {type, payload}) {
  switch (type) {
    case userActionTypes.USER_UPDATE:
      return {
        ...state,
        user: payload,
        account: payload.selected_account,
      };
    default:
      return state;
  }
}
