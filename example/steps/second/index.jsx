import React from 'react';
import EditContactName from './edit-contact-name';
import { Wizard as HalcyonWizard, Step as HalcyonStep } from 'halcyon';

export default class SecondStep extends HalcyonStep {
  constructor () {
    super();
    this.state = {
      selectedContact : null,
      hasOpenWizard   : false
    }
  }

  closeContactWizard () {
    this.showParentNavigation();
    this.setState({
      selectedContact : null,
      hasOpenWizard   : false
    });
  }

  editContact (contact) {
    this.hideParentNavigation();
    this.setState({
      selectedContact : contact,
      hasOpenWizard   : true
    });
  }

  _submitContactWizard () {

  }

  _cancelContactWizard () {

  }

  renderContactWizard () {
    return (
      <HalcyonWizard model={this.state.selectedContact}
                     onSubmit={::this._submitContactWizard}
                     onCancel={::this._cancelContactWizard}>
        <EditContactName />
      </HalcyonWizard>
    );
  }

  render () {
    const { contacts } = this.props.model;

    if (this.state.hasOpenWizard) {
      return this.renderContactWizard();
    }

    return (
      <div>
        <h1>Step 2</h1>

        {contacts.map((contact, idx) =>
          <p key={idx} onClick={this.editContact.bind(this, contact)}>
            Contact: {contact.name}
          </p>
        )}
      </div>
    )
  }
};
