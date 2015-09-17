import React          from 'react';
import reducers       from '../reducers';
import { Provider }   from 'react-redux';
import EditUserWizard from '../wizards/EditUserWizard';
import configureStore from '../stores/configure';
import { combineReducers, createStore }     from 'redux';
import { DevTools, LogMonitor, DebugPanel } from 'redux-devtools/lib/react';

const store = configureStore();

export default class Root extends React.Component {
  constructor () {
    super();
  }

  renderDevTools () {
    return (
      <DebugPanel top left bottom key='debugPanel'>
        <DevTools store={store} monitor={LogMonitor} />
      </DebugPanel>
    );
  }

  render () {
    return (
      <div>
        {this.renderDevTools()}
        <Provider store={store}>
          <EditUserWizard {...this.props} />
        </Provider>
      </div>
    );
  }
}
