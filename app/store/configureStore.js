import {configureStore} from '@reduxjs/toolkit';
import {combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';

// Import all reducers

import auth from './reducers/auth';
import message from './reducers/message';
import service from './reducers/service';
import user from './reducers/user';

const middleware = [thunk];

const rootReducer = combineReducers({
  auth,
  message,
  service,
  user,
});

const store = configureStore(
  {reducer: rootReducer},
  applyMiddleware(...middleware),
);

export default store;
