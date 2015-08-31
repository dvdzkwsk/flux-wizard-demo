import React from 'react';
import { Wizard as HalcyonWizard } from 'halcyon';
import EditCandy from './steps/edit-candy';
import EditInfo  from './steps/edit-info';

export default class CarnivalWizard extends React.Component {
  static propTypes = {
    // model    : React.PropTypes.object.isRequired,
    // onSubmit : React.PropTypes.func.isRequired
  }

  constructor () {
    super();
  }

  render () {
    const { model, onSubmit } = this.props;

    return (
      <HalcyonWizard name='Carnival Wizard' model={model} onSubmit={onSubmit}>
        <EditCandy name='Edit Candy!' />
        <EditInfo />
      </HalcyonWizard>
    );
  }
}
