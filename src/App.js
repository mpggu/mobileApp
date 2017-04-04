import React, { Component } from 'react';
import {
  View,
  Navigator,
  Text,
  Platform,
  AppRegistry,
} from 'react-native';

import codePush from 'react-native-code-push';
import DeviceInfo from 'react-native-device-info';
import Analytics from 'react-native-firebase-analytics';

import Storage from './lib/Storage';

import Login from './components/Login/Login';
import Home from './components/Home/Home';
import LoadingScreen from './components/LoadingScreen';

class App extends Component {

  componentWillMount() {
    Analytics.setUserId(DeviceInfo.getUniqueID());
    Analytics.setEnabled(true);
    this.setGradeFirebase();
  }

  async setGradeFirebase() {
    const course = await Storage.getCourse();

    if (!course) return;
    Analytics.setUserProperty('grade', course);
  }

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

export default codePush(App);