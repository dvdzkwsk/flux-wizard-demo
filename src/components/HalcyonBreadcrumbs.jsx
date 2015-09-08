import React                 from 'react';
import { connect }           from 'react-redux';
import { getComponentTitle } from '../lib/component';
import * as HalcyonActions   from '../actions/wizard';

@connect(state => ({
  wizards : state.halcyon
}))
export default class HalcyonBreadcrumbs extends React.Component {
  constructor () {
    super();
  }

  onClick (link) {
    console.log('clicked', link);
  }

  getBreadcrumbsForWizards (wizards) {
    return wizards
      .flatMap(wizard => {
        const instance   = wizard.get('instance'),
              activeStep = instance.getCurrentStep();

        return [instance, activeStep]
          .map(component => ({
            title    : getComponentTitle(component),
            instance : instance
          }));
      }).toJS();
  }

  render () {
    const breadcrumbs = this.getBreadcrumbsForWizards(this.props.wizards);

    return (
      <ol className='breadcrumb'>
        {breadcrumbs.map((link, idx) => (
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
