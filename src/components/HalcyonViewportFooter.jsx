import React             from 'react';
import HalcyonNavigation from './HalcyonDirectionalNavigation';

export default class HalcyonViewportFooter extends React.Component {
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
      <div>
        <HalcyonNavigation onNext={this.props.onNext}
                           onPrevious={this.props.onPrevious}
                           disableNext={this.props.disableNext}
                           disablePrevious={this.props.disablePrevious} />
      </div>
    );
  }
}
