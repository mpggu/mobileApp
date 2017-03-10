'use strict';

import { AsyncStorage } from 'react-native';
import BackgroundJob from 'react-native-background-job';

export default new (class Storage {
  async isLoggedIn() {
   return await AsyncStorage.getItem('@Root:isLoggedIn') === 'true';
  }

  async logIn(course, pushNotificationsEnabled) {
    AsyncStorage.setItem('@Root:isLoggedIn', 'true');
    this.setCourse(course);
    this.setPushNotificationsEnabled(pushNotificationsEnabled);
    this.setPlan(null);
    return true;
  }

  logOut() {
    AsyncStorage.setItem('@Root:isLoggedIn', 'false');
    BackgroundJob.cancelAll();
  }

  setPushNotificationsEnabled(data) {
    AsyncStorage.setItem('@Root:pushNotificationsEnabled', JSON.stringify(data));
  }

  setPlan(data) {
    AsyncStorage.setItem('@Plan:data', JSON.stringify(data));
  }

  setCourse(course) {
    AsyncStorage.setItem('@Root:course', course);
  }

  async getPushNotificationsEnabled() {
    const pushNotifications = await AsyncStorage.getItem('@Root:pushNotificationsEnabled');
    return JSON.parse(pushNotifications);
  }

  async getCourse() {
    const course = await AsyncStorage.getItem('@Root:course');
    return course;
  }

  async getPlan() {
    const plan = await AsyncStorage.getItem('@Plan:data');
    return JSON.parse(plan);
  }
})();