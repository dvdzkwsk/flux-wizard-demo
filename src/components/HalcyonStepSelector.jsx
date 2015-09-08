import React                 from 'react';
import { getComponentTitle } from '../lib/component';

const DEFAULT_CARD_CLASSES = `panel panel-default`;

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
           className={DEFAULT_CARD_CLASSES}
           onClick={this.props.onSelect.bind(this, idx)}>
        <div className='panel-body'>
          <h3>{title}</h3>
        </div>
      </div>
    );
  }

  render () {
    return (
      <ul>
        {this.props.steps.map((step, idx) =>
          this.renderTitleCard(getComponentTitle(step), idx)
        )}
      </ul>
    );
  }
}
