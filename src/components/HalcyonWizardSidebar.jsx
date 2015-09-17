import React               from 'react';
import HalcyonStepSelector from './HalcyonStepSelector';

export default class HalcyonWizardSidebar extends React.Component {
  static propTypes = {
    steps : React.PropTypes.oneOfType([
      React.PropTypes.element,
      React.PropTypes.arrayOf(React.PropTypes.element)
    ]).isRequired,
    onSelect : React.PropTypes.func.isRequired
  }

  constructor () {
    super();
  }

  render () {
    return (
      <div className='halcyon-wizard__sidebar'>
        <HalcyonStepSelector steps={this.props.steps}
                             onSelect={this.props.onSelect} />
      </div>
    );
  }
}
