import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import { Colors } from '../../Constants';

export default class PullToRefresh extends Component {

  render() {
    return (
      <View style={styles.container}>
        <Icon 
          name="arrow-down" 
          size={25} 
          color="#9B9B9B"
          style={styles.icon}
        />
        <Text style={styles.text}>Herunterziehen zum Neuladen</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: Colors.WhiteBG,
    padding: 20,
  },
  text: {
    alignSelf: 'center',
    marginLeft: 5,
    color: "#9B9B9B",
  },
});
