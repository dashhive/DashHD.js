#!/usr/bin/env node
"use strict";

const DUFFS = 100000000;

let Fs = require("node:fs/promises");

let Qr = require("./_qr.js");

async function main() {
  let args = process.argv.slice(2);
  removeNonFlags(args);

  let [addrPath, amount = "", nick] = args;
  if (!addrPath) {
    console.error("");
    console.error(
      "Usage: ./bin/qr.js <xpub-or-addr or ./xprv-or-wif.txt> [amount] [@from-nick]",
    );
    console.error("");
    process.exit(1);
    return;
  }

  let satoshis = 0;
  if (amount) {
    let hasDecimal = amount.includes(".");
    if (!hasDecimal) {
      console.error(
        `'amount' must be given in decimal form, such as 1.0 or 0.0001, not '${amount}'`,
      );
      process.exit(1);
      return;
    }
    satoshis = Math.round(parseFloat(amount) * DUFFS);
    if (!satoshis) {
      console.error(
        `'amount' should be a positive number in decimal form, such as 1.0 or 0.0001, not '${amount}'`,
      );
      process.exit(1);
      return;
    }
  }

  let addr = addrPath;
  let isPub = addrPath.startsWith("xpub") || 34 === addrPath.length;
  let qr;
  if (isPub) {
    qr = await toQr(addrPath, satoshis, nick, { format: "ascii" });
  } else {
    let addrTxt = await Fs.readFile(addrPath, "utf8");
    addr = addrTxt.trim();
    qr = await toQr(addr, satoshis, nick, { format: "ascii" });
    //isPub = addr.startsWith("xpub") || 34 === addr.length;
  }

  console.info();
  console.info(qr.code);
  //if (isPub) {
  console.info();
  console.info(qr.content);
  //}
}

/**
 * @param {String} addr - xpub or addr, or xprv or wif
 * @param {Number} satoshis - the requested payment (or change to be returned)
 * @param {String} nick - hint of who it's from (xpub/addr) or who the change goes to (xprv,wif)
 * @param {Object} opts - qr options
 */
function toQr(addr, satoshis, nick, opts) {
  let content = addr;

  let validLengths = [
    34, // PayAddr
    52, // WIF (Paper Wallet)
    111, // XPrv, XPub
  ];
  let badLength = !validLengths.includes(addr.length);
  if (badLength) {
    throw new Error(
      `expected a length of 111 (XPrv or XPub), 34 (PayAddr) or 52 (WIF), but got '${addr.length}'`,
    );
  }

  let query = new URLSearchParams();
  if (satoshis) {
    query.set("amount", satoshis.toString());
  }
  if (nick) {
    query.set("nick", nick);
  }
  // TODO change address, xpub, or nick
  // (for sweeping only a specific amount)

  let search = query.toString();
  content = `dash://${addr}?${search}`;

  //@ts-ignore
  if ("ascii" === opts?.format) {
    //@ts-ignore
    let code = Qr.ascii(content, { indent: opts.indent ?? 4 });
    return {
      content,
      code,
    };
  }

  let svg = Qr.svg(content, {});
  return {
    content,
    svg,
  };
}

/**
 * @param {Array<String>} arr
 * @returns {Array<String>}
 */
function removeNonFlags(arr) {
  // ex: rm -- ./-rf
  let ddi = arr.indexOf("--");
  if (ddi > -1) {
    return arr.splice(ddi);
  }

  return [];
}

main()
  .then(function () {
    console.info();
    process.exit(0);
  })
  .catch(function (err) {
    console.error(err.stack || err);
    process.exit(1);
  });
