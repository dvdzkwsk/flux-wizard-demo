import { reducers as HalcyonReducers } from 'halcyon';
import userReducer from './user';

export default {
  ...HalcyonReducers,
  user : userReducer
};
