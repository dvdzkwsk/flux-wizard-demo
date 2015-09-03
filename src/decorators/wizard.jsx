import React from 'react';
import HalcyonWizard from '../components/wizard';

export default function halcyonWizardDecorator (Component) {
  return class HalcyonWizardContainer extends React.Component {
    constructor () {
      super();
    }

    renderStepSelector () {
      return React.cloneElement(Component, {
        ...this.props
      });
    }

    render () {
      return (
        <HalcyonWizard {...this.props}>
          {this.renderStepSelector()}
        </HalcyonWizard>
      );
    }
  }
}
