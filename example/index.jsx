import React from 'react';
import ReactDOM from 'react-dom';
import { combineReducers, createStore } from 'redux';
import { Provider } from 'react-redux';
import reducers from './reducers';
import CarnivalWizard from './components/wizards/carnival';

const store = createStore(combineReducers(reducers));

export default class Root extends React.Component {
  constructor () {
    super();
  }

  render () {
    return (
      <Provider store={store}>
        <CarnivalWizard />
      </Provider>
    );
  }
}

ReactDOM.render(<Root />, document.getElementById('root'));
