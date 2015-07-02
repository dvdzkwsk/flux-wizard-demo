import { registerWithDispatcher } from './configure-dispatcher';

export default {
  Actions : require('./actions'),
  Step    : require('./components/step/index.jsx'),
  Store   : require('./stores'),
  Wizard  : require('./components/wizard/index.jsx'),
  registerWithDispatcher
};
