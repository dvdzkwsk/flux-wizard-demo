import React from 'react';
import ReactDOM from 'react-dom';
import { combineReducers, createStore } from 'redux';
import { Provider } from 'react-redux';
import reducers from './reducers';
import EditUserWizard from './wizards/EditUserWizard';

const store = createStore(combineReducers(reducers));

const _sampleModel = {
  firstName : 'Michael',
  lastName  : 'Scott',
  age       : 42,
  friends   : [
    { firstName : 'Dwight', lastName : 'Schrute' },
    { firstName : 'Jim', lastName : 'Halpert' },
    { firstName : 'Oscar', lastName : 'Martinez' }
  ]
};

export default class Root extends React.Component {
  constructor () {
    super();
  }

  render () {
    return (
      <Provider store={store}>
        <EditUserWizard model={_sampleModel} />
      </Provider>
    );
  }
}

ReactDOM.render(<Root />, document.getElementById('root'));
