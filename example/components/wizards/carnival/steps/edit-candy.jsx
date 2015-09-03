import React from 'react';
import CottonCandyWizard from '../../cotton-candy';
import { step as WizardStep } from 'halcyon';

@WizardStep
export default class EditCandy extends React.Component {
  constructor () {
    super();
    this.state = {
      hasOpenWizard : false,
      model         : null
    };
  }

  componentDidMount () {
    console.log('Edit Candy step mounted!');
  }

  openWizard () {
    this.setState({
      hasOpenWizard : true,
      model : { price : '1.00', flavor : 'blue' }
    });
  }

  _onCloseWizard () {
    this.setState({
      hasOpenWizard : false,
      model : null
    });
  }

  render () {
    if (this.state.hasOpenWizard) {
      return (
        <CottonCandyWizard name='Cotton Candy Wizard'
                           model={this.state.model}
                           onCancel={::this._onCloseWizard} />
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
