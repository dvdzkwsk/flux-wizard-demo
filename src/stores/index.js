import { EventEmitter } from 'events';
import { warn } from '../lib/logger';
import assign from 'react/lib/Object.assign';
import {
  HALCYON_WIZARD_CREATE,
  HALCYON_WIZARD_DESTROY,
  HALCYON_WIZARD_NAVIGATE_TO_INDEX,
  HALCYON_WIZARD_SUBMIT_START,
  HALCYON_WIZARD_SUBMIT_END
} from '../constants';

const HALCYON_CHANGE_EVENT = 'HALCYON_CHANGE_EVENT';
const ACTIVE_WIZARDS = new WeakMap();

class HalcyonStore extends EventEmitter {
  constructor () {
    super();
  }

  unregisterDispatcher (dispatcher) {
    dispatcher.unregister(this.dispatchToken);
  }

  registerWithDispatcher (dispatcher) {
    this.dispatchToken = dispatcher.register(::this.handleDispatch);
  }

  handleDispatch (action) {
    const { actionType, payload } = action;

    switch (actionType) {
      case HALCYON_WIZARD_CREATE:
        this.create(payload.instance);
        this.emitChange();
        break;
      case HALCYON_WIZARD_DESTROY:
        this.destroy(payload.instance);
        this.emitChange();
        break;
      case HALCYON_WIZARD_NAVIGATE_TO_INDEX:
        this.navigateToIndex(payload.instance, payload.index);
        this.emitChange();
        break;
      case HALCYON_WIZARD_SUBMIT_START:
        this.startSubmissionFor(payload.instance);
        this.emitChange();
        break;
      case HALCYON_WIZARD_SUBMIT_END:
        this.endSubmissionFor(payload.instance);
        this.emitChange();
        break;
    }
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

  startSubmissionFor (instance) {
    this.updateProperty('submitting', instance, true);
  }

  endSubmissionFor (instance) {
    this.updateProperty('submitting', instance, false);
  }

  emitChange () {
    this.emit(HALCYON_CHANGE_EVENT);
  }

  addChangeListener (handler) {
    this.on(HALCYON_CHANGE_EVENT, handler);
  }

  removeChangeListener (handler) {
    this.removeListener(HALCYON_CHANGE_EVENT, handler);
  }
}

export default new HalcyonStore();
