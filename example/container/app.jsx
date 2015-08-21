import React from 'react';
import { Provider } from 'react-redux';
import UserView from '../views/user';

export default class AppContainer extends React.Component {
  constructor () {
    super();
  }

  render () {
    return (
      <Provider store={store}>
        <UserView />
      </Provider>
    );
  }
}
