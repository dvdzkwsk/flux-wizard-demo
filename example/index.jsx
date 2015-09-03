import React from 'react';
import ReactDOM from 'react-dom';
import { combineReducers, createStore } from 'redux';
import { Provider } from 'react-redux';
import reducers from './reducers';
import CarnivalWizard from './components/wizards/carnival';

const store = createStore(combineReducers(reducers));

const _sampleModel = {
  candies : [
    { name : 'Snickers', price : '1' },
    { name : 'Reese\'s', price : '1.5' },
    { name : 'Lollipop', price : '0.75' }
  ]
};


export default class Root extends React.Component {
  constructor () {
    super();
  }

  render () {
    return (
      <Provider store={store}>
        <CarnivalWizard model={_sampleModel} />
      </Provider>
    );
  }
}

ReactDOM.render(<Root />, document.getElementById('root'));
