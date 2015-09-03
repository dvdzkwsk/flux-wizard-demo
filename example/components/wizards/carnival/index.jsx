import React from 'react';
import { Wizard as HalcyonWizard } from 'halcyon';
import EditCandy from './steps/edit-candy';
import EditAttendees from './steps/edit-attendees';

export default class CarnivalWizard extends React.Component {
  static defaultProps = {
    title : 'Carnival Wizard'
  }

  constructor () {
    super();
  }

  render () {
    return (
      <HalcyonWizard {...this.props}>
        <EditCandy />
      </HalcyonWizard>
    );
  }
}
