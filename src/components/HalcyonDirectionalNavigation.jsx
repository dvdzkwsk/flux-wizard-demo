import React from 'react';

export default class HalcyonDirectionalNavigation extends React.Component {
  static propTypes = {
    onNext          : React.PropTypes.func.isRequired,
    onPrevious      : React.PropTypes.func.isRequired,
    disabled        : React.PropTypes.bool,
    disableNext     : React.PropTypes.bool,
    disablePrevious : React.PropTypes.bool
  }

  static defaultProps = {
    disabled        : false,
    disableNext     : false,
    disablePrevious : false
  }

  constructor () {
    super();
  }

  render () {
    return (
      <div className='halcyon__directional-navigation clearfix'>
        <div className='pull-left'>
          <button className='btn btn-default'
                  disabled={this.props.disabled || this.props.disablePrevious}
                  onClick={this.props.onPrevious}>
            Previous
          </button>
        </div>
        <div className='pull-right'>
          <button className='btn btn-default'
                  disabled={this.props.disabled || this.props.disableNext}
                  onClick={this.props.onNext}>
            Next
          </button>
        </div>
      </div>
    );
  }
}
