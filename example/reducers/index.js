import { reducers as HalcyonReducers } from '../../src';
import userReducer from './user';

export default {
  ...HalcyonReducers,
  user : userReducer
};
