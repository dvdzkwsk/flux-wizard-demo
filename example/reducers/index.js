import { combineReducers } from 'redux';
import { reducers as HalcyonReducers } from '../../src';

const reducers = { ...HalcyonReducers };
export default combineReducers(reducers);
