#!/usr/bin/env node
"use strict";

let Fs = require("node:fs/promises");

let DashHd = require("dashhd");

async function main() {
  let args = process.argv.slice(2);

  let [xpubPath] = args;
  if (!xpubPath) {
    console.error("");
    console.error(
      "Usage: xpub-to-addrs <./xpub.txt> <start-index> [end-index]",
    );
    console.error("");
    process.exit(1);
  }

  let startIndex = parseInt(args[1], 10) || 0;
  let endIndex = parseInt(args[2], 10) || startIndex;
  let hasMany = "string" === typeof args[2];

  let txt = await Fs.readFile(xpubPath, "utf8");
  let xpub = txt.trim();
  let xKey = await DashHd.fromXKey(xpub);

  let hdpath = "m";
  for (let i = 1; i < xKey.depth; i += 1) {
    hdpath += "/?";
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
    let hdPub = await DashHd.deriveChild(xKey, index, isHardened);
    //@ts-ignore - TODO optional opts
    let addr = await DashHd.toAddr(hdPub.publicKey, {});
    let fullpath = `${hdpath}/${index}`;

    if (hasMany) {
      console.error(`\n${fullpath}`);
    }
    console.info(addr);
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
