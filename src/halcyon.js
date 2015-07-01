import { warn } from './lib/logger';
import { registerWithDispatcher, getDispatcher } from './configure-dispatcher';

const Wizard = require('./components/wizard/index.jsx'),
      Step   = require('./components/step/index.jsx'),
      Store  = require('./stores/halcyon');

export default {
  Wizard,
  Step,
  Store,
  registerWithDispatcher
};
