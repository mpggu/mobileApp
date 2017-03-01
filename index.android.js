import React, { Component } from 'react';
import App from './src/App';
import { AppRegistry } from 'react-native';

import BackgroundJob from 'react-native-background-job';

import { backgroundFetch } from './src/lib/PlanFetcher';

BackgroundJob.register({
  jobKey: "vplanfetch",
  job: backgroundFetch, 
});

export default class mobileApp extends Component {
  render() {
    return (
      <App />
    );
  }
}

AppRegistry.registerComponent('mobileApp', () => mobileApp);
