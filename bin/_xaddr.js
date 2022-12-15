"use strict";

let Base58Check = require("@dashincubator/base58check").Base58Check;
let b58c = Base58Check.create();

/** @type {import('node:crypto')} */
//@ts-ignore
let Crypto = exports.crypto || require("node:crypto");

/**
 * @callback Sha256Sum
 * @param {Uint8Array|Buffer} u8
 * @returns {Promise<Uint8Array|Buffer>}
 */

/** @type {Sha256Sum} */
let sha256sum = async function (u8) {
  let arrayBuffer = await Crypto.subtle.digest("SHA-256", u8);
  let buf = new Uint8Array(arrayBuffer);
  return buf;
};

/** @type {import('@dashincubator/ripemd160')} */
//@ts-ignore
let RIPEMD160 = exports.RIPEMD160 || require("@dashincubator/ripemd160");

/**
 * @param {Uint8Array|Buffer} buf
 * @returns {Promise<Uint8Array>} - pubKeyHash buffer (no magic byte or checksum)
 */
async function publicKeyToPubKeyHash(buf) {
  let shaBuf = await sha256sum(buf);

  let ripemd = RIPEMD160.create();
  ripemd.update(shaBuf);
  let hash = ripemd.digest();

  return hash;
}

/**
 * JS Buffer to Hex that works for Little-Endian CPUs (ARM, x64, x86, WASM)
 * @param {Buffer|Uint8Array} buf
 * @returns {String} - hex
 */
function uint8ArrayToHex(buf) {
  /** @type {Array<String>} */
  let hex = [];

  buf.forEach(function (b) {
    let h = b.toString(16);
    h = h.padStart(2, "0");
    hex.push(h);
  });

  return hex.join("");
}

/**
 * @param {Buffer|Uint8Array} publicKeyBuf
 */
async function publicKeyToAddr(publicKeyBuf) {
  let pubKeyHash = await publicKeyToPubKeyHash(publicKeyBuf);
  let pubKeyHashHex = uint8ArrayToHex(pubKeyHash);

  let addr = await b58c.encode({
    // TODO version: opts?.version,
    pubKeyHash: pubKeyHashHex,
  });

  return addr;
}

module.exports.publicKeyToAddr = publicKeyToAddr;
