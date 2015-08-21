import Immutable from 'immutable';
import {
  USER_FRIENDS_CHANGE
} from '../constants/user';

const guid = (seed => () => seed++)(0);
function makeUser (firstName) {
  return Immutable.Map({
    id : guid(),
    firstName
  });
}

const initialState = Immutable.Map({
  id        : guid(),
  firstName : 'Michael',
  lastName  : 'Scott',
  friends   : [
    'Dwight',
    'Jim',
    'Pam',
    'Kelly'
  ].map(makeUser)
});

const actions = {
  [USER_FRIENDS_CHANGE] : (state, {friends}) => {
    return state.set('friends', friends);
  }
};

export default function userReducer (state = initialState, action) {
  const handler = actions[action.type];

  return handler ? handler(state, action.payload) : state;
}
