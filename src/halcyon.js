import { registerStoresWithDispatcher } from './dispatcher-configurer';
import Dispatcher from './dispatcher';

// Register with the built-in Halcyon dispatcher by default
registerStoresWithDispatcher(Dispatcher);

export default {
  Actions : require('./actions'),
  Step    : require('./components/step/index.jsx'),
  Store   : require('./stores'),
  Wizard  : require('./components/wizard/index.jsx'),
  registerStoresWithDispatcher
};
