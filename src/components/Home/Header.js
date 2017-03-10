import React, { Component } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Platform, 
  TouchableOpacity, 
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { TabViewAnimated, TabBar } from 'react-native-tab-view';
import Icon from 'react-native-vector-icons/FontAwesome';

import PlanContainer from './PlanContainer';

import Storage from '../../lib/Storage';

import { Colors } from '../../Constants';

export default class Header extends Component {
  state = {
    index: 0,
    routes: [
      { key: '1', title: 'Heute' },
      { key: '2', title: 'Morgen' },
    ],
    refreshing: false,
  };

  handleChangeTab = index => {
    this.setState({ index });
  }

  logOutPressed = () => {
    Storage.logOut();

    this.props.navigator.replace({
      name: 'Login',
    });
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
    return (
      <PlanContainer 
        updateView={this.props.updateView}
        today={route.key === '1'}
        data={this.props.plan[route.key === '1' ? 'today' : 'tomorrow']}
      />
    )
  };

  render() {
    return (
      <View style={styles.root}>
        <StatusBar
          barStyle="light-content"
          animated
          backgroundColor={Colors.Blue}
        />
        <View style={styles.container}>
          <Text style={styles.title}>Vertretungsplan</Text>
          <TouchableOpacity 
            style={styles.refreshIcon}
            onPress={this.logOutPressed}
          >
            <Icon 
              name="cog" 
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

