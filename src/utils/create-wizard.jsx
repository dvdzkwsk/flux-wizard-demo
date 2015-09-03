import React from 'react';
import HalcyonWizard from '../components/wizard';

export default function createHalcyonWizard (title, StepComponents) {
  const foo = class GeneratedWizard extends React.Component {
    static defaultProps = {
      title
    }

    constructor () {
      super();
    }

    render () {
      return (
        <HalcyonWizard {...this.props}>
          {StepComponents}
        </HalcyonWizard>
      );
    }
  }

  return foo;
}
