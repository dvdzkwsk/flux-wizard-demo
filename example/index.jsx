import React     from 'react';
import ReactDOM  from 'react-dom';
import Root      from './containers/root';

const model = {
  firstName : 'Michael',
  lastName  : 'Scott',
  friends   : []
};

ReactDOM.render(<Root model={model} />, document.getElementById('root'));
