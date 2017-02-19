import React, { Component } from 'react';
import Login from './src/components/Login/Login';
import { AppRegistry } from 'react-native';

export default class mobileApp extends Component {
  render() {
    return (
      <Login />
    );
  }
}

AppRegistry.registerComponent('mobileApp', () => mobileApp);
