import { EventEmitter } from 'events';
import { warn } from '../lib/logger';
import assign from 'react/lib/Object.assign';
import {
  HALCYON_WIZARD_CREATE,
  HALCYON_WIZARD_DESTROY,
  HALCYON_WIZARD_NAVIGATE_TO_INDEX,
  HALCYON_WIZARD_SUBMIT_START,
  HALCYON_WIZARD_SUBMIT_FINISH,
  HALCYON_WIZARD_SUBMIT_SUCCESS,
  HALCYON_WIZARD_SUBMIT_ERROR
} from '../constants';

const HALCYON_CHANGE_EVENT = 'HALCYON_CHANGE_EVENT';
const ACTIVE_WIZARDS = new WeakMap();

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
          self.create(payload.instance);
          self.emitChange();
          break;
        case HALCYON_WIZARD_DESTROY:
          self.destroy(payload.instance);
          self.emitChange();
          break;
        case HALCYON_WIZARD_NAVIGATE_TO_INDEX:
          self.navigateToIndex(payload.instance, payload.index);
          self.emitChange();
          break;
      }
    });
  }

  exists (instance) {
    return ACTIVE_WIZARDS.has(instance);
  }

  create (instance) {
    if (ACTIVE_WIZARDS.get(instance)) {
      warn('This wizard already exists, ignoring create.');
      return;
    }

    ACTIVE_WIZARDS.set(instance, {
      currentStepIndex : 0
    });
  }

  destroy (instance) {
    ACTIVE_WIZARDS.delete(instance);
  }

  getStateFor (instance) {
    return ACTIVE_WIZARDS.get(instance);
  }

  updateProperty (property, instance, value) {
    const wizard = ACTIVE_WIZARDS.get(instance);

    wizard[property] = value;
    ACTIVE_WIZARDS.set(instance, wizard);
  }

  navigateToIndex (instance, index) {
    this.updateProperty('currentStepIndex', instance, index);
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
