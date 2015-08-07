import React from 'react';

export default class HalcyonStep extends React.Component {
  static propTypes = {

  }

  static defaultProps = {

  }

  constructor () {
    super();
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
