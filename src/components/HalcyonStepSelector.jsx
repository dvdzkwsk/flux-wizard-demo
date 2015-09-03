import React                 from 'react';
import { getComponentTitle } from '../lib/component';

export default class HalcyonStepSelector extends React.Component {
  static propTypes = {
    steps    : React.PropTypes.array.isRequired,
    onSelect : React.PropTypes.func
  }

  constructor () {
    super();
  }

  _onSelect (idx) {
    if (typeof this.props.onSelect === 'function') {
      this.props.onSelect(idx);
    }
  }

  render () {
    const { steps } = this.props;

    return (
      <ul>
        {steps.map((step, idx) => {
          const isActive = false;
          const classes  = `panel panel-default ${isActive ? 'active' : ''}`;

          return (
            <div key={idx}
                 className={classes}
                 onClick={this._onSelect.bind(this, idx)}>
              <div className='panel-body'>
                <h3>{getComponentTitle(step)}</h3>
              </div>
            </div>
          );
        })}
      </ul>
    );
  }
}
