import React from 'react';

export default class HalcyonDirectionalNavigation extends React.Component {
  static propTypes = {
    onChange  : React.PropTypes.func.isRequired,
    disabled  : React.PropTypes.bool,
    currentStepIndex : React.PropTypes.number.isRequired,
    disableBackwardNavigation : React.PropTypes.bool,
    disableForwardNavigation  : React.PropTypes.bool
  }

  static defaultProps = {
    disabled : false,
    disableBackwardNavigation : false,
    disableForwardNavigation  : false
  }

  constructor () {
    super();
  }

  handleClick (idx) {
    this.props.onChange(idx);
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
      <div className='halcyon__directional-navigation clearfix'>
        <div className='pull-left'>
          <button className='btn btn-default'
                  disabled={disabled || disableBackwardNavigation}
                  onClick={this.handleClick.bind(this, currentStepIndex - 1)}>
            Previous
          </button>
        </div>
        <div className='pull-right'>
          <button className='btn btn-default'
                  disabled={disabled || disableForwardNavigation }
                  onClick={this.handleClick.bind(this, currentStepIndex + 1)}>
            Next
          </button>
        </div>
      </div>
    );
  }
}
