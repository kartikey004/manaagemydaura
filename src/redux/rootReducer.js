import {combineReducers} from '@reduxjs/toolkit';
import authReducer from './authSlice.js';
import visitReducer from './visitSlice.js';
import workerReducer from './workerSlice.js';
import scheduleReducer from './scheduleSlice.js';

const rootReducer = combineReducers({
  auth: authReducer,
  visit: visitReducer,
  worker: workerReducer,
  schedule: scheduleReducer,
});

console.log('rootReducer:', rootReducer);

export default rootReducer;
