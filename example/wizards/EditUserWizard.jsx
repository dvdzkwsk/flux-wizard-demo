import React               from 'react';
import { HalcyonWizard }   from 'halcyon';
import EditUserInfoStep    from './EditUserInfoStep';
import EditUserFriendsStep from './EditUserFriendsStep';

export default class EditUserWizard extends React.Component {
  static defaultProps = {
    title : 'Edit User Wizard'
  }

  constructor () {
    super();
  }

  render () {
    return (
      <HalcyonWizard {...this.props}>
        <EditUserInfoStep />
        <EditUserFriendsStep />
      </HalcyonWizard>
    );
  }
}
