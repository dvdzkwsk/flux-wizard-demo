import Immutable from 'immutable';
import { makeDefaultWizardState } from '../../utils';
import {
  HALCYON_WIZARD_CREATE,
  HALCYON_WIZARD_DESTROY,
  HALCYON_WIZARD_STEP_CHANGE,
  HALCYON_WIZARD_NAVIGATION_HIDE,
  HALCYON_WIZARD_NAVIGATION_SHOW
} from '../../constants/wizard';

const initialState = Immutable.Map();

const actions = {
  [HALCYON_WIZARD_CREATE] : (state, { instance }) => {
    return state.set(instance, makeDefaultWizardState());
  },

  [HALCYON_WIZARD_DESTROY] : (state, { instance }) => {
    return state.delete(instance);
  },

  [HALCYON_WIZARD_STEP_CHANGE] : (state, { instance, index }) => {
    const instanceState = state.get(instance);

    return state.set(instance, instanceState
      .set('currentStepIndex', index)
    );
  },

  [HALCYON_WIZARD_NAVIGATION_HIDE] : (state, { instance }) => {
    const instanceState = state.get(instance);

    return state.set(instance, instanceState
      .set('isNavigationHidden', true)
    );
  },

  [HALCYON_WIZARD_NAVIGATION_SHOW] : (state, { instance }) => {
    const instanceState = state.get(instance);

    return state.set(instance, instanceState
      .set('isNavigationHidden', false)
    );
  },
};

export default function halcyonWizardsReducer (state = initialState, action) {
  const handler = actions[action.type];

  return handler ? handler(state, action.payload) : state;
}
