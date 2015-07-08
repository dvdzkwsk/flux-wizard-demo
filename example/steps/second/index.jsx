import React from 'react';
import { Step as HalcyonStep } from 'halcyon';

class SecondStep extends HalcyonStep {
  constructor () {
    super();
  }

  render () {
    return <h2>Step 2</h2>;
  }
};

export default SecondStep;
