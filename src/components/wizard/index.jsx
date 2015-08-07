import React from 'react';
import HalcyonStepNavigation from '../step-navigation/index.jsx';
import HalcyonDirectionalNavigation from '../directional-navigation/index.jsx';

export default class HalcyonWizard extends React.Component {
  static propTypes = {
    model : React.PropTypes.object.isRequired
  }

  constructor () {
    super();
    this.state = {
      currentStepIndex : 0
    };
  }

  componentWillMount () {
    this.wizardWillMount();
  }

  componentDidMount () {
    this.wizardDidMount();
  }

  componentWillUnmount () {
    this.wizardWillUnmount();
  }

  componentDidUnmount () {
    this.wizardDidUnmount();
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevState.currentStepIndex !== this.state.currentStepIndex) {
      this.wizardDidNavigate();
    }
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
    // noop
  }

  // Called after the wizard successfuly navigates to a new step. No arguments
  // are provided.
  wizardDidNavigate () {
    // noop
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
    // noop
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

    // navigate...
    console.log(`navigating to ${idx}`);
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
    console.log('submitting');
  }

  renderCurrentStep (steps, idx) {
    const component = steps[idx];

    return React.cloneElement(component, {
      ref   : 'step',
      model : this.props.model
    });
  }

  render () {
    const { model } = this.props,
          { currentStepIndex } = this.state;

    const steps = this.props.children;

    const onFirstStep = currentStepIndex === 0,
          onLastStep  = currentStepIndex === steps.length - 1,
          wizardIsDisabled = this.props.disabled || this.state.submitting;

    return (
      <div className='halcyon'>
      <HalcyonStepNavigation steps={steps}
                             disabled={wizardIsDisabled}
                             currentStepIndex={currentStepIndex}
                             onChange={::this.onNavigationChange} />
        <div className='halcyon__viewport'>
          <div className='row'>
            <div className='col-xs-12'>
              {this.renderCurrentStep(steps, currentStepIndex)}
            </div>
          </div>
        </div>
        <HalcyonDirectionalNavigation currentStepIndex={currentStepIndex}
                                      onChange={::this.attemptToNavigateToIndex}
                                      disabled={wizardIsDisabled}
                                      disableBackwardNavigation={onFirstStep}
                                      disableForwardNavigation={onLastStep} />
      </div>
    );
  }
}
