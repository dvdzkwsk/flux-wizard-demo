import React       from 'react';
import halcyonStep from '../HalcyonStep';

@halcyonStep('Mock Component Title')
export default class MockComponent extends React.Component {
  constructor () {
    super();
  }

  render () {
    return <h1>hello</h1>;
  }
}
