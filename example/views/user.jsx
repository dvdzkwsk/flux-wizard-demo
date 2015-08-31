import React from 'react';
import CarnivalWizard from '../components/wizards/carnival';

export default class UserView extends React.Component {
  constructor () {
    super();
  }

  _handleWizardSubmit (model) {
    console.log('wizard submitted with', model);

    this.setState({
      wizardModel   : null,
      hasOpenWizard : false
    });
  }

  _handleWizardCancel () {
    this.setState({
      wizardModel   : null,
      hasOpenWizard : false
    });
  }

  render () {
    return (
      <CarnivalWizard />
    );
  }
}
