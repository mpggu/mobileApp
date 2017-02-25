'use strict';

import { API_URL } from "../Constants" 

export default new (class PlanFetcher {
  async fetchPlan(when) {
    const URL = `${API_URL}vplan/${when}`;

    try {
      const response = await fetch(URL);
      const responseJson = await response.json();
      return responseJson;
    } catch(error) {
      return error;
    }
  }

  async fetchClass() {
    
  }
})();