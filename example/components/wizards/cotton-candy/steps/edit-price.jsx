import React from 'react';
import { step as WizardStep } from 'halcyon';

@WizardStep
export default class EditPrice extends React.Component {
  constructor () {
    super();
  }

  render () {
    return (
      <h2>Edit Price</h2>
    );
  }
}
