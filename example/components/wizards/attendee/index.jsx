import React from 'react';
import { Wizard as HalcyonWizard } from 'halcyon';
import EditInfo from './steps/info';

export default class AttendeeWizard extends React.Component {
  static defaultProps = {
    title : 'Attendee Wizard'
  }

  constructor () {
    super();
  }

  render () {
    return (
      <HalcyonWizard {...this.props}>
        <EditInfo />
      </HalcyonWizard>
    );
  }
}
