import React, { Component } from 'react';
import {
  View,
  Navigator,
  Text,
  Platform,
  AppRegistry,
} from 'react-native';

import Login from './components/Login/Login';
import Home from './components/Home/Home';
import LoadingScreen from './components/LoadingScreen';

export default class App extends Component {

  renderScene(route, navigator) {
    switch (route.name) {
      case 'Login':
        return <Login navigator={navigator} />
      case 'Home':
        return <Home navigator={navigator} />
      case 'LoadingScreen':
        return <LoadingScreen navigator={navigator} />
    }
  }

  render() {
    return (
      <Navigator
        style={{ flex: 1}}
        initialRoute={{ name: 'LoadingScreen' }}
        renderScene={this.renderScene.bind(this)}
      />
    );
  }
}
