import React from 'react';
import { Wizard as HalcyonWizard } from 'halcyon';
import EditFlavor from './steps/edit-flavor';
import EditPrice from './steps/edit-price';

export default class CottonCandyWizard extends React.Component {
  constructor () {
    super();
  }

  render () {
    const { model, onSubmit } = this.props;

    return (
      <HalcyonWizard name='Cotton Candy Wizard'
                     model={model}
                     onSubmit={onSubmit}>
        <EditFlavor />
        <EditPrice />
      </HalcyonWizard>
    );
  }
}
