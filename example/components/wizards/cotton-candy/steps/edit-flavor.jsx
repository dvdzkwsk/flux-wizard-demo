import React from 'react';
import { step as WizardStep } from 'halcyon';

@WizardStep
export default class EditFlavor extends React.Component {
  constructor () {
    super();
  }

  render () {
    return (
      <h2>Edit Flavor</h2>
    );
  }
}
