import React, { Component } from 'react';
import { StyleSheet, View, Text, ListView } from 'react-native';
import Plan from './Plan';

import { Colors } from '../../Constants';

export default class PlanContainer extends Component {
  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 != r2
    });

    this.state = {
      planDataSource: ds.cloneWithRows(props.data)
    }
  }
  
  render() {
    return (
      <View style={styles.container}>
        <ListView
          style={styles.listView}
          dataSource={this.state.planDataSource}
          renderRow={(plan) => { return this.renderPlan(plan) }}
        />
      </View>
    );
  }

  renderPlan(plan) {
    return (
      <Plan plan={plan} />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WhiteBG,
  },
  listView: {
    padding: 20,
  }
});
