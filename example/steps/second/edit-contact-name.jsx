import React from 'react';
import Halcyon from 'halcyon';

export default class EditContactName extends Halcyon.Step {
  constructor () {
    super();
    this.state = {
      name : ''
    };
  }

  componentWillMount () {
    this.setState({
      name : this.props.model.name
    });
  }

  _onChange (e) {
    this.setState({
      name : e.target.value
    });
  }

  render () {
    return (
      <div>
        <h2>Editing {this.props.model.name}</h2>
        <input onChange={::this._onChange} value={this.state.name} />
      </div>
    );
  }
};
