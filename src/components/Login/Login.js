import React, { Component } from 'react';
import { StyleSheet, View, Text, AppRegistry, Image } from 'react-native';
import { Colors } from '../../Constants';
import LoginForm from './LoginForm';

export default class Login extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
           style={styles.logo}
           source={require('../../images/logo.png')} 
           />

          <Text style={styles.title}> Die offizielle MPG app! </Text>
        </View>
        <View style={styles.formContainer}>
          <LoginForm />
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
    width: 150,
    height: 100
  },
  title: {
    color: 'white',
    marginTop: 10
  }
})


AppRegistry.registerComponent('Login', () => Login);
