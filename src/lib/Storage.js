'use strict';

import { AsyncStorage } from 'react-native';

export default new (class Storage {
  async isLoggedIn() {
   return await AsyncStorage.getItem('@Root:isLoggedIn') === 'true';
  }

  logIn(course) {
    AsyncStorage.setItem('@Root:isLoggedIn', 'true');
    this.setCourse(course);
    this.setPlan(null);
  }

  logOut() {
    AsyncStorage.setItem('@Root:isLoggedIn', 'false');
    this.setCourse('');
  }

  setPlan(data) {
    AsyncStorage.setItem('@Plan:data', JSON.stringify(data));
  }

  setCourse(course) {
    AsyncStorage.setItem('@Root:course', course);
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