import React from 'react';
import { Step as HalcyonStep } from 'halcyon';

export default class FirstStep extends HalcyonStep {
  constructor () {
    super();
  }

  render () {
    const { model } = this.props;

    return (
      <div>
        <h1>Step 1</h1>
      </div>
    );
  }
};
