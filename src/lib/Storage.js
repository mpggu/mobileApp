'use strict';

import { AsyncStorage } from 'react-native';

export default new (class Storage {
  async isLoggedIn() {
   return await AsyncStorage.getItem('@Root:isLoggedIn');
  }

  logIn() {
    AsyncStorage.setItem('@Root:isLoggedIn', 'true');
  }
})();