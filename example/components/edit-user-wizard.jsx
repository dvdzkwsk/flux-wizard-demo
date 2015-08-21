import React from 'react';
import { Wizard as HalcyonWizard } from 'halcyon';
import EditUserInfoStep from './edit-user-info-step';
import EditUserFriendsStep from './edit-user-friends-step';

export default class EditUserWizard extends React.Component {
  static propTypes = {
    model    : React.PropTypes.object.isRequired,
    onSubmit : React.PropTypes.func.isRequired
  }

  constructor () {
    super();
  }

  render () {
    const { model, onSubmit } = this.props;

    return (
      <HalcyonWizard model={model} onSubmit={onSubmit}>
        <EditUserInfoStep />
        <EditUserFriendsStep />
      </HalcyonWizard>
    );
  }
}
