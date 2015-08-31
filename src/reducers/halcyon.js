import Immutable from 'immutable';
import {
  HALCYON_WIZARD_CREATE,
  HALCYON_WIZARD_DESTROY,
  HALCYON_WIZARD_STEP_CHANGE,
  HALCYON_WIZARD_NAVIGATION_HIDE,
  HALCYON_WIZARD_NAVIGATION_SHOW
} from '../constants/wizard';

const initialState = Immutable.List();

const actions = {
  [HALCYON_WIZARD_CREATE] : (state, { instance }) => {
    return state.push(Immutable.Map({
      instance           : instance,
      currentStepIndex   : 0,
      isNavigationHidden : false
    }));
  },

  [HALCYON_WIZARD_DESTROY] : (state, { instance }) => {
    return state.filter(wizard => wizard.get('instance') !== instance);
  },

  [HALCYON_WIZARD_STEP_CHANGE] : (state, { instance, index }) => {
    const wizardIdx = state.findIndex(w => w.get('instance') === instance);
    const wizard    = state.get(wizardIdx)
      .set('currentStepIndex', index);

    return state.set(wizardIdx, wizard);
  },

  [HALCYON_WIZARD_NAVIGATION_HIDE] : (state, { instance }) => {
    const index  = state.findIndex(w => w.get('instance') === instance);
    const wizard = state.get(index)
      .set('isNavigationHidden', true);

    return state.set(index, wizard);
  },

  [HALCYON_WIZARD_NAVIGATION_SHOW] : (state, { instance }) => {
    const index  = state.findIndex(w => w.get('instance') === instance);
    const wizard = state.get(index)
      .set('isNavigationHidden', false);

    return state.set(index, wizard);
  },
};

export default function halcyonWizardsReducer (state = initialState, action) {
  const handler = actions[action.type];

  return handler ? handler(state, action.payload) : state;
}
