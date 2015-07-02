import React, { Component as ReactComponent } from 'react';
import HalcyonNavigationBar from '../navigation';
import HalcyonStep from '../step';
import HalcyonActions from '../../actions';
import HalcyonStore from '../../stores';
import { warn } from '../../lib/logger';

class HalcyonWizard extends ReactComponent {
  constructor () {
    super();
    this.state = {};
  }

  // Check to see if this wizard already exists, and if so update internal
  // state to match the flux store. If this type of wizard doesn't already
  // exist, create a new one in the store.
  componentWillMount () {
    HalcyonStore.addChangeListener(::this.handleStoreUpdate);
    HalcyonActions.create(this);
  }

  componentDidUnmount () {
    HalcyonStore.destroy(this);
    HalcyonStore.removeChangeListener(::this.handleStoreUpdate);
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevState.currentStepIndex !== this.state.currentStepIndex) {
      this.wizardDidNavigate();
    }
  }

  // ----------------------------------
  // Store Update Handler
  // ----------------------------------
  handleStoreUpdate () {
    this.setState(this.getStateFromStore());
  }

  getStateFromStore () {
    const {
      model,
      currentStepIndex
    } = HalcyonStore.getStateFor(this);

    return {
      model : model,
      currentStepIndex : currentStepIndex
    };
  }

  // ----------------------------------
  // Begin Life Cycle Methods
  // ----------------------------------

  // Determines whether or not a navigation attempt should be allowed to
  // continue. By default will always return true; to prevent a navigation
  // attempt return [Boolean] false.
  shouldWizardNavigate () {
    return true;
  }

  // Called on the tick before the wizard navigates to a new step. Provides
  // the index of the current step as the first argument, and the new step
  // index as the second.
  // ------------------------
  // [Number] Current Step Index
  // [Number] Target Step Index
  wizardWillNavigate () {
    warn('Life Cycle Method .wizardWillNavigate() not implemented.');
  }

  // Called after the wizard successfuly navigates to a new step. No arguments
  // are provided.
  wizardDidNavigate () {
    warn('Life Cycle Method .wizardDidNavigate() not implemented.');
  }

  // ----------------------------------
  // End Life Cycle Methods
  // ----------------------------------

  // Routes all internal navigation attempts (either from the navigation bar
  // or directional arrows). Helps hook into wizard and step lifecycle methods
  // to determine if the wizard should proceed with the navigation.
  // ------------------------
  // [Number] Target Step Index
  attemptToNavigateToIndex (idx) {
    if (this.shouldWizardNavigate()) {
      this.navigateToIndex(idx);
    }
  }

  // Updates the active step index of the wizard
  // ------------------------
  // [Number] Target Step Index
  navigateToIndex (idx) {
    this.wizardWillNavigate(idx);
    HalcyonActions.navigateToIndex(this, idx);
  }

  // Handler that receives change events from the Navigation component.
  // ------------------------
  // [Number] Target Step Index
  onNavigationChange (idx) {
    this.attemptToNavigateToIndex(idx);
  }

  renderViewport () {
    const StepComponent = this.props.steps[this.state.currentStepIndex];

    return (
      <div className='row'>
        <div className='col-xs-12'>
          <StepComponent ref='step' model={this.state.model} />
        </div>
      </div>
    );
  }

  render () {
    return (
      <div className='halcyon'>
        <HalcyonNavigationBar steps={this.props.steps}
                              disabled={this.props.disabled}
                              activeStepIndex={this.state.currentStepIndex}
                              onChange={::this.onNavigationChange} />
                            <div className='halcyon__viewport'>
          {this.renderViewport()}
        </div>
      </div>
    );
  }
}

HalcyonWizard.propTypes = {
  steps : React.PropTypes.array.isRequired
};

export default HalcyonWizard;
