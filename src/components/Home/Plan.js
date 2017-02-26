import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default class Plan extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View 
        style={[styles.container, { backgroundColor: this.props.color }]}
      >
        <View style={styles.planTimeContainer}>
          <Text style={styles.planTimeText}>{this.props.plan.stunde}</Text>
        </View>

        <View style={styles.planInfoContainer}>
          <Text style={styles.planTypeText}>{this.props.plan.art}</Text>
          <Text style={styles.planInfoText}>{this.props.subText}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    marginBottom: 10,
    elevation: 3,
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
    fontSize: 15,
    paddingRight: 5,
  }
});
