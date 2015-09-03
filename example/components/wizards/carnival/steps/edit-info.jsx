import React from 'react';
import { step as WizardStep } from 'halcyon';

@WizardStep
export default class EditInfo extends React.Component {
  constructor () {
    super();
  }

  render () {
    return (
      <div>
        <h2>Edit Info!</h2>
      </div>
    );
  }
}
