import React from 'react';
import { step as WizardStep } from 'halcyon';

@WizardStep
export default class EditAttendees extends React.Component {
  constructor () {
    super();
  }

  render () {
    return (
      <div>
        <h3>Here's who's coming!</h3>
      </div>
    );
  }
}
