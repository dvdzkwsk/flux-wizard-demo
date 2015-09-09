import React from 'react';
import EditUserInfoStep from './EditUserInfoStep';
import { halcyonStep, HalcyonWizard } from '../../src';

@halcyonStep('Edit User Friends')
export default class EditUserFriendsStep extends React.Component {
  static propTypes = {
    model : React.PropTypes.object.isRequired,
    setProperty : React.PropTypes.func.isRequired
  }

  constructor () {
    super();
    this.state = {
      wizardModel  : null,
      wizardSubmit : null
    };
  }

  _addFriend () {
    this.setState({
      wizardModel  : {},
      wizardSubmit : (model) => {
        this.props.setProperty('friends', [...this.props.model.friends, model]);
      }
    });
  }

  _closeSubwizard () {
    this.setState({
      wizardModel  : null,
      wizardSubmit : null
    });
  }

  renderFriendWizard () {
    return (
      <HalcyonWizard title='Friend Wizard'
                     model={this.state.wizardModel}
                     onCancel={::this._closeSubwizard}
                     onSubmit={(model) => {
                       this.state.wizardSubmit(model);
                       this._closeSubwizard();
                     }}>
        <EditUserInfoStep title='Edit Friend Info' />
      </HalcyonWizard>
    );
  }

  render () {
    const { model } = this.props;

    if (this.state.wizardModel) {
      return this.renderFriendWizard();
    }

    return (
      <div>
        <h2>Friends of {model.firstName} {model.lastName}</h2>
        <div className='list-group'>
          {model.friends.map((friend, idx) => (
            <button type='button' className='list-group-item' key={idx}>
              {friend.firstName} {friend.lastName}
            </button>
          ))}
        </div>
        <button className='btn btn-success' onClick={::this._addFriend}>
          Add a Friend
        </button>
      </div>
    );
  }
}
