import React                  from 'react';
import Immutable              from 'immutable';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import * as WizardActions     from '../actions/wizard';
import { alwaysArray }        from '../lib/array';
import HalcyonViewportFooter  from './HalcyonViewportFooter';
import HalcyonStepSelector    from './HalcyonStepSelector';
import HalcyonNavigation      from './HalcyonDirectionalNavigation';
import HalcyonBreadcrumbs     from './HalcyonBreadcrumbs';
import '../styles/HalcyonWizard.scss';

@connect(state => ({
  halcyon : state.halcyon
}))
export default class HalcyonWizard extends React.Component {
  static propTypes = {
    model    : React.PropTypes.object.isRequired,
    onCancel : React.PropTypes.func.isRequired,
    onSubmit : React.PropTypes.func.isRequired
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
    this._actions.setWizardModel(Immutable.fromJS(model));
  }

  // ----------------------------------
  // Native Life Cycle Hooks
  // ----------------------------------
  componentWillMount () {
    this.bindActionCreatorsToSelf(WizardActions);
    this._actions.createWizard(Immutable.fromJS(this.props.model));
  }

  componentWillUpdate (nextProps, nextState) {
    this._state = nextProps.halcyon.find(w => w.get('instance') === this);
  }

  componentWillUnmount () {
    this._actions.destroyWizard();
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
  * @returns {array} Collection of direct child steps.
  */
  getSteps () {
    return alwaysArray(this.props.children);
  }

  /**
  * @returns {number} The index of the active step.
  */
  getCurrentStep () {
    return this.getSteps()[this._state.get('stepIndex')];
  }

  /**
  * @returns {number} The index of the active step.
  */
  getCurrentStepIndex () {
    return this._state.get('stepIndex');
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
  *
  */
  isActive () {
    const selfDepth = this.getState().get('depth');

    return selfDepth === this.props.halcyon.size;
  }

  // ----------------------------------
  // Event Handlers
  // ----------------------------------
  _onCancel () {
    if (!this.isCurrentStepExitable()) {
      return;
    }

    if (typeof this.props.onCancel === 'function') {
      this.props.onCancel();
    } else {
      console.warn([
        'No cancel event provided to HalcyonWizard instance; wizard will',
        'not destroy itself, it must be unmounted in its parent component.'
      ].join(' '));
    }
  }

  // TODO: validate current step
  // TODO: validate all steps
  // TODO: this should update the reducer model and _then_ invoke callback
  _onSubmit () {
    const model = this.refs.step.state.model.toJS();

    // this._actions.setWizardModel(this.refs.step.state.model);
    this.props.onSubmit(model);
  }

  // ----------------------------------
  // Rendering Logic
  // ----------------------------------
  renderStepComponent (component) {
    return React.cloneElement(component, {
      ref   : 'step',
      model : this._state.get('model')
    });
  }

  renderWizardReadyState (state) {
    return (
      <div className='halcyon-wizard'>
        <div className='halcyon-wizard__viewport'>
          <HalcyonBreadcrumbs />
          <div className='halcyon-wizard__viewport__step'>
            {this.renderStepComponent(this.getCurrentStep())}
          </div>
        </div>
      </div>
    );
  }

  render () {
    return (
      <div className='halcyon-container'>
        {this._state && this.renderWizardReadyState(this._state)}
      </div>
    );
  }
}
