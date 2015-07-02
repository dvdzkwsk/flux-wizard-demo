import React from 'react';
import { Step as HalcyonStep } from 'halcyon';
import ExampleSubWizard from '../../sub-wizard';

class SecondStep extends HalcyonStep {
  constructor () {
    super();
    this.state.inSubWizard = false;
  }

  exitSubWizard () {
    this.setState({
      exitSubWizard : false
    });
  }

  enterSubWizard () {
    this.setState({
      inSubWizard : true
    });
  }

  render () {
    if (this.state.inSubWizard) {
      return <ExampleSubWizard onExit={::this.exitSubWizard} />;
    } else {
      return (
        <div>
          <h2>Step 2</h2>
          <button onClick={::this.enterSubWizard}>
            Enter Sub Wizard
          </button>
        </div>
      );
    }
  }
};

export default SecondStep;
