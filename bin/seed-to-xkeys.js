#!/usr/bin/env node
"use strict";

let Fs = require("node:fs/promises");

let DashHd = require("dashhd");

let coinType = 5; // TODO testnet?

async function main() {
  let args = process.argv.slice(2);

  let [seedPath] = args;
  if (!seedPath) {
    console.error("");
    console.error(
      // TODO "Usage: seed-to-xkey <./seed.hex> [account] [use]",
      [
        "",
        "USAGE",
        "        seed-to-xkey <./seed.hex> [account] [use]",
        "",
        "EXAMPLES",
        "        seed-to-xkey <./seed.hex> 0 0",
        "",
        "IMPORTANT",
        "        \"m/44'/5'\" is used as the prefix for compatibility with other Dash wallets",
        "",
      ].join("\n"),
    );
    console.error("");
    process.exit(1);
  }

  let account = parseInt(args[1], 10) || 0;
  let direction = parseInt(args[2], 10) || 0;

  let txt = await Fs.readFile(seedPath, "utf8");
  let seedHex = txt.trim();
  let seedBuf = Buffer.from(seedHex, "hex");

  let hdkey = await DashHd.fromSeed(seedBuf, {});

  // a "wallet" is the path up to `m/44'/${coinType}'/${account}'`
  // the "addresses" are the paths down from `${direction}/${index}`
  let xKey = await DashHd.derivePath(
    hdkey,
    `m/44'/${coinType}'/${account}'/${direction}`,
  );
  let xprv = await DashHd.toXPrv(xKey);
  let xpub = await DashHd.toXPub(xKey);
  // TODO would other software know how to reconcile parent-child keys?
  //let xPrivKey = privateRoot.derive(`m/44'/${coinType}'/${account}'`);
  //let xPubKey = xPrivKey.deriveChild(0);
  //let xKeys = {
  //  parentPrivate: xPrivKey.toJSON().xpriv,
  //  childPublic: xPubKey.toJSON().xpub,
  //};

  // stdout
  console.info(`${xprv}`);
  // stderr
  console.error(`${xpub}`);
}

main()
  .then(function () {
    process.exit(0);
  })
  .catch(function (err) {
    console.error(err.stack || err);
    process.exit(1);
  });
