import React, { Component } from 'react';
import { Colors } from '../../Constants';
import { 
  StyleSheet, 
  View,
  TextInput, 
  TouchableOpacity, 
  Text, 
  KeyboardAvoidingView, 
  StatusBar,
  ActivityIndicator,
  Alert,
  Picker,
} from 'react-native';

import Storage from '../../lib/Storage';

import { Grades } from '../../Constants';

export default class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pendingLoginRequest: false,
      username: '',
      password: '',
      grade: '5A',
    }
  }

  toggleLogin() {
    this.setState(state => {
      state.pendingLoginRequest = !state.pendingLoginRequest;
      return state;
    });
  }

  redirect(routeName) {
    this.props.navigator.replace({
      name: routeName,
    });
  }

  authenticate() {
    return (this.state.username === 'test' && this.state.password === 'pw');
  }

  onPressLoginButton() {
    if (!this.state.pendingLoginRequest) {
      this.toggleLogin();
      if (!this.authenticate()) {
        Alert.alert(
          'Anmeldefehler',
          'Der Benutzername und das Passwort stimmen nicht überein.',
          [
            { text: 'OK'}
          ],
          { cancelable: true }
        );
        return this.toggleLogin();
      }

      Storage.logIn(this.state.grade);
      
      this.redirect('Home');
    }
  }

  render() {
    return (
      <KeyboardAvoidingView 
        behavior="padding" 
        style={styles.container}
      >
        <ActivityIndicator 
          animating={this.state.pendingLoginRequest}
          size='large'
          style={styles.activity}
        />
        <StatusBar
          barStyle="light-content"
          animated
          backgroundColor={Colors.Blue}
        />
        <Picker
          selectedValue={this.state.grade}
          onValueChange={grade => this.setState({ grade })}
          style={styles.input}
        >
          {Grades.map(grade => 
            <Picker.Item label={grade} value={grade} key={grade}/>
          )}
        </Picker>
        <TextInput
          placeholder="Benutzername"
          placeholderTextColor= "rgba(255, 255, 255, 0.7)"
          autoCorrect={false}
          returnKeyType="next"
          onSubmitEditing={() => this.refs.passwordInput.focus()}
          selectionColor="#333333"
          underlineColorAndroid="transparent"
          style={styles.input}
          editable={!this.state.pendingLoginRequest}
          onChangeText={username => this.setState({...this.state, username})}
          ref="usernameInput"
        />
        <TextInput
          placeholder="Passwort"
          placeholderTextColor="rgba(255, 255, 255, 0.7)"
          returnKeyType="go"
          underlineColorAndroid="transparent"
          secureTextEntry
          style={styles.input}
          editable={!this.state.pendingLoginRequest}
          onChangeText={password => this.setState({...this.state, password})}
          ref="passwordInput"
        />

        <TouchableOpacity 
          style={styles.buttonContainer} 
          onPress={this.onPressLoginButton.bind(this)}
          activeOpacity={!this.state.pendingLoginRequest ? 0.2 : 1}
        >
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
  },
  activity: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20
  },
});
