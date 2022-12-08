#!/usr/bin/env node
"use strict";

let Fs = require("node:fs/promises");

//let Bip39 = require("bip39");
let HdKey = require("hdkey");

let Base58Check = require("@dashincubator/base58check").Base58Check;
let b58c = Base58Check.create();

let coinType = 5; // TODO testnet?

async function main() {
  let args = process.argv.slice(2);

  let [seedPath] = args;
  if (!seedPath) {
    console.error("");
    console.error(
      "Usage: seed-to-wif <./seed.hex> [account] [direction] [index]",
    );
    console.error("");
    process.exit(1);
  }

  let account = parseInt(args[1], 10) || 0;
  let direction = parseInt(args[2], 10) || 0;
  let index = parseInt(args[3], 10) || 0;

  let txt = await Fs.readFile(seedPath, "utf8");
  let seedHex = txt.trim();
  let seedBuf = Buffer.from(seedHex, "hex");

  let privateRoot = HdKey.fromMasterSeed(seedBuf);

  // a "wallet" is the path up to `m/44'/${coinType}'/${account}'`
  // the "addresses" are the paths down from `${direction}/${index}`
  let referenceKey = privateRoot.derive(
    `m/44'/${coinType}'/${account}'/${direction}/${index}`,
  );
  let wif1 = await b58c.encode({
    privateKey: referenceKey.privateKey.toString("hex"),
    compressed: true,
  });

  referenceKey = privateRoot
    .deriveChild(44 + HdKey.HARDENED_OFFSET)
    .deriveChild(coinType + HdKey.HARDENED_OFFSET)
    .deriveChild(account + HdKey.HARDENED_OFFSET)
    .deriveChild(direction)
    .deriveChild(index);
  let wif2 = await b58c.encode({
    privateKey: referenceKey.privateKey.toString("hex"),
    compressed: true,
  });

  let directionRoot = privateRoot.derive(
    `m/44'/${coinType}'/${account}'/${direction}`,
  );
  referenceKey = directionRoot.deriveChild(index);
  let wif3 = await b58c.encode({
    privateKey: referenceKey.privateKey.toString("hex"),
    compressed: true,
  });

  let accountRoot = privateRoot.derive(`m/44'/${coinType}'/${account}'`);
  directionRoot = accountRoot.deriveChild(direction);
  referenceKey = directionRoot.deriveChild(index);
  let wif4 = await b58c.encode({
    privateKey: referenceKey.privateKey.toString("hex"),
    compressed: true,
  });

  /*
   *     seed.deriveChild(44, true)
   *         .deriveChild(5, true)
   *         .deriveChild(0, true)
   *         .deriveChild(0)
   *         .deriveChild(0)
   *
   * Or, in other words:
   *     let walletTypeRoot = seed.deriveChild(44, true);
   *     let coinTypeRoot = walletTypeRoot.deriveChild(5, true);
   *     let accountRoot = coinTypeRoot.deriveChild(0, true);
   *     let directionRoot = accountRoot.deriveChild(0);
   *     let key = directionRoot.deriveChild(0);
   */

  [wif2, wif3, wif4].forEach(function (wif) {
    if (wif !== wif1) {
      throw new Error(
        `derived wif '${wif}' does not match other derived wif '${wif1}'`,
      );
    }
  });

  console.info(wif1);
}

main()
  .then(function () {
    process.exit(0);
  })
  .catch(function (err) {
    console.error(err.stack || err);
    process.exit(1);
  });
