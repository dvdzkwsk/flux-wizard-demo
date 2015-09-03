import React from 'react';
import { step as WizardStep } from 'halcyon';
import AttendeeWizard from '../../attendee';

@WizardStep
export default class EditAttendees extends React.Component {
  constructor () {
    super();
    this.state = {
      hasOpenWizard : false,
      attendeeIdx   : null
    };
  }

  _editAttendee (idx) {
    const attendeeIdx = idx;

    this.setState({
      hasOpenWizard : true, attendeeIdx
    });
  }

  _handleAttendeeSubmit (model) {
    this.setState({
      hasOpenWizard : false,
      attendeeIdx   : null
    });
    this.props.setProperty(`attendees.${this.state.attendeeIdx}`, model);
  }

  _handleAttendeeCancel () {
    this.setState({
      hasOpenWizard : false,
      attendeeIdx   : null
    });
  }

  renderAttendeeWizard () {
    const model = this.props.model.attendees[this.state.attendeeIdx];

    return (
      <AttendeeWizard model={model}
                      onSubmit={::this._handleAttendeeSubmit}
                      onCancel={::this._handleAttendeeCancel} />
    );
  }

  render () {
    if (this.state.hasOpenWizard) {
      return this.renderAttendeeWizard();
    }

    return (
      <div>
        <h2>Here's who's coming!</h2>
        {this.props.model.attendees.map((a, idx) => (
          <div key={a.name}>
            <h3 onClick={this._editAttendee.bind(this, idx)}>{a.name}</h3>
          </div>
        ))}
      </div>
    );
  }
}
