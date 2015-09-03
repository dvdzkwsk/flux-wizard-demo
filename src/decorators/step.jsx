import React from 'react';

export default function halcyonStepDecorator (Component) {
  return class HalcyonStep extends React.Component {
    constructor () {
      super();
    }

    validate () {
      if (typeof this.refs.step.validate === 'function') {
        return this.refs.step.validate();
      }
      return true;
    }

    shouldStepLeave () {
      if (typeof this.refs.step.shouldStepLeave === 'function') {
        return this.refs.step.shouldStepLeave();
      }
      return true;
    }

    render () {
      return (
        <Component ref='step' />
      );
    }
  }
}
