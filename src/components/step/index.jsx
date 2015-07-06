import React, { Component as ReactComponent, PropTypes } from 'react';
import { info } from '../../lib/logger';

class HalcyonStep extends ReactComponent {
  constructor () {
    super();
    this.state = {};
  }

  shouldStepExit () {
    return true;
  }

  stepWillExit () {
    info('Life Cycle Method .stepWillExit() not implemented.');
  }

  render () {
    info('Abstract method HalcyonStep.render() not implemented.');
  }
}

HalcyonStep.propTypes = {};
HalcyonStep.defaultProps = {};

export default HalcyonStep;
