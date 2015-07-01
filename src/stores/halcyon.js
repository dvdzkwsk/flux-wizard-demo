import { EventEmitter } from 'events';
import { warn } from '../lib/logger';
import assign from 'react/lib/Object.assign';
import {
  HALCYON_WIZARD_CREATE,
  HALCYON_WIZARD_DESTROY,
  HALCYON_WIZARD_NAVIGATE_TO_INDEX,
  HALCYON_WIZARD_NAVIGATE_START,
  HALCYON_WIZARD_NAVIGATE_END,
  HALCYON_WIZARD_SUBMIT_START,
  HALCYON_WIZARD_SUBMIT_FINISH,
  HALCYON_WIZARD_SUBMIT_SUCCESS,
  HALCYON_WIZARD_SUBMIT_ERROR
} from '../constants/wizard';

const HALCYON_CHANGE_EVENT = 'HALCYON_CHANGE_EVENT';
const ACTIVE_WIZARDS = {};

class HalcyonStore extends EventEmitter {
  constructor () {
    super();
  }

  registerWithDispatcher (dispatcher) {
    const self = this;

    this.dispatchToken = dispatcher.register(function (action) {
      const { actionType, payload } = action;

      switch (actionType) {
        case HALCYON_WIZARD_CREATE:
          self.createWizard(payload.name);
          self.emitChange();
        case HALCYON_WIZARD_NAVIGATE_TO_INDEX:
          self.navigateToIndex(payload.name, payload.index);
          self.emitChange();
        case HALCYON_WIZARD_SUBMIT_START:
          break;
        case HALCYON_WIZARD_SUBMIT_END:
          break;
      }
    });
  }

  createWizard (name, opts) {
    if (ACTIVE_WIZARDS[name]) {
      warn(`A wizard "${name}" already exists, ignoring create.`);
      return;
    }

    ACTIVE_WIZARDS[name] = assign({
      currentStepIndex : 0
    }, opts || {});
  }

  destroyWizard (id) {
    delete ACTIVE_WIZARDS[name];
  }

  getWizardStateFor (name) {
    return ACTIVE_WIZARDS[name];
  }

  getCurrentStepFor (name) {
    return ACTIVE_WIZARDS[name].currentStepIndex;
  }

  navigateToIndex (name, index) {
    ACTIVE_WIZARDS[name].currentStepIndex = index;
  }

  emitChange () {
    this.emit(HALCYON_CHANGE_EVENT)
  }

  addChangeListener (handler) {
    this.on(HALCYON_CHANGE_EVENT, handler);
  }

  removeChangeListener (handler) {
    this.removeListener(HALCYON_CHANGE_EVENT, handler);
  }
}

export default new HalcyonStore();
