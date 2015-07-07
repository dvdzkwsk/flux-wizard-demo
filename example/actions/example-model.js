import Dispatcher from '../dispatcher';
import {
  EXAMPLE_MODEL_RESET,
  EXAMPLE_MODEL_UPDATE_PROPERTY,
  EXAMPLE_MODEL_UPDATE_LEAF
} from '../constants/example-model';

export default {
  reset : function () {
    Dispatcher.dispatch({
      actionType : EXAMPLE_MODEL_RESET,
      payload    : {}
    });
  },

  updateProperty : function (property, value) {
    Dispatcher.dispatch({
      actionType : EXAMPLE_MODEL_UPDATE_PROPERTY,
      payload    : {
        property, value
      }
    });
  },

  updateLeaf : function (leafs, value) {
    Dispatcher.dispatch({
      actionType : EXAMPLE_MODEL_UPDATE_LEAF,
      payload    : {
        leafs, value
      }
    });
  }
};
