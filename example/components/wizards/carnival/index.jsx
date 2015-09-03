import React from 'react';
import { Wizard as HalcyonWizard } from 'halcyon';
import EditCandy from './steps/edit-candy';
import EditInfo from './steps/edit-info';

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
        <EditInfo />
      </HalcyonWizard>
    );
  }
}
