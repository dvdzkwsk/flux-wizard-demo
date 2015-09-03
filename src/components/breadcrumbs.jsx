import React from 'react';
import { connect } from 'react-redux';
import { getComponentTitle } from '../lib/component';
import * as HalcyonActions from '../actions/wizard';

@connect(state => ({
  halcyon : state.halcyon
}))
export default class HalcyonBreadcrumbs extends React.Component {
  constructor () {
    super();
  }

  onClick (link) {
    const { index } = link;

    this.props.dispatch(HalcyonActions.openWizardIndex(index));
  }

  render () {
    const { halcyon } = this.props;

    const activeWizardIndex = halcyon.get('activeWizardIndex');
    console.log(activeWizardIndex);
    const crumbs = halcyon.get('wizards')
      .take(activeWizardIndex + 1)
      .flatMap(state => {
        const instance    = state.get('instance');
        const wizardIdx   = state.get('index');
        const steps       = instance.props.children.length ?
          instance.props.children : [instance.props.children];
        const activeStep  = steps[state.get('currentStepIndex')];

        return [instance, activeStep]
          .map(getComponentTitle)
          .map(title => ({ title, instance, index : wizardIdx }));
      })
      .toJS();

    return (
      <ol className='breadcrumb'>
        {crumbs.map((link, idx) => (
          <li key={idx}>
            <a href='#' onClick={this.onClick.bind(this, link)}>
              {link.title}
            </a>
          </li>
        ))}
      </ol>
    );
  }
}
