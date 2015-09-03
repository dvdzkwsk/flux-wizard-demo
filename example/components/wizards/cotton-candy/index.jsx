import React from 'react';
import { Wizard as HalcyonWizard } from 'halcyon';
import EditFlavor from './steps/edit-flavor';
import EditPrice from './steps/edit-price';

export default class CottonCandyWizard extends React.Component {
  static defaultProps = {
    title : 'Cotton Candy Wizard'
  }

  constructor () {
    super();
  }

  render () {
    return (
      <HalcyonWizard {...this.props}>
        <EditFlavor />
        <EditPrice />
      </HalcyonWizard>
    );
  }
}
