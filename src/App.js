import React, { Component } from 'react';
import {
  View,
  Navigator,
  Text
} from 'react-native';

import Login from './components/Login/Login';

export default class App extends Component {
  
  renderScene(route, navigator) {
    console.log(route);
    switch (route.name) {
      case 'Login':
        return <Login navigator={navigator}/>
    }
  }

  render() {
    return (
      <Navigator
        style={{ flex: 1}}
        initialRoute={{ name: 'Login'}}
        renderScene={this.renderScene.bind(this)}
        />
    );
  }
}
