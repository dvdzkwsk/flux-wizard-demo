import React, { Component as ReactComponent } from 'react';
import ExampleModelActions from '../../actions/example-model';

class TitleInput extends ReactComponent {
  constructor () {
    super();
  }

  onChange (e) {
    ExampleModelActions.updateLeaf(this.props.leaf, e.target.value);
  }

  render () {
    return (
      <div className='form-group'>
        <label className='control-label'>Title</label>
        <input className='form-control'
               value={this.props.value}
               onChange={::this.onChange} />
      </div>
    );
  }
}

TitleInput.defaultProps = {
  value : ''
};

TitleInput.propTypes = {
  leaf  : React.PropTypes.array.isRequired,
  value : React.PropTypes.string
};

export default TitleInput;
