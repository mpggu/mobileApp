'use strict';

import { NetInfo, NativeModules } from 'react-native';
import { EventEmitter } from 'events';
import Storage from './Storage';

import PushNotification from "react-native-push-notification";
import BackgroundJob from 'react-native-background-job';

import { API_URL } from "../Constants"
import { Teachers } from '../Constants';

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

  isSamePlanArray(a, b) {
    for (let i = 0; i < a.length; i++) {
      const props = Object.getOwnPropertyNames(a[i]);
      for (let j = 0; j < props.length; j++) {
        if (a[i][props[j]] !== b[i][props[j]]) {
          return false;
        }
      }
    }
    return true;
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

  async getPlan() {
    const isConnected = await NetInfo.isConnected.fetch();

    if (!isConnected) {
      return null;
    }

    try {
      let today = await this.fetchPlan('today');
      let tomorrow = await this.fetchPlan('tomorrow');

      if (today) {
        today.data = today.data
          .filter(p => p.klasse === 'Q3/Q4')
          .map(p => {
            p.lehrer = Teachers[p.lehrer] || p.lehrer;
            p.vertreter = Teachers[p.vertreter] || p.vertreter;
            return p;
          });
        today.available = true;
      } else {
        today = {
          data: [],
          available: false,
        };
      }

      if (tomorrow) {
        tomorrow.data = tomorrow.data
          .filter(p => p.klasse === 'Q3/Q4')
          .map(p => {
            p.lehrer = Teachers[p.lehrer] || p.lehrer;
            p.vertreter = Teachers[p.vertreter] || p.vertreter;
            return p;
          });
        tomorrow.available = true;
      } else {
        tomorrow = {
          data: [],
          available: false,
        };
      }
      return { plan: {today, tomorrow} };
    } catch (err) {
      return null;
    }
  }
}

const planFetcher = new PlanFetcher();

/**
 * This has to be a separate function since HeadlessJS does not mount any components.
 * Refer to https://facebook.github.io/react-native/docs/headless-js-android.html
 */
const backgroundFetch = async () => {
  const newPlan = await planFetcher.getPlan();
  const oldPlan = await Storage.getPlan();

  const isActive = NativeModules.AppState.getCurrentAppState === 'active';

  console.log("test");
  if (!newPlan) {
    return;
  }

  const didTommorowUpdate = !planFetcher.isSamePlanArray(newPlan.plan.tomorrow.data, oldPlan.plan.tomorrow.data);
  const didTodayUpdate = !planFetcher.isSamePlanArray(newPlan.plan.today.data !== oldPlan.plan.today.data) && !planFetcher.isSamePlanArray(newPlan.plan.today.data, oldPlan.plan.tomorrow.data);
  const didPlanUpdate = didTommorowUpdate || didTodayUpdate;

  if (didPlanUpdate && !isActive) {
    console.log(didTommorowUpdate, didTodayUpdate, isActive, newPlan, oldPlan);
    Storage.setPlan(newPlan);
    planFetcher.sendPushNotification(`Neuer Vertretungspan für ${didTodayUpdate ? 'heute' : 'morgen'} verfügbar`);
  }
};

export default planFetcher;
export { backgroundFetch };