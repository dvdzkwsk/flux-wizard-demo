const REGISTERED_DISPATCHER = new WeakMap();
const MANAGED_STORES = [
  require('./stores')
];

class DispatcherConfigurer {
  constructor () {
  }

  getDispatcher () {
    return REGISTERED_DISPATCHER.get(this);
  }

  // unregisters stores from existing their dispatcher before registering
  // them with the new dispatcher.
  registerStoresWithDispatcher (dispatcher) {
    if (REGISTERED_DISPATCHER.has(this)) {
      this.unregisterStoresFromDispatcher(REGISTERED_DISPATCHER.get(this));
    }

    MANAGED_STORES.forEach(store => store.registerWithDispatcher(dispatcher));
    REGISTERED_DISPATCHER.set(this, dispatcher);
  }

  unregisterStoresFromDispatcher (dispatcher) {
    MANAGED_STORES.forEach(store => store.unregisterDispatcher(dispatcher));
  }
}

const cfg = new DispatcherConfigurer();
export default {
  registerStoresWithDispatcher : ::cfg.registerStoresWithDispatcher,
  getDispatcher : ::cfg.getDispatcher
};
