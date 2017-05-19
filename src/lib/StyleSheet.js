'use strict';

import { StyleSheet as RStyleSheet, Dimensions } from 'react-native';

const FIELDS_TO_NORMALIZE = [
  'fontSize',
  'lineHeight',
  'letterSpacing',
  'width',
  'height',
  'margin',
  'marginTop',
  'marginBottom',
  'marginLeft',
  'marginRight',
  'padding',
  'paddingTop',
  'paddingBottom',
  'paddingLeft',
  'paddingRight',
];

// Dimensions of the device I develop with; Galaxy S7
const GALAXY_S7_VIEWPORT = 667;
const VIEWPORT = Dimensions.get('window').height;

export class StyleSheet {
  /**
   * Creates a StyleSheet just like the native one,
   * with the exception, that it changes certain values
   * based on screen dimensions in order to ensure
   * multi-device responsiveness.
   * 
   * @static
   * @param {Object} sheet The react-native styling object
   * @returns The modified StyleSheet
   * 
   * @memberof StyleSheet
   */
  static create(sheet) {
    for (let styles in sheet) {
      const styleObject = sheet[styles];

      elementloop: for (let style in styleObject) {
        const value = styleObject[style];
        if (!FIELDS_TO_NORMALIZE.includes(style)) continue elementloop;

        sheet[styles][style] = this.normalize(value);
      }
    }

    return RStyleSheet.create(sheet);
  }

  /**
   * Normalizes a certain value based on specific
   * screen dimensions
   * 
   * @static
   * @param {Number} value The number to normalize
   * @returns The normalized number
   * 
   * @memberof StyleSheet
   */
  static normalize(value) {
    return VIEWPORT / (GALAXY_S7_VIEWPORT / value) * 0.95;
  }
};