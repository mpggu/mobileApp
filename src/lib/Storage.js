'use strict';

import { AsyncStorage } from 'react-native';

export default new (class Storage {
  async isLoggedIn() {
   return await AsyncStorage.getItem('@Root:isLoggedIn') === 'true';
  }

  logIn() {
    AsyncStorage.setItem('@Root:isLoggedIn', 'true');
  }

  logOut() {
    AsyncStorage.setItem('@Root:isLoggedIn', 'false');
  }
})();