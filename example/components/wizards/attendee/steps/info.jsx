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
        <h3>Attendee Info</h3>
        <input value={this.props.model.name} onChange={this.props.bindTo('name')}/>
      </div>
    );
  }
}
