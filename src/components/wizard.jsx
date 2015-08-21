import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as WizardActions from '../actions/wizard';
import HalcyonStepSelector from './step-selector';
import HalcyonDirectionalNavigation from './directional-navigation';

@connect(state => ({
  halcyon : state.halcyon
}))
export default class HalcyonWizard extends React.Component {
  static propTypes = {
    model : React.PropTypes.object.isRequired
  }

  constructor () {
    super();
  }

  bindActionCreatorsToWizard (actions) {
    const boundActions = bindActionCreators(actions, this.props.dispatch);

    for (const key in boundActions) {
      if (!this[key]) {
        this[key] = boundActions[key].bind(null, this);
      } else {
        console.warn([
          `Cannot apply action ${key} to HalcyonWizard instance because the`,
          `property already exists.`
        ].join(' '));
      }
    }
  }

  // ----------------------------------
  // Native Life Cycle Hooks
  // ----------------------------------
  componentWillMount () {
    this.bindActionCreatorsToWizard(WizardActions);
    this.createWizard();
    this.forceUpdate();
  }

  componentDidUnmount () {
    this.destroyWizard();
  }

  componentDidUpdate (prevProps) {
    const prevState = prevProps.halcyon.get(this);
    const state     = this.getCurrentState();

    // If this hook is called immediately after the wizard was created (during
    // the first render cycle) then return early since nothing actually changed.
    if (!state || !prevState) return;

    // Broadcast completed navigation event if step index has changed
    if (prevState.get('currentStepIndex') !== state.get('currentStepIndex')) {
      // do something?
    }
  }

  // ----------------------------------
  // Halcyon Life Cycle Definition
  // ----------------------------------
  // Determines whether or not a navigation attempt should be allowed to
  // continue. By default will always return true; to prevent a navigation
  // attempt return [Boolean] false.
  shouldWizardNavigate () {
    return true;
  }

  // ----------------------------------
  // Internal Halcyon Methods
  // ----------------------------------
  // Routes all internal navigation attempts (either from the navigation bar
  // or directional arrows). Helps hook into wizard and step lifecycle methods
  // to determine if the wizard should proceed with the navigation.
  // ------------------------
  // [Number] Target Step Index
  attemptToNavigateToIndex (idx) {
    if (this.shouldWizardNavigate() && this.refs.step.shouldStepLeave()) {
      this.navigateToIndex(idx);
    }
  }

  // Updates the active step index of the wizard
  // ------------------------
  // [Number] Target Step Index
  navigateToIndex (idx) {
    // this.wizardWillNavigate(idx);
    this.refs.step.stepWillLeave();

    // navigate...
    this.changeWizardStep(idx);
  }

  // Handler that receives change events from the Navigation component.
  // ------------------------
  // [Number] Target Step Index
  onNavigationChange (idx) {
    this.attemptToNavigateToIndex(idx);
  }

  // ----------------------------------
  // Wizard State Helpers
  // ----------------------------------
  getCurrentState () {
    const store = this.props.halcyon;

    return store && store.get(this);
  }

  getSteps () {
    return this.props.children.length ?
      this.props.children : [this.props.children];
  }

  getCurrentStepIndex () {
    return this.getCurrentState().get('currentStepIndex');
  }

  isOnFirstStep () {
    return this.getCurrentStepIndex() === 0;
  }

  isOnLastStep () {
    return this.getCurrentStepIndex() === this.getSteps().length - 1;
  }

  isDisabled () {
    return false;
  }

  // ----------------------------------
  // Rendering Logic
  // ----------------------------------
  renderStepComponent (component) {
    return React.cloneElement(component, {
      ref   : 'step',
      model : this.props.model,
      hideParentNavigation : this.hideNavigation,
      showParentNavigation : this.showNavigation
    });
  }

  renderStepSelector (state) {
    if (state.get('isNavigationHidden')) return;

    return (
      <HalcyonStepSelector steps={this.getSteps()}
                           disabled={this.isDisabled()}
                           currentStepIndex={this.getCurrentStepIndex()}
                           onChange={::this.onNavigationChange} />
    );
  }

  // If the navigation is currently hidden or there is only a single step
  // within the wizard, don't render.
  renderDirectionalNavigation (state) {
    if (state.get('isNavigationHidden') || this.getSteps().length <= 1) {
      return;
    }

    return (
      <HalcyonDirectionalNavigation currentStepIndex={this.getCurrentStepIndex()}
                                    onChange={::this.attemptToNavigateToIndex}
                                    disabled={this.isDisabled()}
                                    disableBackwardNavigation={this.isOnFirstStep()}
                                    disableForwardNavigation={this.isOnLastStep()} />
    );
  }

  renderWizardState (state) {
    const currentStep = this.getSteps()[this.getCurrentStepIndex()];

    return (
      <div>
        {this.renderStepSelector(state)}
        <div className='halcyon__viewport'>
          {this.renderStepComponent(currentStep)}
        </div>
        {this.renderDirectionalNavigation(state)}
      </div>
    );
  }

  render () {
    const state = this.getCurrentState();

    return (
      <div className='halcyon'>
        {state && this.renderWizardState(state)}
      </div>
    );
  }
}
