import React                 from 'react';
import { connect }           from 'react-redux';
import { alwaysArray }       from '../lib/array';
import { getComponentTitle } from '../lib/component';
import * as HalcyonActions   from '../actions/wizard';

@connect(state => ({
  halcyon : state.halcyon
}))
export default class HalcyonBreadcrumbs extends React.Component {
  constructor () {
    super();
  }

  onClick (link) {
    // const { index } = link;

    console.log('clicked', link);
    // this.props.dispatch(HalcyonActions.openWizardIndex(index));
  }

  getBreadcrumbsForWizards (wizards) {
    return wizards
      .flatMap(wizard => {
        const instance   = wizard.get('instance'),
              steps      = alwaysArray(instance.props.children),
              activeStep = steps[wizard.get('stepIndex')];

        return [instance, activeStep]
          .map(getComponentTitle)
          .map(title => ({ title, instance }))
      });
  }

  render () {
    const breadcrumbs = this.getBreadcrumbsForWizards(this.props.halcyon);

    return (
      <ol className='breadcrumb'>
        {breadcrumbs.toJS().map((link, idx) => (
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
