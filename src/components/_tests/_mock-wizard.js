import React          from 'react';
import { Provider }   from 'react-redux';
import { combineReducers, createStore } from 'redux';
import { HalcyonWizard }   from '../../index';
import * as reducers       from '../../reducers';
import EditUserInfoStep    from '../../../example/steps/EditUserInfoStep';
import EditUserFriendsStep from '../../../example/steps/EditUserFriendsStep';

var _store;

export function getStoreState () {
  return _store.getState();
}

export function createMockWizard () {
  _store = createStore(combineReducers(reducers));

  return class Root extends React.Component {
    constructor () {
      super();
    }

    render () {
      return (
        <Provider store={_store}>
          <HalcyonWizard {...this.props}>
            <EditUserInfoStep />
            <EditUserFriendsStep />
          </HalcyonWizard>
        </Provider>
      );
    }
  };
}
