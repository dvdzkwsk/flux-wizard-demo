import React, { Component as ReactComponent, PropTypes } from 'react';

class HalcyonStep extends ReactComponent {
  constructor () {
    super();
    this.state = {};
  }

  shouldStepExit () {
    return true;
  }

  stepWillExit () {
    // noop
  }

  render () {
    console.warn('Abstract method HalcyonStep.render() not implemented.');
  }
}

HalcyonStep.propTypes = {};
HalcyonStep.defaultProps = {};

export default HalcyonStep;
