import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, StatusBar, Dimensions } from 'react-native';

import Storage from '../lib/Storage';

import { Colors } from '../Constants';


const { width, height } = Dimensions.get('window');

export default class Home extends Component {
  
  componentDidMount() {
    this.verifyLogin();
  }

  async verifyLogin() {
    if (!this.props.navigator) {
      return false;
    }

    const isLoggedIn = await Storage.isLoggedIn();

    this.props.navigator.replace({
        name: isLoggedIn ? 'Home' : 'Login',
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          barStyle="light-content"
          animated
          backgroundColor={Colors.Blue}
        />
        <Image 
          style={styles.image}
          source={require('../images/loading.gif')}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Blue,
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    width: width / 1.37,
    height: height / 3.65,
  }
});

