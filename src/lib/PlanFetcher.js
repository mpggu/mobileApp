'use strict';

import { EventEmitter } from 'events';

import { API_URL } from "../Constants"
import PushNotification from "react-native-push-notification";

class PlanFetcher extends EventEmitter {
  constructor() {
    super();
    this.initPushNotifications();
  }

  initPushNotifications() {
    PushNotification.configure({
      onNotification: notification => {
        if (!notification.userInteraction) {
          return;
        }

        this.emit('pushNotification', notification);
      },
    });
  }

  sendPushNotification(message) {
    PushNotification.localNotification({
      title: 'Max-Planck-Gymnasium',
      message,
    });
  }

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
}

export default new PlanFetcher();