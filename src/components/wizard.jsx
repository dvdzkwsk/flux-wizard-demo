import React from 'react';
import Immutable from 'immutable';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as WizardActions from '../actions/wizard';
import HalcyonStepSelector from './step-selector';
import HalcyonDirectionalNavigation from './directional-navigation';
import HalcyonBreadcrumbs from './breadcrumbs';
import './wizard.scss';

@connect(state => ({
  halcyon : state.halcyon
}))
export default class HalcyonWizard extends React.Component {
  static propTypes = {
    // model    : React.PropTypes.object.isRequired,
    // onCancel : React.PropTypes.func.isRequired,
    // onSubmit : React.PropTypes.func.isRequired
  }

  static defaultProps = {

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
  * const actions = {
  *   foo : function () { ... }
  * };
  *
  * // instead of doing:
  * this.props.dispatch(actions.foo(this, ...));
  *
  * // you can do:
  * this.bindActionCreatorsToSelf(actions);
  * this.foo(...);
  * @param {object} actions - object that defines a map of functions where
  * the key is the function name and the value is its definition.
  * @returns {object} instance - returns `this` for chainability.
  */
  bindActionCreatorsToSelf (actions) {
    const boundActions = bindActionCreators(actions, this.props.dispatch);

    this._actions = this._actions || {};
    for (const key in boundActions) {
      if (!this[key]) {
        this._actions[key] = boundActions[key].bind(null, this);
      } else {
        console.warn([
          `Cannot apply action ${key} to HalcyonWizard instance because the`,
          `property already exists.`
        ].join(' '));
      }
    }
    return this;
  }

  // TODO: check if already immutable
  setModel (model) {
    console.log('setting model');
    this._actions.setWizardModel(Immutable.fromJS(model));
  }

  // ----------------------------------
  // Native Life Cycle Hooks
  // ----------------------------------
  componentWillMount () {
    this.bindActionCreatorsToSelf(WizardActions);
    this._actions.createWizard();
    this.setModel(Immutable.fromJS(this.props.model));
  }

  // TODO: fix duplicate destroyWizard() calls when the wizard is
  // submitted or cancelled.
  componentWillUnmount () {
    this._actions.destroyWizard();
  }

  componentDidUpdate (prevProps) {
    const currState = this.getState();
    const prevState = this.getStateFrom(prevProps.halcyon.get('wizards'));

    // If this hook is called immediately after the wizard was created (during
    // the first render cycle) then return early since nothing actually changed.
    if (!prevState || !currState) return;

    // if state hasn't changed then noop.
    if (currState === prevState) return;

    // do we need to do anything here? State has changed at this point.
  }

  // ----------------------------------
  // Halcyon Life Cycle Definition
  // ----------------------------------
  isCurrentStepExitable () {
    if (
      typeof this.refs.step.shouldStepExit === 'function' &&
      !this.refs.step.shouldStepExit()
    ) {
      return false;
    }

    return true;
  }

  isCurrentStepValid () {
    if (
      typeof this.refs.step.isStepValid === 'function' &&
      !this.refs.step.isStepValid()
    ) {
      return false;
    }

    return true;
  }

  /**
  * Determines whether or not a navigation attempt should be allowed to
  * continue. By default will always return true; to prevent a navigation
  * attempt return false.
  * @returns {boolean} Whether or not to stop a navigation attempt.
  */
  shouldWizardNavigate () {
    return this.isCurrentStepExitable() && this.isCurrentStepValid();
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
    if (this.shouldWizardNavigate()) {
      this.navigateToIndex(idx);
    }
  }

  /**
  * Updates the active step of the wizard to the target index.
  * @param {integer} Index of the target step.
  */
  navigateToIndex (idx) {
    this._actions.setWizardModel(this.refs.step.state.model);
    this._actions.changeWizardStep(idx);
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
  // TODO: Once MVP is complete, getState() methods can be optimized so that
  // the wizards collection is not filtered every single time a method
  // requests the current state.
  // ---------------------------------

  /**
  * @returns {Immutable.Map} State of the wizard instance if it exists i
  * the provided wizards collection.
  */
  getStateFrom (wizards) {
    return wizards.find(w => w.get('instance') === this);
  }

  /**
  * @returns {Immutable.Map} State of the current wizard instance.
  */
  getState () {
    return this.getStateFrom(this.props.halcyon.get('wizards'));
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
    return this.getState().get('currentStepIndex');
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

  /**
  *
  */
  isActive () {
    const selfIdx   = this.getState().get('index');
    const activeIdx = this.props.halcyon.get('activeWizardIndex');

    return selfIdx === activeIdx;
  }

  // ----------------------------------
  // Event Handlers
  // ----------------------------------
  _onCancel () {
    if (typeof this.props.onCancel === 'function') {
      this.props.onCancel();
    } else {
      console.warn([
        'No cancel event provided to HalcyonWizard instance; wizard will',
        'not destroy itself, it must be unmounted in its parent component.'
      ].join(' '));
    }
  }

  _onSubmit () {

  }

  // ----------------------------------
  // Rendering Logic
  // ----------------------------------
  renderStepComponent (component) {
    return React.cloneElement(component, {
      ref   : 'step',
      model : this.getState().get('model')
    });
  }

  renderSidebar (state) {
    if (!this.isActive()) return;

    return (
      <div className='halcyon-wizard__sidebar'>
        <HalcyonStepSelector steps={this.getSteps()}
                             currentStepIndex={state.get('currentStepIndex')}
                             onChange={::this.onNavigationChange} />
      </div>
    );
  }

  renderBreadcrumbs () {
    if (!this.isActive()) return;

    return (
      <HalcyonBreadcrumbs />
    );
  }

  renderDirectionalNavigation (state) {
    if (!this.isActive()) return;

    return (
      <HalcyonDirectionalNavigation currentStepIndex={this.getCurrentStepIndex()}
                                    onChange={::this.attemptToNavigateToIndex}
                                    disableBackwardNavigation={this.isOnFirstStep()}
                                    disableForwardNavigation={this.isOnLastStep()} />
    );
  }

  renderFooter (state) {
    if (!this.isActive()) return;

    return (
      <div className='halcyon-wizard__footer clearfix'>
        {this.renderDirectionalNavigation()}
        <div className='pull-right'>
          <button className='btn btn-danger' onClick={::this._onCancel}>
            Cancel
          </button>
          <button className='btn btn-success'>
            Submit
          </button>
        </div>
      </div>
    );
  }

  renderWizardState (state) {
    const currentStep = this.getSteps()[this.getCurrentStepIndex()];

    return (
      <div className='halcyon-wizard'>
        {this.renderSidebar(state)}
        <div className='halcyon-wizard__viewport'>
          {this.renderBreadcrumbs(state)}
          <div className='halcyon-wizard__viewport__step'>
            {this.renderStepComponent(currentStep)}
          </div>
          {this.renderFooter(state)}
        </div>
      </div>
    );
  }

  render () {
    const state = this.getState();

    return (
      <div className='halcyon-container'>
        {state && this.renderWizardState(state)}
      </div>
    );
  }
}
