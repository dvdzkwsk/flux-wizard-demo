import React, { Component as ReactComponent } from 'react';

class HalcyonDirectionalNavigation extends ReactComponent {
  constructor () {
    super();
  }

  handleClick (idx) {
    this.props.onClick(idx);
  }

  render () {
    const {
      onClick,
      disabled,
      currentStepIndex,
      disableBackwardNavigation,
      disableForwardNavigation
    } = this.props;

    return (
      <div>
        <div className='pull-left'>
          <button className='btn btn-info pull-left'
                  disabled={disabled || disableBackwardNavigation}
                  onClick={this.handleClick.bind(this, currentStepIndex - 1)}>
            Previous
          </button>
        </div>
        <div className='pull-right'>
          <button className='btn btn-info pull-right'
                  disabled={disabled || disableForwardNavigation }
                  onClick={this.handleClick.bind(this, currentStepIndex + 1)}>
            Next
          </button>
        </div>
      </div>
    );
  }
}

HalcyonDirectionalNavigation.propTypes = {
  onClick  : React.PropTypes.func.isRequired,
  disabled : React.PropTypes.bool,
  currentStepIndex : React.PropTypes.number.isRequired,
  disableBackwardNavigation : React.PropTypes.bool,
  disableForwardNavigation  : React.PropTypes.bool
};

HalcyonDirectionalNavigation.defaultProps = {
  disabled : false,
  disableBackwardNavigation  : false,
  disableForwardNavigation   : false
};

export default HalcyonDirectionalNavigation;
