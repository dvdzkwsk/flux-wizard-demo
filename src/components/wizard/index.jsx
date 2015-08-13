import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { makeDefaultWizardState } from '../../utils';
import * as WizardActions from '../../actions/wizard';
import HalcyonStepNavigation from '../step-navigation/index.jsx';
import HalcyonDirectionalNavigation from '../directional-navigation/index.jsx';

@connect(state => ({
  wizards : state.wizards
}))
export default class HalcyonWizard extends React.Component {
  static propTypes = {
    model : React.PropTypes.object.isRequired
  }

  constructor () {
    super();
  }

  // If an entry exists for this wizard in the application store, return
  // that state, otherwise return the default wizard state. This is done
  // because the first render cycle will not have a valid wizard instance
  // since the createWizard action occurs on the component level.
  getCurrentState () {
    return this.props.wizards.get(this) || makeDefaultWizardState();
  }

  // Wrapper above Redux's "bindActionCreators" that also binds all actions
  // to the current wizard instance so that you don't have to pass "this"
  // as the first argument to every action.
  // e.g. what once was
  // this._actions.changeWizardStep(this, 2);
  // is now
  // this._actions.changeWizardStep(2);
  bindActionCreatorsToWizardInstance (actions) {
    const boundToWizardInstance = Object.keys(actions)
      .reduce((acc, key) => {
        acc[key] = actions[key].bind(null, this);
        return acc;
      }, {});

    return bindActionCreators(boundToWizardInstance, this.props.dispatch);
  }

  componentWillMount () {
    this._actions = this.bindActionCreatorsToWizardInstance(WizardActions);
    this._actions.createWizard();

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

    // Broadcast pending navigation if step index has changed
    if (state.get('currentStepIndex') !== newState.get('currentStepIndex')) {
      this.wizardWillNavigate();
    }
  }

  componentDidUpdate (prevProps) {
    const prevState = prevProps.wizards.get(this);
    const state     = this.getCurrentState();

    // If this hook is called immediately after the wizard was created (during
    // the first render cycle) then return early since nothing actually changed.
    if (!prevState) return;

    // Broadcast completed navigation event if step index has changed
    if (prevState.get('currentStepIndex') !== state.get('currentStepIndex')) {
      this.wizardWillNavigate();
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
    this._actions.changeWizardStep(idx);
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
      model : this.props.model,
      hideParentNavigation : this._actions.hideNavigation,
      showParentNavigation : this._actions.showNavigation
    });
  }

  renderStepNavigation () {
    return (
      <HalcyonStepNavigation steps={this.getSteps()}
                             disabled={this.isDisabled()}
                             currentStepIndex={this.getCurrentStepIndex()}
                             onChange={::this.onNavigationChange} />
    );
  }

  renderDirectionalNavigation () {
    return (
      <HalcyonDirectionalNavigation currentStepIndex={this.getCurrentStepIndex()}
                                    onChange={::this.attemptToNavigateToIndex}
                                    disabled={this.isDisabled()}
                                    disableBackwardNavigation={this.isOnFirstStep()}
                                    disableForwardNavigation={this.isOnLastStep()} />
    );
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

  render () {
    const state = this.getCurrentState();
    const isNavigationVisible = !state.get('isNavigationHidden');

    return (
      <div className='halcyon'>
        {isNavigationVisible && this.renderStepNavigation()}
        <div className='halcyon__viewport'>
          {this.renderStepComponent(this.getSteps()[this.getCurrentStepIndex()])}
        </div>
        {isNavigationVisible && this.renderDirectionalNavigation()}
      </div>
    );
  }
}
