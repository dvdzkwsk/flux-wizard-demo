import React               from 'react';
import EditUserInfoStep    from './EditUserInfoStep';
import EditUserFriendsStep from './EditUserFriendsStep';
import { HalcyonWizard }   from '../../src';
import * as debug          from '../../src/lib/debug';

export default class EditUserWizard extends React.Component {
  static propTypes = {
    title : React.PropTypes.string,
    model : React.PropTypes.object.isRequired
  }

  static defaultProps = {
    title : 'Edit User Wizard'
  }

  constructor () {
    super();
    this.state = {
      stepOverride : null
    };
  }

  _onModelChange (model) {
    debug.log('model change received', model);
  }

  // do some mock async validation
  _onSubmit (model) {
    setTimeout(() => {
      if (model.age < 30) {
        debug.error('Woah, server says users actually have to be at least 30!');
        this.setState({
          stepOverride : 0
        });
      }
    }, 1000);
  }

  _onCancel () {}

  render () {
    return (
      <HalcyonWizard title={this.props.title}
                     model={this.props.model}
                     stepIndex={this.state.stepOverride}
                     onSubmit={::this._onSubmit}
                     onCancel={::this._onCancel}
                     onModelChange={::this._onModelChange}>
        <EditUserInfoStep />
        <EditUserFriendsStep />
      </HalcyonWizard>
    );
  }
}
