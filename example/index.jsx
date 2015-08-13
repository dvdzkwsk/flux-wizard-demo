import React from 'react';
import FirstStep from './steps/first';
import SecondStep from './steps/second';
import ThirdStep from './steps/third';
import { combineReducers, createStore } from 'redux';
import { Provider } from 'react-redux';
import {
  Wizard   as HalcyonWizard,
  reducers as HalcyonReducers
} from 'halcyon';

const store = createStore(combineReducers(HalcyonReducers));

class ExampleApp extends React.Component {
  constructor () {
    super();
    this.state = {
      model : {}
    };
  }

  renderExampleWizard () {
    return (
      <div className='container'>
        <HalcyonWizard model={this.state.model}>
          <FirstStep />
          <SecondStep />
          <ThirdStep />
        </HalcyonWizard>
      </div>
    );
  }

  render () {
    return (
      <Provider store={store}>
        {() => this.renderExampleWizard()}
      </Provider>
    );
  }
}

React.render(<ExampleApp />, document.getElementById('mount-node'));
