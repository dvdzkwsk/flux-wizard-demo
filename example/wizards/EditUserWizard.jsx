import React from 'react';
import { HalcyonWizard } from 'halcyon';

export default class EditUserWizard extends React.Component {
  static defaultProps = {
    title : 'Edit User Wizard'
  }

  constructor () {
    super();
  }

  render () {
    return (
      <HalcyonWizard {...this.props}>
        
      </HalcyonWizard>
    );
  }
}
