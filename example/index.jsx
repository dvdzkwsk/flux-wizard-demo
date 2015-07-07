import React, { Component as ReactComponent } from 'react';
import Halcyon from 'halcyon';
import ExampleWizard from './wizard';
import ExampleModelStore from './stores/example-model';

class ExampleApp extends ReactComponent {
  constructor () {
    super();
    this.state = {
      model : ExampleModelStore.get()
    };
  }

  componentWillMount () {
    ExampleModelStore.addChangeListener(::this.handleStoreUpdate);
  }

  componentDidUnmount () {
    ExampleModelStore.removeChangeListener(::this.handleStoreUpdate);
  }

  handleStoreUpdate () {
    this.setState({
      model : ExampleModelStore.get()
    });
  }

  render () {
    return (
      <div className='container'>
        <ExampleWizard model={this.state.model} />
      </div>
    );
  }
}

React.render(<ExampleApp />, document.getElementById('mount-node'));
