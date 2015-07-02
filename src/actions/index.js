import { getDispatcher } from '../configure-dispatcher.js';
import {
  HALCYON_WIZARD_CREATE,
  HALCYON_WIZARD_DESTROY,
  HALCYON_WIZARD_NAVIGATE_TO_INDEX,
  HALCYON_WIZARD_SUBMIT_START,
  HALCYON_WIZARD_SUBMIT_FINISH,
  HALCYON_WIZARD_SUBMIT_SUCCESS,
  HALCYON_WIZARD_SUBMIT_ERROR
} from '../constants/wizard';

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
  }
};
