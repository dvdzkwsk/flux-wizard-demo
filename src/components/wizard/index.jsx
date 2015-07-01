import React, { Component as ReactComponent } from 'react';
import HalcyonNavigationBar from '../navigation';
import HalcyonStep from '../step';
import HalcyonActions from '../../actions';
import HalcyonStore from '../../stores/halcyon';
import { warn } from '../../lib/logger';

class HalcyonWizard extends ReactComponent {
  constructor () {
    super();
    this._name = this.title || this.name;
    this.state = {
      currentStepIndex : 0
    };
  }

  componentWillMount () {
    HalcyonActions.create(this._name);
    HalcyonStore.addChangeListener(::this.handleStoreUpdate);
  }

  componentDidUnmount () {
    HalcyonStore.destroy(this._name);
    HalcyonStore.removeChangeListener(::this.handleStoreUpdate);
  }

  // ----------------------------------
  // Store Update Handler
  // ----------------------------------
  handleStoreUpdate () {
    const {
      model,
      currentStepIndex
    } = HalcyonStore.getWizardStateFor(this._name);

    this.setState({
      model : model,
      currentStepIndex : currentStepIndex
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
    warn('Life Cycle Method .wizardWillNavigate() not implemented.');
  }

  // Called after the wizard successfuly navigates to a new step. No arguments
  // are provided.
  wizardDidNavigate () {
    warn('Life Cycle Method .wizardDidNavigate() not implemented.');
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
    if (this.shouldWizardNavigate()) {
      HalcyonActions.navigateToIndex(this._name, idx);
    }
  }

  // Updates the active step index of the wizard
  // ------------------------
  // [Number] Target Step Index
  navigateToIndex (idx) {
    this.wizardWillNavigate(this.props.activeStepIndex, idx);
  }

  // Handler that receives change events from the Navigation component.
  // ------------------------
  // [Number] Target Step Index
  onNavigationChange (idx) {
    this.attemptToNavigateToIndex(idx);
  }

  render () {
    const disableNavigation = this.props.disabled;

    return (
      <div className='halcyon'>
        <HalcyonNavigationBar steps={this.props.steps}
                              disabled={disableNavigation}
                              activeStepIndex={this.state.currentStepIndex}
                              onChange={::this.onNavigationChange} />
        <div className='container halcyon__viewport'>
          <h1>On step: {this.state.currentStepIndex}</h1>
        </div>
      </div>
    );
  }
}

HalcyonWizard.propTypes = {
  steps : React.PropTypes.array.isRequired
};

export default HalcyonWizard;
