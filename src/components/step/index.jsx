import React, { Component as ReactComponent, PropTypes } from 'react';
import { warn } from '../../lib/logger';

class HalcyonStep extends ReactComponent {
  constructor () {
    super();
    this.state = {};
  }

  render () {
    warn('Abstract method HalcyonStep.render() not implemented.');
  }
}

HalcyonStep.propTypes = {};
HalcyonStep.defaultProps = {};

export default HalcyonStep;
