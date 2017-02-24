import React, { Component } from 'react';
import { StyleSheet, View, Text, Platform, TouchableOpacity } from 'react-native';
import { TabViewAnimated, TabBar } from 'react-native-tab-view';
import Icon from 'react-native-vector-icons/FontAwesome';

import PlanContainer from './PlanContainer';

import { Colors } from '../../Constants';

export default class Header extends Component {
  state = {
    index: 0,
    routes: [
      { key: '1', title: 'Heute' },
      { key: '2', title: 'Morgen' },
    ],
  };

  handleChangeTab = index => {
    this.setState({ index });
  }

  renderHeader = props => {
    return (
      <TabBar 
        style={{backgroundColor: Colors.Blue}}
        indicatorStyle={{backgroundColor: Colors.Red, padding: 2}}
        {...props} 
      />
    );
  };

  renderScene = ({ route }) => {
    const data = [{ klasse: 'Q1/Q2',
      stunde: '2',
      fach: '',
      vertreter: '+',
      lehrer: 'Mz',
      raum: 'E01',
      art: 'fällt aus' },
    { klasse: 'Q1/Q2',
      stunde: '3 - 4',
      fach: '',
      vertreter: '+',
      lehrer: 'Ste',
      raum: 'A16',
      art: 'EVA' },
      { klasse: 'Q1/Q2',
      stunde: '5 - 6',
      fach: 'Ek',
      vertreter: 'Hen',
      lehrer: 'Ste',
      raum: 'E12',
      art: 'Vertr.' },
      { klasse: 'Q1/Q2',
      stunde: '10 - 11',
      fach: 'PoWi',
      vertreter: 'Hen',
      lehrer: 'Hen',
      raum: 'E12',
      art: 'Raum-Vtr.' },
    ];

    switch (route.key) {
    case '1':
      return <PlanContainer data={data} style={styles.page} />;
    case '2':
      return <View style={styles.page} />;
    default:
      return null;
    }
  };

  render() {
    return (
      <View style={styles.root}>
        <View style={styles.container}>
          <Text style={styles.title}>Vertretungsplan</Text>
          <TouchableOpacity style={styles.refreshIcon}>
            <Icon 
              name="refresh" 
              size={25} 
              color="white"
            />
          </TouchableOpacity>
        </View>
        <TabViewAnimated
          style={{flex: 1, backgroundColor: Colors.Blue}}
          navigationState={this.state}
          renderScene={this.renderScene}
          renderHeader={this.renderHeader}
          onRequestChangeTab={this.handleChangeTab}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'column',
  },
  container: {
    flexDirection: 'row',
    marginTop: Platform.OS === 'ios' ? 24 : 0,
    alignSelf: 'stretch',
    backgroundColor: Colors.Blue,
    padding: 15
  },
  title: {
    color: 'white',
    fontSize: 18,
    textAlign: 'left',
  },
  refreshIcon: {
    flex: 1,
    alignItems: 'flex-end'
  },
  page: {
    flex: 1,
    backgroundColor: '#ecf0f1'
  }
});

