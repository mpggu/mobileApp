import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import PlanFetcher from '../../lib/PlanFetcher';

import Header from './Header';
import LoadingScreen from './LoadingScreen';

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

      today.data = today.data.filter(p => p.klasse === 'Q1/Q2');
      tomorrow.data = tomorrow.data.filter(p => p.klasse === '5E');

      

      setTimeout(() => {
        this.setState({plan: {today, tomorrow}});
      }, 4000);
    } catch (err) {
      console.error(err);
    }
  }

  render() {
    if (this.state.plan.today && this.state.plan.tomorrow) {
      return <Header plan={this.state.plan} />;
    }

    return <LoadingScreen />;
  }
}

const styles = StyleSheet.create({

});

