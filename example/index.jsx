import React from 'react';
import { Wizard as HalcyonWizard } from 'halcyon';
import FirstStep from './steps/first';
import SecondStep from './steps/second';
import ThirdStep from './steps/third';

class ExampleApp extends React.Component {
  constructor () {
    super();
    this.state = {
      model : {}
    };
  }

  render () {
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
}

React.render(<ExampleApp />, document.getElementById('mount-node'));
