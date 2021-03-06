import React, { Component } from 'react';
import { View, Text, NetInfo, NativeModules, Platform } from 'react-native';
import BackgroundJob from 'react-native-background-job';
import BackgroundFetch from 'react-native-background-fetch';

import { backgroundFetch } from '../../lib/PlanFetcher';

import { StyleSheet } from '../../lib/StyleSheet';

import PlanFetcher from '../../lib/PlanFetcher';
import Storage from '../../lib/Storage';

import { Colors } from '../../Constants';

import Header from './Header';
import LoadingScreen from '../LoadingScreen';
import PullToRefresh from './PullToRefresh';

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      plan: {
        today: null,
        tomorrow: null,
      },
    };

    PlanFetcher.on('pushNotification', () => {
      setTimeout(() => {
        this.updateView();
      }, 1000);
    });
  }

  async componentWillMount() {
    await PlanFetcher.updateCourse();
    const pushEnabled = await Storage.getPushNotificationsEnabled();
    this.updateView();

    if (Platform.OS === "android") {
      return BackgroundJob.getAll({callback: plans => {
        if (plans.length) {
          BackgroundJob.cancelAll();
        }
        // Explicit type check, consider null
        if (pushEnabled === false) return;
        BackgroundJob.schedule({
          jobKey: 'vplanfetch',
          timeout: 10000,
        });
      }});
    }

    if (pushEnabled === false) {
      return BackgroundFetch.stop();
    }
    BackgroundFetch.configure({
      stopOnTerminate: false,
    }, backgroundFetch, console.error);
  }

  async updateView() {
    const data = await PlanFetcher.getPlan();

    if (!data) {
      return setTimeout(this.updateView.bind(this), 5000);
    }

    Storage.setPlan(data);
    this.setState(data);
  }

  render() {
    if (this.state.plan.today || this.state.plan.tomorrow) {
      return (
        <View style={styles.container}>
          <Header
            updateView={this.updateView.bind(this)} 
            plan={this.state.plan}
            navigator={this.props.navigator}
          />

          <PullToRefresh />
        </View>
      );
    }

    return <LoadingScreen />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Blue,
  }
});

