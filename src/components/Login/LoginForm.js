import React, { Component } from 'react';
import { Colors } from '../../Constants';
import { StyleSheet, View, AppRegistry, TextInput, TouchableOpacity, Text, KeyboardAvoidingView, StatusBar } from 'react-native';

export default class LoginForm extends Component {
  render() {
    return (
      <KeyboardAvoidingView 
        behavior="padding" 
        style={styles.container}
        >
        <StatusBar
          barStyle="light-content"
          animated
          backgroundColor={Colors.Blue}
          />
        <TextInput
          placeholder="Benutzername"
          placeholderTextColor= "rgba(255, 255, 255, 0.7)"
          autoCorrect={false}
          returnKeyType="next"
          onSubmitEditing={() => this.refs.passwordInput.focus()}
          selectionColor="#333333"
          underlineColorAndroid="transparent"
          style={styles.input} 
          />
        <TextInput
          placeholder="Passwort"
          placeholderTextColor= "rgba(255, 255, 255, 0.7)"
          returnKeyType="go"
          underlineColorAndroid="transparent"
          secureTextEntry
          style={styles.input}
          ref= "passwordInput"
          />

        <TouchableOpacity style={styles.buttonContainer}>
          <Text style={styles.buttonText}>Anmelden</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginBottom: 15
  },
  input: {
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    color: 'white',
    marginBottom: 15,
    paddingHorizontal: 10
  },
  buttonContainer: {
    backgroundColor: Colors.Red,
    paddingVertical: 10
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold'
  }
})


AppRegistry.registerComponent('LoginForm', () => LoginForm);
