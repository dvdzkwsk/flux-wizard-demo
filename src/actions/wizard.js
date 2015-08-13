import {
  HALCYON_WIZARD_CREATE,
  HALCYON_WIZARD_DESTROY,
  HALCYON_WIZARD_STEP_CHANGE
} from '../constants/wizard';


export function createWizard (instance) {
  return {
    type : HALCYON_WIZARD_CREATE,
    payload : {
      instance
    }
  };
}

export function destroyWizard (instance) {
  return {
    type : HALCYON_WIZARD_DESTROY,
    payload : {
      instance
    }
  };
}

export function changeWizardStep (instance, index) {
  console.log('changing step');
  console.log(instance);
  console.log(index);
  return {
    type : HALCYON_WIZARD_STEP_CHANGE,
    payload : {
      instance, index
    }
  };
}
