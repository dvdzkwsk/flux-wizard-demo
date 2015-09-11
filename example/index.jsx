import React     from 'react';
import ReactDOM  from 'react-dom';
import Root      from './containers/root';

const noop  = () => {};
const model = {
  firstName : 'Michael',
  lastName  : 'Scott',
  friends   : []
};

ReactDOM.render(
  <Root model={model} onSubmit={noop} onCancel={noop} />,
  document.getElementById('root')
);
