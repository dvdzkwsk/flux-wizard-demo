import { getDispatcher } from '../dispatcher-configurer.js';
import {
  HALCYON_WIZARD_CREATE,
  HALCYON_WIZARD_DESTROY,
  HALCYON_WIZARD_NAVIGATE_TO_INDEX,
  HALCYON_WIZARD_SUBMIT_START,
  HALCYON_WIZARD_SUBMIT_END
} from '../constants';

export default {
  create : function halcyonCreate (instance) {
    getDispatcher().dispatch({
      actionType : HALCYON_WIZARD_CREATE,
      payload    : { instance }
    })
  },

  navigateToIndex : function halcyonNavigateToIndex (instance, index) {
    getDispatcher().dispatch({
      actionType : HALCYON_WIZARD_NAVIGATE_TO_INDEX,
      payload    : { instance, index }
    });
  },

  startSubmission : function halcyonStartSubmission (instance) {
    getDispatcher().dispatch({
      actionType : HALCYON_WIZARD_SUBMIT_START,
      payload    : { instance }
    });
  },

  endSubmission : function halcyonEndSubmission (instance) {
    getDispatcher().dispatch({
      actionType : HALCYON_WIZARD_SUBMIT_END,
      payload    : { instance }
    });
  }
};
