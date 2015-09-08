import Immutable from 'immutable';
import {
  HALCYON_WIZARD_CREATE,
  HALCYON_WIZARD_DESTROY,
  HALCYON_WIZARD_SET_MODEL,
  HALCYON_WIZARD_STEP_CHANGE
} from '../constants/wizard';

const initialState = Immutable.List();

const actions = {
  /**
  * @param {Immutable.List} state - current reducer state.
  * @param {object} action - action descriptor.
  * @param {object} action.instance - target component instance.
  * @param {object} action.model - initial model for the wizard.
  *
  * @returns {object} updated reducer state with the new wizard appended
  * to the current list.
  */
  [HALCYON_WIZARD_CREATE] : (state, { instance, model }) => {
    const currentDepth = state.size;

    return state.push(Immutable.Map({
      instance  : instance,
      stepIndex : 0,
      depth     : currentDepth,
      model     : model
    }));
  },

  /**
  * @param {Immutable.List} state - current reducer state.
  * @param {object} action - action descriptor.
  * @param {object} action.instance - target component instance.
  *
  * @returns {object} updated reducer state without the target wizard.
  */
  [HALCYON_WIZARD_DESTROY] : (state, { instance }) => {
    return state.filter(wizard => wizard.get('instance') !== instance);
  },

  /**
  * @param {Immutable.List} state - current reducer state.
  * @param {object} action - action descriptor.
  * @param {object} action.instance - target component instance.
  * @param {model} action.model - updated model for the target wizard instance.
  *
  * @returns {object} updated reducer state where the target wizard's active
  * step has been updated to the target index.
  */
  [HALCYON_WIZARD_SET_MODEL] : (state, { instance, model }) => {
    const wizardPos = state.findIndex(x => x.get('instance') === instance);
    const wizard    = state.get(wizardPos);

    return state.set(wizardPos, wizard.set('model', model));
  },

  /**
  * @param {Immutable.List} state - current reducer state.
  * @param {object} action - action descriptor.
  * @param {object} action.instance - target component instance.
  * @param {number} action.index - new step index for target wizard.
  *
  * @returns {object} updated reducer state where the target wizard's active
  * step has been updated to the target index.
  */
  [HALCYON_WIZARD_STEP_CHANGE] : (state, { instance, index }) => {
    const wizardPos = state.findIndex(x => x.get('instance') === instance);
    const wizard    = state.get(wizardPos);

    return state.set(wizardPos, wizard.set('stepIndex', index));
  }
};

// halcyonReducer :: Immutable.List -> Object -> Immutable.List
export default function halcyonReducer (state = initialState, action) {
  const handler = actions[action.type];

  return handler ? handler(state, action.payload) : state;
}
