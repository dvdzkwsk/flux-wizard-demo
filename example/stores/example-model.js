import Immutable from 'immutable';
import { EventEmitter } from 'events';
import Dispatcher from '../dispatcher';
import {
  EXAMPLE_MODEL_RESET,
  EXAMPLE_MODEL_UPDATE_PROPERTY,
  EXAMPLE_MODEL_UPDATE_LEAF
} from '../constants/example-model';

var _model = Immutable.Map();
const EXAMPLE_MODEL_CHANGE_EVENT = 'EXAMPLE_MODEL_CHANGE_EVENT';

class ExampleModelStore extends EventEmitter {
  constructor () {
    super();
    const self = this;

    _model = Immutable.Map();
    this.dispatchToken = Dispatcher.register(function (action) {
      const { actionType, payload } = action;

      switch (actionType) {
        case EXAMPLE_MODEL_RESET:
          self.reset();
          self.emitChange();
          break;
        case EXAMPLE_MODEL_UPDATE_PROPERTY:
          self.updateProperty(payload.property, payload.value);
          self.emitChange();
          break;
        case EXAMPLE_MODEL_UPDATE_LEAF:
          self.updateLeaf(payload.leafs, payload.value);
          self.emitChange();
          break;
      }
    });
  }

  get () {
    return _model.toJS();
  }

  reset () {
    _model.clear();
  }

  updateProperty (property, value) {
    _model = _model.set(property, value);
  }

  updateLeaf (leafs, value) {
    _model = _model.setIn(leafs, value);
  }

  emitChange () {
    this.emit(EXAMPLE_MODEL_CHANGE_EVENT);
  }

  addChangeListener (handler) {
    this.on(EXAMPLE_MODEL_CHANGE_EVENT, handler);
  }

  removeChangeListener (handler) {
    this.removeListener(EXAMPLE_MODEL_CHANGE_EVENT, handler);
  }
}

export default new ExampleModelStore();
