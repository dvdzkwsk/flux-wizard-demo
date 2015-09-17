import React               from 'react';
import EditUserInfoStep    from '../steps/EditUserInfoStep';
import EditUserFriendsStep from '../steps/EditUserFriendsStep';
import { HalcyonWizard }   from '../../src';

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
    console.log('model change received', model);
  }

  // do some mock async validation
  _onSubmit (model) {
    console.log('OLD MODEL');
    console.log(this.props.model);

    console.log('NEW MODEL');
    console.log(model);
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
