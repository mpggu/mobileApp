import React, { Component } from 'react';
import App from './src/App';
import { AppRegistry, Text, View } from 'react-native';

export default class mobileApp extends Component {
  render() {
    return (
      <App />
    );
  }
}

AppRegistry.registerComponent('mobileApp', () => mobileApp);
