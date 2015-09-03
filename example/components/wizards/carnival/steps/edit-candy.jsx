import React from 'react';
import { step as WizardStep } from 'halcyon';

@WizardStep
export default class EditCandy extends React.Component {
  constructor () {
    super();
    this.state = {
      doingSomethingImportant : false
    };
  }

  _doSomethingImportant () {
    this.setState({
      doingSomethingImportant : true
    });
    setTimeout(() => {
      this.setState({
        doingSomethingImportant : false
      });
    }, 5000);
  }

  shouldStepExit () {
    if (this.state.doingSomethingImportant) {
      console.error('Step is currently doing something important, please wait.');
      return false;
    }
    return true;
  }

  isStepValid () {
    const { candies } = this.props.model;

    for (let i=0, len=this.props.model.candies.length; i<len; i++) {
      let price = candies[i].price.trim();

      if (!price || isNaN(parseInt(price))) {
        console.error(`${candies[i].name} has an invalid price`);
        return false;
      }
    }

    return true;
  }

  render () {
    return (
      <div>
        {this.props.model.candies.map((c, idx) => (
          <div className='form-group' key={idx}>
            <label className='control-label'>{c.name} Cost</label>
            <input className='form-control'
                   value={c.price}
                   onChange={this.props.bindTo(`candies.${idx}.price`)} />
          </div>
        ))}
        <button className='btn btn-block btn-info'
                onClick={::this._doSomethingImportant}>
          Do Something Important
        </button>
      </div>
    );
  }
}
