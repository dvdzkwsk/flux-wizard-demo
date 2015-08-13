import Immutable from 'immutable';
import {
  HALCYON_WIZARD_CREATE,
  HALCYON_WIZARD_DESTROY,
  HALCYON_WIZARD_STEP_CHANGE
} from '../../constants/wizard';

const initialState = Immutable.Map();
function makeNewInstanceState () {
  return Immutable.Map({
    currentStepIndex : 0
  });
}

const actions = {
  [HALCYON_WIZARD_CREATE] : (state, { instance }) => {
    return state.set(instance, makeNewInstanceState());
  },

  [HALCYON_WIZARD_DESTROY] : (state, { instance }) => {
    return state.delete(instance);
  },

  [HALCYON_WIZARD_STEP_CHANGE] : (state, { instance, index }) => {
    const instanceState = state.get(instance);

    return state.set(instance, instanceState
      .set('currentStepIndex', index)
    );
  }
};

export default function halcyonWizardReducer (state = initialState, action) {
  const handler = actions[action.type];

  console.log('ACTION = ', action.type);
  return handler ? handler(state, action.payload) : state;
}
