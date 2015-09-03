import React from 'react';
import { getComponentTitle } from '../lib/component';

export default class HalcyonStepNavigation extends React.Component {
  static propTypes = {
    disabled : React.PropTypes.bool,
    onChange : React.PropTypes.func,
    steps    : React.PropTypes.array.isRequired,
    currentStepIndex : React.PropTypes.number.isRequired
  }

  static defaultProps = {
    disabled : false
  }

  constructor () {
    super();
  }

  onClick (idx, e) {
    e.preventDefault();

    // If navigation is not disabled and the step selection is not the current
    // step, emit an onChange event to the parent.
    if (
      !this.props.disabled &&
      idx !== this.props.currentStepIndex &&
      this.props.onChange
    ) {
      this.props.onChange(idx, e);
    }
  }

  render () {
    const stepTitles = this.props.steps.map(getComponentTitle);

    return (
      <ul>
        {stepTitles.map((title, idx) => {
          const isActive = idx === this.props.currentStepIndex;
          const classes  = `panel panel-default ${isActive ? 'active' : ''}`;

          return (
            <div key={idx}
                className={classes}
                onClick={this.onClick.bind(this, idx)}>
              <div className='panel-body'>
                <h3>{title}</h3>
              </div>
            </div>
          );
        })}
      </ul>
    );
  }
}
