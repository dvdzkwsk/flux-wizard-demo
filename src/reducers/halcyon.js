import Immutable from 'immutable';
import {
  HALCYON_WIZARD_CREATE,
  HALCYON_WIZARD_DESTROY,
  HALCYON_WIZARD_STEP_CHANGE,
  HALCYON_WIZARD_OPEN_INDEX
} from '../constants/wizard';

const initialState = Immutable.Map({
  activeWizardIndex : null,
  wizards : Immutable.List()
});

const actions = {
  [HALCYON_WIZARD_CREATE] : (state, { instance }) => {
    const wizards  = state.get('wizards'),
          wizardCt = wizards.size;

    return state.withMutations(state => {
      const updatedWizards = wizards
        .push(Immutable.Map({
          instance          : instance,
          currentStepIndex  : 0,
          index             : wizardCt
        }))

      state
        .set('wizards', updatedWizards)
        .set('activeWizardIndex', wizardCt);
    })
  },

  [HALCYON_WIZARD_DESTROY] : (state, { instance }) => {
    const wizards = state.get('wizards')
      .filter(wizard => wizard.get('instance') === instance);

    return state.set('wizards', wizards);
  },

  [HALCYON_WIZARD_STEP_CHANGE] : (state, { instance, index }) => {
    const wizards  = state.get('wizards');

    // update target wizard
    const wizardPos = wizards.findIndex(x => x.get('instance') === instance);
    const wizard    = wizards.get(wizardPos)
      .set('currentStepIndex', index);

    // update wizard in collection
    return state.set('wizards', wizards.set(wizardPos, wizard));
  },

  [HALCYON_WIZARD_OPEN_INDEX] : (state, { index }) => {
    return state.set('activeWizardIndex', index);
  }
};

export default function halcyonWizardsReducer (state = initialState, action) {
  const handler = actions[action.type];

  return handler ? handler(state, action.payload) : state;
}
