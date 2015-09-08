import React from 'react';
import ReactDOM from 'react-dom';
import { combineReducers, createStore } from 'redux';
import { Provider } from 'react-redux';
import reducers from './reducers';

const store = createStore(combineReducers(reducers));

const _sampleModel = {
  candies : [
    { name : 'Snickers', price : '1' },
    { name : 'Reese\'s', price : '1.5' },
    { name : 'Lollipop', price : '0.75' }
  ],
  attendees : [
    { name : 'Michael Scott' },
    { name : 'Dwight Schrute' },
    { name : 'Jim Halpert' }
  ]
};

export default class Root extends React.Component {
  constructor () {
    super();
  }

  _onSubmit (model) {
    console.log('model provided to wizard', _sampleModel);
    console.log('wizard submitted with', model);
  }

  _onCancel () {
    console.log('Wizard was cancelled');
  }

  render () {
    return (
      <Provider store={store}>
        <h1>Hello</h1>
      </Provider>
    );
  }
}

ReactDOM.render(<Root />, document.getElementById('root'));
