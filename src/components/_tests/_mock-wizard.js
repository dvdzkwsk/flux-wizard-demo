import React          from 'react';
import * as reducers  from '../../reducers';
import SampleWizard   from '../../../example/wizards/EditUserWizard';
import { Provider }   from 'react-redux';
import { combineReducers, createStore } from 'redux';

var _store;

export function getStoreState () {
  return _store.getState();
}

export function createMockWizardClass () {
  _store = createStore(combineReducers(reducers));

  return class Root extends React.Component {
    constructor () {
      super();
    }

    render () {
      return (
        <Provider store={_store}>
          <SampleWizard {...this.props} />
        </Provider>
      );
    }
  };
}
