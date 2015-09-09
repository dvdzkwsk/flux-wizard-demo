import React                  from 'react';
import Immutable              from 'immutable';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import * as WizardActions     from '../actions/wizard';
import HalcyonViewportFooter  from './HalcyonViewportFooter';
import HalcyonStepSelector    from './HalcyonStepSelector';
import HalcyonBreadcrumbs     from './HalcyonBreadcrumbs';
import * as debug             from '../lib/debug';

/**
* Decorates an instance method to only be called when its caller is the active
* wizard instance. This helps to standardize and eliminate redundant
* "isActive()" checks at the top of render helper methods.
*
* @returns {function} lifts the target function so that it will only be called
* if its caller is the active wizard instance.
*/
function activeWizardOnly (target, key, descriptor) {
  const fn = descriptor.value;

  descriptor.value = function calledIfWizardIsActive () {
    return this.isActive() ? fn.call(this) : null;
  };

  return descriptor;
}

@connect(state => ({
  halcyon : state.halcyon
}))
export default class HalcyonWizard extends React.Component {
  static propTypes = {
    children      : React.PropTypes.oneOfType([
      React.PropTypes.element,
      React.PropTypes.arrayOf(React.PropTypes.element)
    ]),
    halcyon       : React.PropTypes.object.isRequired,
    model         : React.PropTypes.object.isRequired,
    onCancel      : React.PropTypes.func.isRequired,
    onSubmit      : React.PropTypes.func.isRequired,
    onModelChange : React.PropTypes.func,
    stepIndex     : React.PropTypes.number
  }

  constructor () {
    super();
  }

  /* eslint-disable */
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
  * @returns {object} returns `this` for chainability.
  */
  bindActionCreatorsToSelf (actions) {
    const boundActions = bindActionCreators(actions, this.props.dispatch);

    this._actions = this._actions || {};
    for (const key in boundActions) {
      if (!this[key]) {
        this._actions[key] = boundActions[key].bind(null, this);
      } else {
        debug.warn(
          `Cannot apply action ${key} to HalcyonWizard instance because the ` +
          `property already exists.`
        );
      }
    }
    return this;
  }
  /* eslint-enable */

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

