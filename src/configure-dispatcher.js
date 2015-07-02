import { warn } from './lib/logger';
import HalcyonStore from './stores';
var configuredDispatcher;

export default {
  registerWithDispatcher : (dispatcher) => {
    if (configuredDispatcher) {
      warn('Stores have already been registered with a dispatcher.');
    } else {
      configuredDispatcher = dispatcher;
      HalcyonStore.registerWithDispatcher(dispatcher);
    }
  },
  getDispatcher : () => configuredDispatcher
};
