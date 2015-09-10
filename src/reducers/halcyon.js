import Immutable from 'immutable';
import {
  HALCYON_WIZARD_CREATE,
  HALCYON_WIZARD_DESTROY,
  HALCYON_WIZARD_SET_MODEL,
  HALCYON_WIZARD_STEP_CHANGE,
  HALCYON_WIZARD_OPEN_INSTANCE
} from '../constants/wizard';

const initialState = Immutable.List();

const actions = {
  /**
  * @param {Immutable.List} state - current reducer state.
  * @param {object} action - action descriptor.
  * @param {CompositeComponent} action.instance - target component instance.
  * @param {object} action.model - initial model for the wizard.
  *
  * @returns {Immutable.List} updated reducer state with the new wizard entry
  * appended to the current list of wizards.
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
  * @param {CompositeComponent} action.instance - target component instance.
  *
  * @returns {Immutable.List} updated reducer state without the target wizard.
  */
  [HALCYON_WIZARD_DESTROY] : (state, { instance }) => {
    const idx = state.findIndex(w => w.get('instance') === instance);

    return idx >= 0 ? state.delete(idx) : state;
  },

  /**
  * @param {Immutable.List} state - current reducer state.
  * @param {Object} action - action descriptor.
  * @param {Object} action.instance - target component instance.
  * @param {Immutable.Map} action.model - updated model for the target wizard instance.
  *
  * @returns {Immutable.List} updated reducer state where the target wizard's
  * active step has been updated to the target index.
  */
  [HALCYON_WIZARD_SET_MODEL] : (state, { instance, model }) => {
    const wizardPos = state.findIndex(x => x.get('instance') === instance);
    const wizard    = state.get(wizardPos);

    return state.set(wizardPos, wizard.set('model', model));
  },

  /**
  * @param {Immutable.List} state - current reducer state.
  * @param {object} action - action descriptor.
  * @param {CompositeComponent} action.instance - target component instance.
  * @param {number} action.index - new step index for target wizard.
  *
  * @returns {Immutable.List} updated reducer state where the target wizard's active
  * step has been updated to the target index.
  */
  [HALCYON_WIZARD_STEP_CHANGE] : (state, { instance, index }) => {
    const wizardPos = state.findIndex(x => x.get('instance') === instance);
    const wizard    = state.get(wizardPos);

    return state.set(wizardPos, wizard.set('stepIndex', index));
  },

  /**
  * @param {Immutable.List} state - current reducer state.
  * @param {object} action - action descriptor.
  * @param {CompositeComponent} action.instance - target component instance.
  *
  * @returns {Immutable.List} updated reducer state that only includes all
  * wizards up to and including the target wizard instance.
  */
  [HALCYON_WIZARD_OPEN_INSTANCE] : (state, { instance }) => {
    const idx = state.findIndex(x => x.get('instance') === instance);

    return idx >= 0 ? state.take(idx + 1) : state;
  }
};

// halcyonReducer : Immutable.List -> Action -> Immutable.List
export default function halcyonReducer (state = initialState, action) {
  const handler = actions[action.type];

  return handler ? handler(state, action.payload) : state;
}
