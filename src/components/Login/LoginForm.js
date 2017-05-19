import React, { Component } from 'react';
import { Colors, Grades } from '../../Constants';
import { 
  View,
  TextInput, 
  TouchableOpacity, 
  Text, 
  KeyboardAvoidingView, 
  StatusBar,
  ActivityIndicator,
  Alert,
  Picker,
  Image,
  Platform
} from 'react-native';

import { StyleSheet } from '../../lib/StyleSheet';

import Checkbox from 'react-native-check-box'

import Storage from '../../lib/Storage';

export default class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pendingLoginRequest: false,
      grade: Grades[0],
      pushNotifications: true,
    }
  }

  async componentWillMount() {
    const grade = await Storage.getCourse() || '5A';

    this.setState({grade});
  }

  renderPicker() {
    if (Platform.OS === 'ios') {
      return (
        <Picker
          selectedValue={this.state.grade}
          onValueChange={grade => this.setState({ grade })}
          itemStyle={[styles.input, {color: 'white', height: StyleSheet.normalize(100)}]}
        >
          {Grades.map(grade => 
            <Picker.Item label={grade} value={grade} key={grade}/>
          )}
        </Picker>
      );
    }

    return (
      <Picker
        selectedValue={this.state.grade}
        onValueChange={grade => this.setState({ grade })}
        style={[styles.input, {color: 'white'}]}
      >
        {Grades.map(grade => 
          <Picker.Item label={grade} value={grade} key={grade}/>
        )}
      </Picker>
    );
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

  onPressLoginButton() {
    if (!this.state.pendingLoginRequest) {
      this.toggleLogin();

      const grade = this.state.grade === 'Alle' ? '' : this.state.grade;
      Storage.logIn(grade, this.state.pushNotifications)
      .then(() => this.redirect('Home'));
    }
  }

  onPushCheckboxClick() {
    if (!this.state.pendingLoginRequest) {
      this.setState({pushNotifications: !this.state.pushNotifications})
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
        <View
          style={[styles.input, styles.pushView]}
        >
          <Checkbox
            style={styles.push}
            isChecked={this.state.pushNotifications}
            onClick={this.onPushCheckboxClick.bind(this)}
            leftText="Push-Notifikationen aktivieren"
            leftTextStyle={styles.pushText}
            checkedImage={<Image 
                            style={styles.pushImage} 
                            source={require('../../../node_modules/react-native-check-box/img/ic_check_box.png')}
                          />}
            unCheckedImage={<Image 
                              style={styles.pushImage} 
                              source={require('../../../node_modules/react-native-check-box/img/ic_check_box_outline_blank.png')}
                            />}
          />
        </View>
        {this.renderPicker()}
        <TouchableOpacity 
          style={styles.buttonContainer} 
          onPress={this.onPressLoginButton.bind(this)}
          activeOpacity={!this.state.pendingLoginRequest ? 0.2 : 1}
        >
          <Text style={styles.buttonText}>Fortfahren</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginBottom: 5,
  },
  pushView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  push: {
    flex: 1,
  },
  pushImage: {
    tintColor: 'white',
  },
  pushText: {
    color: 'white',
  },
  input: {
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
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
