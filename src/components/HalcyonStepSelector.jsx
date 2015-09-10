import React                 from 'react';
import { getComponentTitle } from '../lib/component';

export default class HalcyonStepSelector extends React.Component {
  static propTypes = {
    steps    : React.PropTypes.array.isRequired,
    onSelect : React.PropTypes.func.isRequired
  }

  constructor () {
    super();
  }

  renderTitleCard (title, idx) {
    return (
      <div key={idx}
           className='panel panel-default halcyon-step-selector__card'
           onClick={this.props.onSelect.bind(this, idx)}>
        <div className='panel-body'>
          <h3>{title}</h3>
        </div>
      </div>
    );
  }

  render () {
    return (
      <ol>
        {this.props.steps.map((step, idx) =>
          this.renderTitleCard(getComponentTitle(step), idx)
        )}
      </ol>
    );
  }
}
