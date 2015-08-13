import Immutable from 'immutable';

export function makeDefaultWizardState () {
  return Immutable.Map({
    currentStepIndex   : 0,
    isNavigationHidden : false
  });
}
