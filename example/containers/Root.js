import React from 'react';
import { combineReducers, createStore } from 'redux';
import { Provider } from 'react-redux';
import reducers from '../reducers';
import EditUserWizard from '../wizards/EditUserWizard';

const store = createStore(combineReducers(reducers));

export default class Root extends React.Component {
  constructor () {
    super();
  }

  render () {
    return (
      <Provider store={store}>
        <EditUserWizard {...this.props} />
      </Provider>
    );
  }
}
