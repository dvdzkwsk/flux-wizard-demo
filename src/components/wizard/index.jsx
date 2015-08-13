import React from 'react';
import { connect } from 'react-redux';
import * as WizardActions from '../../actions/wizard';
import HalcyonStepNavigation from '../step-navigation/index.jsx';
import HalcyonDirectionalNavigation from '../directional-navigation/index.jsx';

@connect(state => ({
  wizards : state.wizard
}))
export default class HalcyonWizard extends React.Component {
  static propTypes = {
    model : React.PropTypes.object.isRequired
  }

  constructor () {
    super();
  }

  getCurrentState () {
    return this.props.wizards.get(this);
  }

  componentWillMount () {
    this.props.dispatch(WizardActions.createWizard(this));
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
    this.props.dispatch(WizardActions.destroyWizard(this));
  }

  componentWillUpdate (nextProps) {
    const state    = this.getCurrentState();
    const newState = nextProps.wizards.get(this);

    // If no state exists for this wizard it was just created, so return early.
    if (!state) return;

    // Broadcast pending navigation if step index has changed
    if (state.get('currentStepIndex') !== newState.get('currentStepIndex')) {
      this.wizardWillNavigate();
    }
  }

  componentDidUpdate (prevProps, prevState) {
    // if (prevState.currentStepIndex !== this.state.currentStepIndex) {
    //   this.wizardDidNavigate();
    // }
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

  renderStepComponent (component) {
    return React.cloneElement(component, {
      ref   : 'step',
      model : this.props.model
    });
  }

  renderLoadingState () {
    return <p>loadding placeholder</p>;
  }

  renderLoadedState (state) {
    const { currentStepIndex } = state;

    // state helpers
    const isOnFirstStep = currentStepIndex === 0,
          isOnLastStep  = currentStepIndex === steps.length - 1,
          isDisabled    = false;

    return (
      <div className='halcyon'>
        <HalcyonStepNavigation steps={steps}
                               disabled={isDisabled}
                               currentStepIndex={currentStepIndex}
                               onChange={::this.onNavigationChange} />
        <div className='halcyon__viewport'>
          {this.renderStepComponent(this.props.children[currentStepIndex])}
        </div>
        <HalcyonDirectionalNavigation currentStepIndex={currentStepIndex}
                                      onChange={::this.attemptToNavigateToIndex}
                                      disabled={isDisabled}
                                      disableBackwardNavigation={isOnFirstStep}
                                      disableForwardNavigation={isOnLastStep} />
      </div>
    );
  }

  render () {
    console.log('===== RENDERING WIZARD =====');
    const state = this.props.wizards.get(this);

    if (state) {
      return this.renderLoadedState(state.toJS());
    } else {
      return this.renderLoadingState();
    }
  }
}
