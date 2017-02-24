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

  handleUnknown(plan) {
    let text = plan.hasSubject ? `${plan.fach} bei ` : '';
    text += plan.lehrer;
    text += plan.hasSubstitute ? ` vertreten durch ${plan.vertreter} ` : ' ';
    text += `in ${plan.raum}`;

    return text;
  }
  
  transformType(plan) {
    plan.hasSubject = !!plan.fach;
    plan.hasSubstitute = plan.vertreter !== '+' && plan.vertreter !== plan.lehrer;

    switch(plan.art) {
      case 'EVA':
        return {
          color: Colors.sub.Cancelled,
          subText: plan.lehrer,
        };
      case 'fällt aus': 
        return {
          color: Colors.sub.Cancelled,
          subText: plan.hasSubject ? `${plan.fach} bei ` : '' + plan.lehrer,
        }
      case 'Vertr.':
        return {
          color: Colors.sub.Substitution,
          subText: this.handleUnknown(plan),
        }
      case 'Raum-Vtr.':
        return {
          color: Colors.sub.RoomSwitch,
          subText: this.handleUnknown(plan),
        }
      default: 
        return {
          color: Colors.sub.Default,
          subText: this.handleUnknown(plan),
        }
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.subHeader}>
          <Text style={styles.date}>24.02.2017 Freitag</Text>
          <Text style={styles.lastUpdated}>Stand: 23.02.2017 7:16</Text>
        </View>
        <ListView
          style={styles.listView}
          dataSource={this.state.planDataSource}
          renderRow={(plan) => { return this.renderPlan(plan) }}
        />
      </View>
    );
  }

  renderPlan(plan) {
    const planType = this.transformType(plan);

    return (
      <Plan color={planType.color} subText={planType.subText} plan={plan} />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WhiteBG,
  },
  listView: {
    paddingHorizontal: 20
  },

  subHeader: {
    flexDirection: 'column',
    alignSelf: 'stretch',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  date: {
    fontWeight: 'bold',
    color: '#676767',
    fontSize: 16,
    textAlign: 'center',
  },
  lastUpdated: {
    textAlign: 'center',
  }
});
