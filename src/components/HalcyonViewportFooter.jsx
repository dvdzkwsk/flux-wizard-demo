import React             from 'react';
import HalcyonNavigation from './HalcyonDirectionalNavigation';

export default class HalcyonViewportFooter extends React.Component {
  static propTypes = {
    onNext          : React.PropTypes.func.isRequired,
    onPrevious      : React.PropTypes.func.isRequired,
    onCancel        : React.PropTypes.func.isRequired,
    onSubmit        : React.PropTypes.func.isRequired,
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
      <div className='clearfix'>
        <HalcyonNavigation onNext={this.props.onNext}
                           onPrevious={this.props.onPrevious}
                           disableNext={this.props.disableNext}
                           disablePrevious={this.props.disablePrevious} />
        <div className='pull-right'>
          <button className='btn btn-danger'
                  onClick={this.props.onCancel}>
            Cancel
          </button>
          <button className='btn btn-info'
                  onClick={this.props.onSubmit}
                  disabled={!this.props.disableNext}>
            Submit
          </button>
        </div>
      </div>
    );
  }
}
