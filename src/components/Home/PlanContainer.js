import React, { Component } from 'react';
import { StyleSheet, View, Text, ListView, RefreshControl } from 'react-native';
import Plan from './Plan';

import parseSubject from '../../lib/parseSubject';

import moment from 'moment';

import { Colors } from '../../Constants';

export default class PlanContainer extends Component {
  constructor(props) {
    super(props);

    this.ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 != r2
    });

    this.state = {
      planDataSource: this.ds.cloneWithRows(this.props.data.data),
      refreshing: false,
    };

    require('moment/locale/de');
  }

  handleUnknown(plan) {
    let text = plan.hasSubject ? `${plan.fach} bei ` : '';
    text += plan.lehrer;
    text += plan.hasSubstitute ? ` vertreten durch ${plan.vertreter}` : '';
    text += !!plan.raum ? ` in ${plan.raum}` : '';

    return text;
  }
  
  transformType(plan) {
    plan.fach = parseSubject(plan);

    plan.hasSubject = !!plan.fach;
    plan.hasSubstitute = plan.vertreter !== '+' && plan.vertreter !== plan.lehrer;

    switch(plan.art) {
      case 'EVA':
      case 'fällt aus': 
        return {
          color: Colors.sub.Cancelled,
          subText: (plan.hasSubject ? `${plan.fach} bei ` : '') + (!!plan.lehrer ? `${plan.lehrer}` : ''),
        };
      case 'Vertr.':
        return {
          color: Colors.sub.Substitution,
          subText: this.handleUnknown(plan),
        };
      case 'Raum-Vtr.':
        return {
          color: Colors.sub.RoomSwitch,
          subText: this.handleUnknown(plan),
        };
      default: 
        return {
          color: Colors.sub.Default,
          subText: this.handleUnknown(plan),
        };
    }
  }

  async onRefresh() {
    this.setState({ refreshing: true });
    try {
      await this.props.updateView();
      this.setState({planDataSource: this.ds.cloneWithRows(this.props.data.data) });
      this.setState({ refreshing: false });
    } catch(err) {
      this.setState({ refreshing: false });
    }
  }
  
  renderRefreshControl() {
    return (
      <RefreshControl
        refreshing={this.state.refreshing}
        onRefresh={this.onRefresh.bind(this)}
        colors={[Colors.sub.Cancelled]}
        tintColor={Colors.sub.Cancelled}
      />
    );
  }

  renderPlan(plan) {
    const planType = this.transformType(plan);

    return (
      <Plan 
        color={planType.color} 
        subText={planType.subText} 
        plan={plan}
      />
    );
  }

  defaultRender() {
    const date = moment(this.props.data.date, 'X');

    const lastEdited = moment(this.props.data.lastEdited, 'X');

    return (
      <View style={styles.container}>
        <View style={styles.subHeader}>
          <Text style={styles.date}>{date.format('dddd, DD.MM.YYYY')}</Text>
          <Text style={styles.lastUpdated}>{`Stand: ${lastEdited.format('DD.MM.YY H:kk')}`}</Text>
        </View>
        <View style={styles.listView}>
          <ListView
            refreshControl={this.renderRefreshControl()}
            dataSource={this.state.planDataSource}
            renderRow={this.renderPlan.bind(this)}
            enableEmptySections
          />
        </View>
      </View>
    );
  }

  render() {
    const planNotThere = !this.props.data.available;
    const isPlanEmpty = this.props.data.data instanceof Array && this.props.data.data.length === 0;

    if (planNotThere || isPlanEmpty) {
      const when = this.props.today ? 'heute' : 'morgen'

      const message = planNotThere ? `Kein Vertretungsplan für ${when} verfügbar!` : `Du hast ${when} keine Vertretung.`;

      return (
        <View style={styles.errContainer}>
          <ListView
            refreshControl={this.renderRefreshControl()}
            dataSource={this.ds.cloneWithRows(["I'm literally useless :)"])}
            renderRow={() => <View />}
          />
          <Text style={styles.error}>{message}</Text>
        </View>
      )
    }

    return this.defaultRender();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WhiteBG,
  },
  listView: {
    flex: 1,
    paddingHorizontal: 20,
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
  },

  errContainer: {
    flex: 1,
    backgroundColor: Colors.WhiteBG,
    flexDirection: 'column',
  },
  error: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#676767',
  }
});
