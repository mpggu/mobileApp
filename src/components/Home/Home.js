import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import PlanFetcher from '../../lib/PlanFetcher';

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

    this.fetchData();
  }

  async fetchData() {
    try {
      let today = await PlanFetcher.fetchPlan('today');
      let tomorrow = await PlanFetcher.fetchPlan('tomorrow');

      today.data = today.data.filter(p => p.klasse === 'Q3/Q4');
      tomorrow.data = tomorrow.data.filter(p => p.klasse === '9A');

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

