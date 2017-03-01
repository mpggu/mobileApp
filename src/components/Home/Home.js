import React, { Component } from 'react';
import { StyleSheet, View, Text, NetInfo, NativeModules } from 'react-native';
import BackgroundJob from 'react-native-background-job';

import PlanFetcher from '../../lib/PlanFetcher';
import Storage from '../../lib/Storage';

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

  componentWillMount() {
    this.updateView();
    BackgroundJob.getAll({callback: plans => {
      if (plans.length) {
        BackgroundJob.cancelAll();
      }
      BackgroundJob.schedule({
        jobKey: 'vplanfetch',
        timeout: 15000,
      });
    }});
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
  }
});

