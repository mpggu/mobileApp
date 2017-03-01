'use strict';

import { AsyncStorage } from 'react-native';

export default new (class Storage {
  async isLoggedIn() {
   return await AsyncStorage.getItem('@Root:isLoggedIn') === 'true';
  }

  logIn() {
    AsyncStorage.setItem('@Root:isLoggedIn', 'true');
    this.setPlan(null);
  }

  logOut() {
    AsyncStorage.setItem('@Root:isLoggedIn', 'false');
  }

  setPlan(data) {
    AsyncStorage.setItem('@Plan:data', JSON.stringify(data));
  }

  async getPlan() {
    const plan = await AsyncStorage.getItem('@Plan:data');
    return JSON.parse(plan);
  }
})();