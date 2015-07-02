import React from 'react';
import { Step as HalcyonStep } from 'halcyon';

class ThirdStep extends HalcyonStep {
  constructor () {
    super();
  }

  render () {
    return <h2>Step 3</h2>;
  }
};

export default ThirdStep;
