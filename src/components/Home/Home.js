import React, { Component } from 'react';
import { StyleSheet, View, Text, NetInfo, NativeModules } from 'react-native';
import BackgroundJob from 'react-native-background-job';

import PlanFetcher from '../../lib/PlanFetcher';

import Header from './Header';
import LoadingScreen from '../LoadingScreen';
import PullToRefresh from './PullToRefresh';

import { Teachers } from '../../Constants';

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      plan: {
        today: null,
        tomorrow: null,
      },
    };

    this.firstRender = true;
    this.waitingForUser = false;

    const backgroundJob = {
      jobKey: "vplanfetch",
      job: this.registerBackgroundTask.bind(this),
    };

    const backgroundSchedule = {
      jobKey: "vplanfetch",
      timeout: 10000,
    }


    BackgroundJob.register(backgroundJob);
    BackgroundJob.getAll({callback: jobs => {
      if (!jobs.length) {
        BackgroundJob.schedule(backgroundSchedule);
      }
    }});
    PlanFetcher.on('pushNotification', () => {
      setTimeout(() => {
        this.waitingForUser = false;
        this.updateView();
      }, 2000);
    });
  }

  async registerBackgroundTask() {
    const data = await this.fetchData();
    const isActive = NativeModules.AppState.getCurrentAppState === "active";
    const didPlanUpdate = data.tomorrow !== this.state.plan.tomorrow || data.today !== this.state.plan.today;

    console.log(didPlanUpdate, !this.firstRender, !this.waitingForUser, !isActive);
    console.log(data.plan.tomorrow, this.state.tomorrow, data.plan.today, this.state.today);
    if (didPlanUpdate && !this.firstRender && !this.waitingForUser && !isActive) {
      this.waitingForUser = true;
      PlanFetcher.sendPushNotification('Neuer Vertretungsplan verfügbar!');
    }
  }

  componentWillMount() {
    this.updateView();
  }

  async updateView() {
    const data = await this.fetchData();

    if (!data) {
      return setTimeout(this.updateView.bind(this), 5000);
    }

    this.setState(data);
    this.firstRender = false;
  }

  async fetchData() {
    const isConnected = await NetInfo.isConnected.fetch();

    if (!isConnected) {
      return null;
    }

    try {
      let today = await PlanFetcher.fetchPlan('today');
      let tomorrow = await PlanFetcher.fetchPlan('tomorrow');
      if (today) {
        today.data = today.data
          .filter(p => p.klasse === 'Q3/Q4')
          .map(p => {
            p.lehrer = Teachers[p.lehrer] || p.lehrer;
            p.vertreter = Teachers[p.vertreter] || p.vertreter;
            return p;
          });
        today.available = true;
      } else {
        today = {
          data: [],
          available: false, 
        };
      }

      if (tomorrow) {
        tomorrow.data = tomorrow.data
          .filter(p => p.klasse === 'Q3/Q4')
          .map(p => {
            p.lehrer = Teachers[p.lehrer] || p.lehrer;
            p.vertreter = Teachers[p.vertreter] || p.vertreter;
            return p;
          });
        tomorrow.available = true;      
      } else {
        tomorrow = {
          data: [],
          available: false,
        };
      }
      return {plan: {today, tomorrow}};
    } catch (err) {
      return null;
    }
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

