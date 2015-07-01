import React, { Component as ReactComponent } from 'react';
import Halcyon from 'halcyon';
import ExampleDispatcher from './dispatcher';
import ExampleWizard from './wizard';
import FirstStep from './steps/first';
import SecondStep from './steps/second';

// We need to tell Halcyon what dispatcher it should register its stores with:
Halcyon.registerWithDispatcher(ExampleDispatcher);

class ExampleApp extends ReactComponent {
  constructor () {
    super();
  }

  render () {
    return (
      <ExampleWizard steps={[FirstStep, SecondStep]} />
    );
  }
}

React.render(<ExampleApp />, document.getElementById('mount-node'));
