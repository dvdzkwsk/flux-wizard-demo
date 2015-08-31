import React from 'react';
import CottonCandyWizard from '../../cotton-candy';
import { Step as HalcyonStep } from 'halcyon';

export default class EditCandy extends HalcyonStep {
  constructor () {
    super();
    this.state = {
      hasOpenWizard : false,
      model         : null
    };
  }

  openWizard () {
    this.hideParentNavigation();
    this.setState({
      hasOpenWizard : true,
      model : { price : '1.00', flavor : 'blue' }
    });
  }

  render () {
    if (this.state.hasOpenWizard) {
      return (
        <CottonCandyWizard model={this.state.model} />
      );
    }

    return (
      <div>
        <h2>Edit Candy!</h2>
        <button onClick={::this.openWizard}>Edit Cotton Candy</button>
      </div>
    );
  }
}
