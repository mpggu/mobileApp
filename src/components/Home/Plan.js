import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default class Plan extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View 
        style={styles.container}
        elevation={3}
      >
        <View style={styles.planTimeContainer}>
          <Text style={styles.planTimeText}>1 - 2</Text>
        </View>

        <View style={styles.planInfoContainer}>
          <Text style={styles.planTypeText}>EVA</Text>
          <Text style={styles.planInfoText}>Bio bei Zemke</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    backgroundColor: 'tomato',
    flexDirection: 'row',
    marginTop: 10
  },

  planTimeContainer: {
    width: 120,
    padding: 15
  },
  planTimeText: {
    fontSize: 25,
    color: 'white',
    alignSelf: 'center',
    fontWeight: '500',
  },

  planInfoContainer:{
    justifyContent: 'center',
    flex: 1,
  },
  planTypeText: {
    color: 'white',
    fontSize: 17,
  },
  planInfoText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 15
  }
});
