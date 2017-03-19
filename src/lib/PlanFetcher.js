'use strict';

import { NetInfo, NativeModules } from 'react-native';
import { EventEmitter } from 'events';
import Storage from './Storage';

import PushNotification from 'react-native-push-notification';
import BackgroundJob from 'react-native-background-job';

import { API_URL, Teachers } from '../Constants';

class PlanFetcher extends EventEmitter {
  constructor() {
    super();
    this.initPushNotifications();
    this.updateCourse();
  }

  async updateCourse() {
    const course = await Storage.getCourse();
    this.course = course;
    return course;
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
    if (a.length !== b.length) return false;

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
    const course = this.course || this.updateCourse();
    let URL = `${API_URL}vplan/${when}/`;
    URL += course && course !== 'Alle' ? course.substring(0, 2) : '';

    console.log(URL);

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

  if (!newPlan) {
    return;
  }

  const didTommorowUpdate = newPlan.plan.tomorrow.available && !planFetcher.isSamePlanArray(newPlan.plan.tomorrow.data, oldPlan.plan.tomorrow.data);
  const didTodayUpdate = newPlan.plan.today.available && !planFetcher.isSamePlanArray(newPlan.plan.today.data, oldPlan.plan.today.data) && !planFetcher.isSamePlanArray(newPlan.plan.today.data, oldPlan.plan.tomorrow.data);
  const didPlanUpdate = didTommorowUpdate || didTodayUpdate;

  if (didPlanUpdate && !isActive) {
    Storage.setPlan(newPlan);
    
    let text = '';

    switch (true) {
      case didTodayUpdate && didTodayUpdate:
        text = 'heute und morgen';
        break;
      case didTodayUpdate:
        text = 'heute';
        break;
      case didTommorowUpdate:
        text = 'morgen';
        break;
      default:
        text = 'irgendwann';
    }

    planFetcher.sendPushNotification(`Neuer Vertretungspan für ${text} verfügbar!`);
  }
};

export default planFetcher;
export { backgroundFetch };