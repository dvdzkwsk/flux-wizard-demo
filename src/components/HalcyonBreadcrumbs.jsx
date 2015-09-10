import React                 from 'react';
import { connect }           from 'react-redux';
import { getComponentTitle } from '../lib/component';
import * as debug            from '../lib/debug';

const mapDispatchToProps = (state) => ({
  wizards : state.halcyon
});
export class HalcyonBreadcrumbs extends React.Component {
  static propTypes = {
    wizards : React.PropTypes.object.isRequired
  }

  constructor () {
    super();
  }

  // TODO: this should be handled a bit more cleanly with the wizard
  // lifecycle hooks when time allows. Best idea would be for close/submit
  // events to be generated from the redux store, and have wizards simply
  // listen to them, that way these could cascade naturally without having
  // to manually hook into the instances.
  onClick (link) {

    // if target instance is the currently active instance, ignore.
    if (link.instance === this.props.wizards.last().get('instance')) {
      return null;
    }

    // Otherwise, find all the wizards that need to close in order to navigate
    // to the target instance.
    const wizardsThatNeedToClose = this.props.wizards
      .reverse()
      .takeUntil(w => w.get('instance') === link.instance);

    const wizardsThatCantClose = wizardsThatNeedToClose
      .filter(w => !w.get('instance').isCurrentStepExitable());

    if (wizardsThatCantClose.size) {
      debug.warn(
        `Cannot navigate to the target breadcrumb because ` +
        `${wizardsThatCantClose.size} are unable to close.`,
        wizardsThatCantClose
      );
    } else {
      wizardsThatNeedToClose.forEach(w => w.get('instance')._onCancel());
    }
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
      <ol className='halcyon-breadcrumbs'>
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

export default connect(mapDispatchToProps)(HalcyonBreadcrumbs);
