import React           from 'react';
import { HalcyonStep } from 'halcyon';

@HalcyonStep('Edit User Info')
export default class EditUserInfoStep extends React.Component {
  constructor () {
    super();
  }

  _onAgeChange (e) {
    console.log(e.target.value);
  }

  render () {
    const { model } = this.props;

    return (
      <div>
        <div className='form-group'>
          <label>First Name</label>
          <input className='form-control'
                 value={model.firstName}
                 onChange={this.props.bindTo('firstName')} />
        </div>
        <div className='form-group'>
          <label>Last Name</label>
          <input className='form-control'
                 value={model.lastName}
                 onChange={this.props.bindTo('lastName')}/>
        </div>
        <div className='form-group'>
          <label>Age</label>
          <input type='number'
                 className='form-control'
                 value={model.age}
                 onChange={::this._onAgeChange}/>
        </div>
      </div>
    );
  }
}
