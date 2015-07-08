import React, { Component as ReactComponent, PropTypes } from 'react';
import HalcyonStep from '../step';

class HalcyonStepNavigation extends ReactComponent {
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

  getTitleForStep (step) {
    return step.title || step.name.replace(/([a-z](?=[A-Z]))/g, '$1 ');
  }

  renderStepTabs () {
    return this.props.steps.map((step, idx) => {
      const isActive = idx === this.props.currentStepIndex;

      return (
        <li key={idx} className={isActive ? 'active' : ''}>
          <a href='#'
             disabled={this.props.disabled}
             onClick={this.onClick.bind(this, idx)}>
             <span>{this.getTitleForStep(step)}</span>
          </a>
        </li>
      );
    });
  }

  render () {
    return (
      <div className='halcyon__navigation'>
        <nav className='navbar navbar-static-top'>
          <ul className='nav nav-tabs'>
            {this.renderStepTabs()}
          </ul>
        </nav>
      </div>
    );
  }
}

HalcyonStepNavigation.propTypes = {
  steps : PropTypes.array.isRequired,
  currentStepIndex : PropTypes.number.isRequired,
  disabled : PropTypes.bool,
  onChange : PropTypes.func
};

HalcyonStepNavigation.defaultProps = {
  disabled : false
};

export default HalcyonStepNavigation;
