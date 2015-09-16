import React                  from 'react';
import Immutable              from 'immutable';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import invariant              from 'invariant';
import classnames             from 'classnames';
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
export function activeWizardOnly (target, key, descriptor) {
  const fn = descriptor.value;

  descriptor.value = function calledIfWizardIsActive () {
    return this.isActive() ? fn.call(this) : null;
  };

  return descriptor;
}

const mapDispatchToProps = (state) => ({
  wizards : state.halcyon
});
export class HalcyonWizard extends React.Component {
  static propTypes = {
    children      : React.PropTypes.oneOfType([
      React.PropTypes.element,
      React.PropTypes.arrayOf(React.PropTypes.element)
    ]),
    wizards       : React.PropTypes.object.isRequired,
    model         : React.PropTypes.object.isRequired,
    dispatch      : React.PropTypes.func.isRequired,
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

  setModel (model) {
    this._actions.setWizardModel(Immutable.fromJS(model));
  }

  // ----------------------------------
  // Native Life Cycle Hooks
  // ----------------------------------
  componentWillMount () {
    this.bindActionCreatorsToSelf(WizardActions);
    this._actions.createWizard(Immutable.fromJS(this.props.model));

    invariant(
      this.props.children,
      'A HalcyonWizard must include at least one step.'
    );
  }

  componentDidUpdate (prevProps) {
    const prevState = prevProps.wizards.find(w => w.get('instance') === this);

    // If the model has changed, invoke the onModelChange hook.
    if (
      prevState &&
      typeof this.props.onModelChange === 'function' &&
      this._state.get('model') !== prevState.get('model')
    ) {
      this.props.onModelChange(this._state.get('model').toJS());
    }
  }

  componentWillUpdate (nextProps) {
    this._state = nextProps.wizards.find(w => w.get('instance') === this);

    invariant(
      this._state,
      'Wizard update received but no reference was found for it in the ' +
      'Redux store. Make sure your component instance did not change.'
    );

    // If Wizard component receives a new stepIndex override, then update
    // the internal step index.
    if (
      typeof nextProps.stepIndex === 'number' &&
      this.props.stepIndex !== nextProps.stepIndex
    ) {
      this._actions.changeWizardStep(nextProps.stepIndex);
    }
  }

  componentWillUnmount () {
    this._actions.destroyWizard();
  }

  // ----------------------------------
  // Halcyon Life Cycle Definition
  // ----------------------------------
  /**
  * Determines whether or not the current step component can be safely
  * exited by invoking its "shouldStepExit" method.
  * @returns {Boolean} whether or not the current step is valid.
  */
  isCurrentStepExitable () {
    if (typeof this.refs.step.shouldStepExit === 'function') {
      return this.refs.step.shouldStepExit();
    } else {
      debug.warn(
        'Current step did not provide a "shouldStepExit" method, ' +
        'wizard will assume step is exitable and continue.'
      );
      return true;
    }
  }

  /**
  * Determines whether or not the current step component is valid by
  * invoking its "isStepValid" method.
  * @returns {Boolean} whether or not the current step is valid.
  */
  isCurrentStepValid () {
    if (typeof this.refs.step.isStepValid === 'function') {
      return this.refs.step.isStepValid();
    } else {
      debug.warn(
        'Current step did not provide an "isStepValid" method, ' +
        'wizard will assume model is valid and continue.'
      );
      return true;
    }
  }

  /**
  * Determines whether or not a navigation attempt should be allowed to
  * continue. By default will always return true; to prevent a navigation
  * attempt return false.
  * @returns {Boolean} Whether or not to stop a navigation attempt.
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
  * @param {Int} idx - Index of the target step.
  */
  attemptToNavigateToIndex (idx) {
    if (this.shouldWizardNavigate()) {
      this.navigateToIndex(idx);
    }
  }

  /**
  * Updates the active step of the wizard to the target index.
  * @param {Int} idx - Index of the target step.
  */
  navigateToIndex (idx) {
    this._actions.setWizardModel(this.refs.step.state.model);
    this._actions.changeWizardStep(idx);
  }

  // ----------------------------------
  // State Convenience Methods
  // ----------------------------------
  /**
  * @returns {Array<React.Component>} Collection of direct child steps.
  */
  getSteps () {
    const steps = this.props.children;

    return Array.isArray(steps) ? steps : [steps];
  }

  /**
  * @returns {React.Component} The active step component.
  */
  getCurrentStep () {
    return this.getSteps()[this.getCurrentStepIndex()];
  }

  /**
  * @returns {Int} The index of the active step.
  */
  getCurrentStepIndex () {
    return this._state.get('stepIndex');
  }

  /**
  * Determines whether or not the wizard is able to navigate backwards by
  * checking how many non-disabled steps exist behind the current step.
  * @returns {Boolean} whether or not the wizard can navigate backward.
  */
  canNavigateBackward () {
    const stepIdx = this.getCurrentStepIndex();

    // If wizard is on the first step it's not possible to go backward.
    if (stepIdx === 0) return false;

    // Find all navigable steps behind the current step (i.e. steps that
    // aren't disabled). If there is at least one available previous step,
    // then allow backward navigation.
    const availablePreviousSteps = this.getSteps()
      .filter((step, idx) => idx < stepIdx && !step.props.disabled)

    return availablePreviousSteps.length > 0;
  }

  /**
  * Determines whether or not the wizard is able to navigate forward by
  * checking how many non-disabled steps exist ahead of the current step.
  * @returns {Boolean} whether or not the wizard can navigate forward.
  */
  canNavigateForward () {
    const stepIdx = this.getCurrentStepIndex();
    const steps   = this.getSteps();

    // If wizard is on the last step it's not possible to go forward.
    if (stepIdx === steps.length) return false;

    // Find all navigable steps ahead of the current step (i.e. steps that
    // aren't disabled). If there is at least one available future step,
    // then allow forward navigation.
    const availableFutureSteps = steps
      .filter((step, idx) => idx > stepIdx && !step.props.disabled);

    return availableFutureSteps.length > 0;
  }

  /**
  * @returns {Boolean} Whether or not the current wizard instance is the
  * active wizard within the set of all instantiated wizards. This is based
  * on its position on the wizard stack, where the active wizard is at The
  * bottom of the stack (newest).
  */
  isActive () {
    const selfDepth = this._state.get('depth');

    return (selfDepth + 1) === this.props.wizards.size;
  }

  // ----------------------------------
  // Event Handlers
  // ----------------------------------
  /**
  * Handler invoked when the user cancels a wizard (this can be called
  * through indirect means such as breadcrumb selection). Checks to see
  * whether the current step can be safely exited (just as in step-to-step
  * navigation), but does _not_ care if the current step is valid or not,
  * since the model will be thrown out.
  */
  _onCancel () {
    if (this.isCurrentStepExitable()) {
      invariant(
        typeof this.props.onCancel === 'function',
      );

      this.props.onCancel();
    }
  }

  /**
  * Handler invoked when the user submits the wizard. Checks to see whether
  * the current step can be safely exited (similar to checks performed during
  * navigation attempts), and if all checks pass updates the internal model
  * and invoking the onSubmit handler provided through props.
  */
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
  /**
  * Renders the active step component based on the "stepIndex" provided by
  * the global state for this wizard instance. Applies additional properties
  * to the target component for convenience, including:
  * -------------------------
  * {ref} ref - React ref for internal use.
  * {Immutable.Map} model - current state of the tracked internal model,
  * originally supplied through props.model.
  * -------------------------
  * @returns {React.Component} Active step component
  */
  renderStepComponent (component) {
    invariant(component,
      'No component found in this.props.children for the active step index.'
    );

    return React.cloneElement(component, {
      ref   : 'step',
      model : this._state.get('model')
    });
  }

  /**
  * Renders the HalcyonBreadcrumbs component iff the current wizard instance
  * is the active wizard.
  * @returns {React.Component} HalcyonViewportFooter
  */
  @activeWizardOnly
  renderBreadcrumbs () {
    return <HalcyonBreadcrumbs />;
  }

  /**
  * TODO: Refactor this into a HalcyonSidebar Component.
  * Renders the sidebar component iff the current wizard instance
  * is the active wizard.
  * @returns {DOM} Regular DOM element wrapping the HalcyonStepSelector.
  */
  @activeWizardOnly
  renderSidebar () {
    return (
      <div className='halcyon-wizard__sidebar'>
        <HalcyonStepSelector steps={this.getSteps()}
                             onSelect={::this.attemptToNavigateToIndex} />
      </div>
    );
  }

  /**
  * Renders the HalcyonViewportFooter component iff the current wizard instance
  * is the active wizard.
  * @returns {React.Component} HalcyonViewportFooter
  */
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
    const classes = classnames('halcyon-wizard', {
      'halcyon-wizard--active' : this.isActive()
    });

    return (
      <div className={classes}>
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

export default connect(mapDispatchToProps)(HalcyonWizard);
