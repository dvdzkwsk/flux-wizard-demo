import React                 from 'react';
import classnames            from 'classnames';
import { getComponentTitle } from '../lib/component';

export default class HalcyonStepSelector extends React.Component {
  static propTypes = {
    steps    : React.PropTypes.array.isRequired,
    onSelect : React.PropTypes.func.isRequired
  }

  constructor () {
    super();
  }

  render () {
    return (
      <ol>
        {this.props.steps.map((step, idx) => {
          const isDisabled = !!step.props.disabled;
          const cn = classnames(
            'panel',
            'panel-default',
            'halcyon-step-selector__card',
            { 'halcyon-step-selector__card--disabled' : isDisabled }
          );
          const onClick = this.props.onSelect.bind(this, idx);

          return (
            <div key={idx} className={cn} onClick={onClick}>
              <div className='panel-body'>
                <h3>{getComponentTitle(step)}</h3>
              </div>
            </div>
          );
        })}
      </ol>
    );
  }
}
