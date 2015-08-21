import React from 'react';
import { Step as HalcyonStep } from 'halcyon';

export default class EditUserInfoStep extends HalcyonStep {
  constructor () {
    super();
  }

  render () {
    return (
      <h2>Edit User</h2>
    );
  }
}
