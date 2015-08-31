import React from 'react';
import { Wizard as HalcyonWizard } from 'halcyon';
import EditFlavor from './steps/edit-flavor';
import EditPrice from './steps/edit-price';

export default class CottonCandyWizard extends React.Component {
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
      <HalcyonWizard model={model} onSubmit={onSubmit}>
        <EditFlavor />
        <EditPrice />
      </HalcyonWizard>
    );
  }
}
