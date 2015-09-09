import React       from 'react';
import halcyonStep from '../HalcyonStep';

export class MockComponent extends React.Component {
  constructor () {
    super();
  }

  render () {
    return <h1>hello</h1>;
  }
}

export default halcyonStep('Mock Component Title')(MockComponent);
