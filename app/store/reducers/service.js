export const serviceActionTypes = {
  SET_SERVICES: 'SET_SERVICES',
};

const initialState = {services: []};

export default function (state = initialState, {type, payload}) {
  switch (type) {
    case serviceActionTypes.SET_SERVICES:
      return {
        ...state,
        services: payload.services,
      };
    default:
      return state;
  }
}
