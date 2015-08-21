import React from 'react';
import EditUserWizard from '../components/edit-user-wizard';
import { connect } from 'react-redux';

@connect(state => ({
  user : state.user
}))
export default class UserView extends React.Component {
  constructor () {
    super();
    this.state = {
      wizardModel   : null,
      hasOpenWizard : false
    };
  }

  editUser (user) {
    this.setState({
      wizardModel   : user,
      hasOpenWizard : true
    });
  }

  _handleWizardSubmit (model) {
    console.log('wizard submitted with', model);

    this.setState({
      wizardModel   : null,
      hasOpenWizard : false
    });
  }

  _handleWizardCancel () {
    this.setState({
      wizardModel   : null,
      hasOpenWizard : false
    });
  }

  renderEditUserWizard () {
    return (
      <EditUserWizard model={this.state.wizardModel}
                      onSubmit={this._handleWizardSubmit}
                      onCancel={this._handleWizardCancel} />
    );
  }

  render () {
    if (this.state.hasOpenWizard) {
      return this.renderEditUserWizard();
    }

    const user = this.props.user.toJS();

    return (
      <div>
        <h1>Example User View</h1>
        <h2>Friends List</h2>
        {user.friends.map((friend, idx) =>
          <div key={idx} onClick={this.editUser.bind(this, friend)}>
            <p>{friend.get('firstName')}</p>
          </div>
        )}
      </div>
    );
  }
}
