import React from 'react';
import { combineReducers, createStore } from 'redux';
import { Provider } from 'react-redux';
import reducers from './reducers';
import UserView from './views/user';

const store = createStore(combineReducers(reducers));

export default class App extends React.Component {
  constructor () {
    super();
  }

  render () {
    return (
      <Provider store={store}>
        {() => <UserView />}
      </Provider>
    );
  }
}

React.render(<App />, document.getElementById('mount-node'));
