import React from 'react';

export default class HalcyonStep extends React.Component {
  static propTypes = {
    hideParentNavigation : React.PropTypes.func,
    showParentNavigation : React.PropTypes.func
  }

  static defaultProps = {

  }

  constructor () {
    super();
  }

  showParentNavigation () {
    if (typeof this.props.showParentNavigation === 'function') {
      this.props.showParentNavigation();
    }
  }

  hideParentNavigation () {
    if (typeof this.props.hideParentNavigation === 'function') {
      this.props.hideParentNavigation();
    }
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
