import {
  HALCYON_WIZARD_CREATE,
  HALCYON_WIZARD_DESTROY,
  HALCYON_WIZARD_SET_MODEL,
  HALCYON_WIZARD_STEP_CHANGE
} from '../constants/wizard';

// createWizard :: Wizard -> Object -> Object
export function createWizard (instance, model) {
  return {
    type : HALCYON_WIZARD_CREATE,
    payload : {
      instance, model
    }
  };
}

// destroyWizard :: Wizard -> Object
export function destroyWizard (instance) {
  return {
    type : HALCYON_WIZARD_DESTROY,
    payload : {
      instance
    }
  };
}

// setWizardModel :: Wizard -> Object -> Object
export function setWizardModel (instance, model) {
  return {
    type : HALCYON_WIZARD_SET_MODEL,
    payload : {
      instance, model
    }
  };
}

// setWizardModel :: Wizard -> Int -> Object
export function changeWizardStep (instance, index) {
  return {
    type : HALCYON_WIZARD_STEP_CHANGE,
    payload : {
      instance, index
    }
  };
}
