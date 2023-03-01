#!/usr/bin/env node
"use strict";

let Fs = require("node:fs/promises");

let DashHd = require("dashhd");

async function main() {
  let args = process.argv.slice(2);

  let [xprvPath] = args;
  if (!xprvPath) {
    console.error("");
    console.error("Usage: xprv-to-wifs <./xprv.txt> <start-index> [end-index]");
    console.error("");
    process.exit(1);
  }

  let startIndex = parseInt(args[1], 10) || 0;
  let endIndex = parseInt(args[2], 10) || startIndex;
  let hasMany = "string" === typeof args[2];

  let txt = await Fs.readFile(xprvPath, "utf8");
  let xprv = txt.trim();

  let xKey = await DashHD.fromXKey(xprv);

  let hdpath = "m";
  for (let i = 1; i < xKey.depth; i += 1) {
    hdpath += "/?"; // TODO fill with defaults?
  }
  let harden = "";
  //@ts-ignore
  let isHardened = xKey.index >= DashHd.HARDENED_OFFSET;
  if (isHardened) {
    harden = "'";
  }
  hdpath += `/${xKey.index}${harden}`;

  for (let index = startIndex; index <= endIndex; index += 1) {
    //@ts-ignore
    let hdKey = await DashHd.deriveChild(xKey, index, isHardened);
    //@ts-ignore - TODO optional opts
    let wif = await DashHd.toWif(hdKey.privateKey, {});
    //@ts-ignore - TODO optional opts
    let addr = await DashHd.toAddr(hdKey.publicKey, {});

    let fullpath = `${hdpath}/${index}`;
    let ws = " ".repeat(fullpath.length + 1);

    if (hasMany) {
      console.info(`${fullpath}: ${wif}`);
      console.info(`${ws} ${addr}`);
    } else {
      console.info(`${wif}`);
      console.error(`${addr}`);
    }
  }
}

main()
  .then(function () {
    process.exit(0);
  })
  .catch(function (err) {
    console.error(err.stack || err);
    process.exit(1);
  });
