/**
 * @typedef DashHD
 * @prop {HDUtils} utils
 */

/**
 * @typedef HDUtils
 * @prop {HDu8ToHex} u8ToHex
 */

/** @type {DashHD} */
//@ts-ignore
var DashHD = (globalThis.require && exports) || {};
(function (window, DashHD) {
  "use strict";

  /** @type {HDUtils} */
  let HDUtils = {};

  HDUtils.u8ToHex = function (u8) {
    /** @type {Array<String>} */
    let hex = [];

    u8.forEach(
      /** @param {Number} b - a single byte */
      function (b) {
        let h = b.toString(16).padStart(2, "0");
        hex.push(h);
      },
    );

    return hex.join("");
  };

  DashHD.utils = HDUtils;
})(globalThis.window || {}, DashHD);
if ("object" === typeof module) {
  module.exports = DashHD;
}

/**
 * @callback HDu8ToHex
 * @param {Uint8Array} u8
 * @returns {String} hex
 */
