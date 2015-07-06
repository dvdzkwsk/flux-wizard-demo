import { error } from './lib/logger';
import HalcyonStore from './stores';

class DispatchConfigurer {
  constructor () {
    this._registeredDispatcher = undefined;
  }

  getDispatcher () {
    return this._registeredDispatcher;
  }

  registerStoresWithDispatcher (dispatcher) {
    if (this._registeredDispatcher) {
      try {
        this.unregisterStoresFromDispatcher(this.getDispatcher());
        this._registeredDispatcher = undefined;
      } catch (e) {
        error('Could not unregister stores from current dispatcher', e);
        return;
      }
    }

    HalcyonStore.registerWithDispatcher(dispatcher);
    this._registeredDispatcher = dispatcher;
  }

  unregisterStoresFromDispatcher (dispatcher) {
    HalcyonStore.unregisterDispatcher(dispatcher);
  }
}

const cfg = new DispatchConfigurer();
export default {
  registerStoresWithDispatcher : ::cfg.registerStoresWithDispatcher,
  getDispatcher : ::cfg.getDispatcher
};
