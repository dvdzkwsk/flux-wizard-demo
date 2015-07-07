import React, { Component as ReactComponent } from 'react';
import HalcyonStepNavigation from '../step-navigation/index.jsx';
import HalcyonDirectionalNavigation from '../directional-navigation/index.jsx';
import HalcyonActions from '../../actions';
import HalcyonStore from '../../stores';
import { warn, info } from '../../lib/logger';

class HalcyonWizard extends ReactComponent {
  constructor () {
    super();
    this.state = {};
  }

  componentWillMount () {
    this.wizardWillMount();
    HalcyonStore.addChangeListener(::this.handleStoreUpdate);
    HalcyonActions.create(this);
  }

  componentDidMount () {
    this.wizardDidMount();
  }

  componentWillUnmount () {
    this.wizardWillUnmount();
  }

  componentDidUnmount () {
    this.wizardDidUnmount();
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
    const state = HalcyonStore.getStateFor(this);

    this.setState({
      currentStepIndex : state.currentStepIndex,
      submitting : state.submitting
    });
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
    info('Life Cycle Method .wizardWillNavigate() not implemented.');
  }

  // Called after the wizard successfuly navigates to a new step. No arguments
  // are provided.
  wizardDidNavigate () {
    info('Life Cycle Method .wizardDidNavigate() not implemented.');
  }

  wizardWillMount () {
    // noop
  }

  wizardDidMount () {
    // noop
  }

  wizardWillUnmount () {
    // noop
  }

  wizardDidUnmount () {
    // noop
  }

  wizardWillSubmit () {
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
    if (this.shouldWizardNavigate() && this.refs.step.shouldStepExit()) {
      this.navigateToIndex(idx);
    }
  }

  // Updates the active step index of the wizard
  // ------------------------
  // [Number] Target Step Index
  navigateToIndex (idx) {
    this.wizardWillNavigate(idx);
    this.refs.step.stepWillExit();
    HalcyonActions.navigateToIndex(this, idx);
  }

  // Handler that receives change events from the Navigation component.
  // ------------------------
  // [Number] Target Step Index
  onNavigationChange (idx) {
    this.attemptToNavigateToIndex(idx);
  }

  // Event handler for submission button click.
  // ------------------------
  onSubmitClick () {
    HalcyonActions.startSubmission(this);
  }

  render () {
    const { steps, model } = this.props,
          { currentStepIndex } = this.state,
          StepComponent = steps[currentStepIndex],
          onFirstStep   = currentStepIndex === 0,
          onLastStep    = currentStepIndex === steps.length - 1;

    const wizardIsDisabled = this.props.disabled || this.state.submitting;

    return (
      <div className='halcyon'>
        <HalcyonStepNavigation steps={steps}
                               disabled={wizardIsDisabled}
                               currentStepIndex={currentStepIndex}
                               onChange={::this.onNavigationChange} />
        <div className='halcyon__viewport'>
          <div className='row'>
            <div className='col-xs-12'>
              <StepComponent ref='step'
                             model={model}
                             disabled={wizardIsDisabled} />
            </div>
          </div>
        </div>
        <HalcyonDirectionalNavigation currentStepIndex={currentStepIndex}
                                      onClick={::this.attemptToNavigateToIndex}
                                      disabled={wizardIsDisabled}
                                      disableBackwardNavigation={onFirstStep}
                                      disableForwardNavigation={onLastStep} />
      </div>
    );
  }
}

HalcyonWizard.propTypes = {
  model : React.PropTypes.object.isRequired,
  steps : React.PropTypes.array.isRequired
};

export default HalcyonWizard;
