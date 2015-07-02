import React from 'react';
import { Wizard as HalyconWizard } from 'halcyon';
import FirstStep from '../steps/first';
import ThirdStep from '../steps/third';

class ExampleSubWizard extends HalyconWizard {
  constructor () {
    super();
  }
};

ExampleSubWizard.defaultProps = {
  steps : [FirstStep, ThirdStep]
};

export default ExampleSubWizard;
