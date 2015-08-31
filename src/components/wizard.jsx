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

  /**
  * Takes a map of action creators and binds them to the Redux dispatcher and
  * then directly to the wizard class instance. This faciliates dispatching
  * Halcyon-specific actions because callers no longer need to specify `this`
  * as the first argument to specify the target instance.
  * @example
  * const halcyonActions = {
  *   foo : function () { ... }
  * };
  *
  * // instead of doing:
  * this.props.dispatch(halcyonActions.foo(this, ...));
  *
  * // you can do:
  * this.bindActionCreatorsToWizard(halcyonActions);
  * this.foo(...);
  * @param {object} actions - object that defines a map of functions where
  * the key is the function name and the value is its definition.
  */
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
  }

  componentDidUnmount () {
    this.destroyWizard();
  }

  componentDidUpdate (prevProps) {
    const prevState = prevProps.halcyon.get(this);
    const currState = this.getCurrentState();

    // If this hook is called immediately after the wizard was created (during
    // the first render cycle) then return early since nothing actually changed.
    if (!currState || !prevState) return;

    // Broadcast completed navigation event if step index has changed
    if (prevState.get('currentStepIndex') !== currState.get('currentStepIndex')) {
      // do something?
    }
  }

  // ----------------------------------
  // Halcyon Life Cycle Definition
  // ----------------------------------
  /**
  * Determines whether or not a navigation attempt should be allowed to
  * continue. By default will always return true; to prevent a navigation
  * attempt return false.
  * @returns {boolean} Whether or not to stop a navigation attempt.
  */
  shouldWizardNavigate () {
    return true;
  }

  // ----------------------------------
  // Internal Halcyon Methods
  // ----------------------------------
  /**
  * Routes all internal navigation attempts. Helps hook into lifecycle methods
  * to determine if the wizard should proceed with the navigation.
  * @param {integer} Index of the target step.
  */
  attemptToNavigateToIndex (idx) {
    if (this.shouldWizardNavigate() && this.refs.step.shouldStepLeave()) {
      this.navigateToIndex(idx);
    }
  }

  /**
  * Updates the active step of the wizard to the target index. Invokes
  * "stepWillLeave" life cycle method in HalcyonStep before the step is
  * unmounted.
  * @param {integer} Index of the target step.
  */
  navigateToIndex (idx) {
    if (typeof this.refs.step.stepWillLeave === 'function') {
      this.refs.step.stepWillLeave();
    }
    this.changeWizardStep(idx);
  }

  /**
  * Handler that receives change events from navigation components. Helps
  * to separate concerns between a requested navigation change and any
  * actual action taken within the wizard.
  * @param {integer} Index of the target step.
  */
  onNavigationChange (idx) {
    this.attemptToNavigateToIndex(idx);
  }

  // ----------------------------------
  // State Convenience Methods
  // ----------------------------------
  /**
  * @returns {Map|Undefined} State of the current wizard instance.
  */
  getCurrentState () {
    return this.props.halcyon
      .find(w => w.get('instance') === this);
  }

  /**
  * @returns {array} Collection of direct child steps.
  */
  getSteps () {
    return this.props.children.length ?
      this.props.children : [this.props.children];
  }

  /**
  * @returns {number} The index of the active step.
  */
  getCurrentStepIndex () {
    return this.getCurrentState().get('currentStepIndex');
  }

  /**
  * @returns {boolean} True iff the wizard is on the first step.
  */
  isOnFirstStep () {
    return this.getCurrentStepIndex() === 0;
  }

  /**
  * @returns {boolean} True iff the wizard is on the last step.
  */
  isOnLastStep () {
    return this.getCurrentStepIndex() === this.getSteps().length - 1;
  }

  /**
  * @returns {boolean} Whether or not the wizard is in a disabled state.
  */
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
      <div className='col-sm-3 halcyon__step-selector'>
        <HalcyonStepSelector steps={this.getSteps()}
                             currentStepIndex={state.get('currentStepIndex')}
                             onChange={::this.onNavigationChange} />
      </div>
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
                                    disableBackwardNavigation={this.isOnFirstStep()}
                                    disableForwardNavigation={this.isOnLastStep()} />
    );
  }

  renderBreadCrumbs () {
    const parents = this.props.halcyon
      .takeUntil(w => w.get('instance') === this)
      .map(p => p.get('instance').props.name)
      .toJS();

    if (parents.length) {
      return parents.map((p, idx) =>
        <p key={idx}>{p}</p>
      );
    }
  }

  renderWizardState (state) {
    const currentStep   = this.getSteps()[this.getCurrentStepIndex()];
    const viewportWidth = state.get('isNavigationHidden') ?
      12 : 9;

    return (
      <div className='row'>
        {this.renderStepSelector(state)}
        <div className={`halcyon__viewport col-sm-${viewportWidth}`}>
          {this.renderBreadCrumbs()}
          {this.renderStepComponent(currentStep)}
        </div>
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
