import React, { Component } from 'react';
import { StyleSheet, View, Text, NetInfo } from 'react-native';

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

    this.fetchData();
  }

  async fetchData() {
    const isConnected = await NetInfo.isConnected.fetch();

    if (!isConnected) {
      return setTimeout(() => {
        this.fetchData();
      }, 5000);
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
      }

      if (tomorrow) {
        tomorrow.data = tomorrow.data
          .filter(p => p.klasse === 'Eb')
          .map(p => {
            p.lehrer = Teachers[p.lehrer] || p.lehrer;
            p.vertreter = Teachers[p.vertreter] || p.vertreter;
            return p;
          });        
      }

      this.setState({plan: {today, tomorrow}});
    } catch (err) {
      console.error(err);
    }
  }

  render() {
    if (this.state.plan.today && this.state.plan.tomorrow) {
      return (
        <View style={styles.container}>
          <Header
            fetchData={this.fetchData.bind(this)} 
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

