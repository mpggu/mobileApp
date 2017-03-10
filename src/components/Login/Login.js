import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, ActivityIndicator, Dimensions } from 'react-native';
import { Colors } from '../../Constants';
import LoginForm from './LoginForm';

const { width, height } = Dimensions.get('window');

export default class Login extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
           style={styles.logo}
           source={require('../../images/logo.png')} 
          />

        </View>
        <View style={styles.formContainer}>
          <LoginForm navigator={this.props.navigator} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Blue
  },
  logoContainer: {
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center'
  },
  logo: {
    width: width / 1.0275,
    height: height / 2.085,
  }
});