    if (!this.getSteps().length) {
      debug.warn('Halcyon Wizard must have at least one child component.');
    }
  }

  componentWillUpdate (nextProps) {
    this._state = nextProps.halcyon.find(w => w.get('instance') === this);

    if (this.props.stepIndex !== nextProps.stepIndex) {
      this._actions.changeWizardStep(nextProps.stepIndex);
    }
  }

  componentWillUnmount () {
    this._actions.destroyWizard();
  }

  // ----------------------------------
  // Halcyon Life Cycle Definition
  // ----------------------------------
  isCurrentStepExitable () {
    return !(
      typeof this.refs.step.shouldStepExit === 'function' &&
      !this.refs.step.shouldStepExit()
    );
  }

  isCurrentStepValid () {
    return !(
      typeof this.refs.step.isStepValid === 'function' &&
      !this.refs.step.isStepValid()
    );
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
  * @param {integer} idx - Index of the target step.
  */
  attemptToNavigateToIndex (idx) {
    if (this.shouldWizardNavigate()) {
      this.navigateToIndex(idx);
    }
  }

  /**
  * Updates the active step of the wizard to the target index.
  * @param {integer} idx - Index of the target step.
  */
  navigateToIndex (idx) {
    this._actions.setWizardModel(this.refs.step.state.model);
    this._actions.changeWizardStep(idx);
  }

  // ----------------------------------
  // State Convenience Methods
  // ----------------------------------
  /**
  * @returns {Array.<Element>} Collection of direct child steps.
  */
  getSteps () {
    const steps = this.props.children;

    if (steps) {
      return Array.isArray(steps) ? steps : [steps];
    } else {
      return [];
    }
  }

  /**
  * @returns {Element} The active step component.
  */
  getCurrentStep () {
    return this.getSteps()[this.getCurrentStepIndex()];
  }

  /**
  * @returns {Number} The index of the active step.
  */
  getCurrentStepIndex () {
    return this._state.get('stepIndex');
  }

  /**
  * @returns {Boolean} whether or not the wizard can navigate backwards.
  */
  canNavigateBackward () {
    const stepIdx = this.getCurrentStepIndex();

    // If wizard is on the first step, prohibit backward navigation.
    if (stepIdx === 0) return false;

    // If all steps behind the current step are disabled, disable backward
    // navigation.
    const activePreviousSteps = this.getSteps()
      .filter((step, idx) => (
        idx < stepIdx && !step.props.disabled
      ));

    if (activePreviousSteps.length === 0) return false;

    // All checks pass, wizard can navigate backward.
    return true;
  }

  /**
  * @returns {Boolean} True iff the wizard is on the last step.
  */
  canNavigateForward () {
    const stepIdx = this.getCurrentStepIndex();

    // If wizard is on the last step, prohibit forward navigation.
    if (stepIdx === this.getSteps().length) return false;

    // If all steps ahead of the current step are disabled, disable forward
    // navigation.
    const activeFutureSteps = this.getSteps()
      .filter((step, idx) => (
        idx > stepIdx && !step.props.disabled
      ));

    if (activeFutureSteps.length === 0) return false;

    // All checks pass, wizard can navigate forward.
    return true;
  }

  /**
  * @returns {Boolean} True iff the wizard component is the active wizard.
  */
  isActive () {
    if (this._state) {
      const selfDepth = this._state.get('depth');

      return (selfDepth + 1) === this.props.halcyon.size;
    } else {
      return false;
    }
  }

  // ----------------------------------
  // Event Handlers
  // ----------------------------------
  _onCancel () {
    if (this.isCurrentStepExitable()) {
      this.props.onCancel();
    }
  }

  // TODO: this should update the reducer model and _then_ invoke callback
  _onSubmit () {
    const finalModel = this.refs.step.state.model;

    // Verify that the current step is exitable
    if (!this.isCurrentStepExitable()) {
      return debug.warn(
        `Could not submit wizard because the current step is not exitable.`
      );
    }

    // Verify that the current step is valid
    if (!this.isCurrentStepValid()) {
      return debug.warn(
        `Could not submit wizard because the current step is not valid.`
      );
    }

    this._actions.setWizardModel(finalModel);
    this.props.onSubmit(finalModel.toJS());
  }

  // ----------------------------------
  // Rendering Logic
  // ----------------------------------
  renderStepComponent (component) {
    if (!component) {
      debug.warn(
        `No component defined for step at index ${this.getCurrentStepIndex()}`
      );
      return null;
    }

    return React.cloneElement(component, {
      ref   : 'step',
      model : this._state.get('model')
    });
  }

  @activeWizardOnly
  renderBreadcrumbs () {
    return <HalcyonBreadcrumbs />;
  }

  @activeWizardOnly
  renderSidebar () {
    return (
      <div className='halcyon-wizard__sidebar'>
        <HalcyonStepSelector steps={this.getSteps()}
                             onSelect={::this.attemptToNavigateToIndex} />
      </div>
    );
  }

  @activeWizardOnly
  renderViewportFooter () {
    const navigate = this.attemptToNavigateToIndex;
    const currIdx  = this._state.get('stepIndex');

    return (
      <HalcyonViewportFooter onCancel={::this._onCancel}
                             onSubmit={::this._onSubmit}
                             onNext={navigate.bind(this, currIdx + 1)}
                             onPrevious={navigate.bind(this, currIdx - 1)}
                             disableNext={!this.canNavigateForward()}
                             disablePrevious={!this.canNavigateBackward()} />
    );
  }

  /**
  * Wizard now has a valid state attached to it, so we can render its current
  * step. However, due to UI requirements, we don't want to display redundant
  * step selectors/breadcrumbs/etc. if this is not the currently active wizard,
  * which is why the rendering logic for those components is separated into
  * smaller methods.
  *
  * NOTE: this differentation _cannot_ be separated in another render method
  * with different markup, because then subwizards would be re-rendered and
  * consequently lose their state (since state is tied to the component
  * instance). This should be investigated more thoroughly in the future.
  */
  renderWizardReadyState () {
    const wizardClasses = ['halcyon-wizard'];

    if (this.isActive()) {
      wizardClasses.push('halcyon-wizard--active');
    }

    return (
      <div className={wizardClasses.join(' ')}>
        {this.renderSidebar()}
        <div className='halcyon-wizard__viewport'>
          {this.renderBreadcrumbs()}
          <div className='halcyon-wizard__viewport__step'>
            {this.renderStepComponent(this.getCurrentStep())}
          </div>
          {this.renderViewportFooter()}
        </div>
      </div>
    );
  }

  /**
  * Render a base container with the wizard state only once the state exists.
  * This is important because since the component is responsible for creating
  * its own state in the Halcyon wizards reducer, the first render cycle won't
  * have a valid state.
  */
  render () {
    return (
      <div className='halcyon-container'>
        {this._state && this.renderWizardReadyState()}
      </div>
    );
  }
}
