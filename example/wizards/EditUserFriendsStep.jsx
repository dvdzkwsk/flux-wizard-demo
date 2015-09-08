import React           from 'react';
import { HalcyonStep } from 'halcyon';

@HalcyonStep('Edit User Friends')
export default class EditUserFriendsStep extends React.Component {
  constructor () {
    super();
  }

  render () {
    const { model } = this.props;

    return (
      <div>
      </div>
    );
  }
}
