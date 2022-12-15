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
      // TODO "Usage: seed-to-wif <./seed.hex> [account] [coinType]",
      "Usage: seed-to-wif <./seed.hex> [account] [direction]",
    );
    console.error("");
    process.exit(1);
  }

  let account = parseInt(args[1], 10) || 0;
  let direction = parseInt(args[2], 10) || 0;

  let txt = await Fs.readFile(seedPath, "utf8");
  let seedHex = txt.trim();
  let seedBuf = Buffer.from(seedHex, "hex");

  let privateRoot = HdKey.fromMasterSeed(seedBuf);

  // a "wallet" is the path up to `m/44'/${coinType}'/${account}'`
  // the "addresses" are the paths down from `${direction}/${index}`
  let xKey = privateRoot.derive(`m/44'/${coinType}'/${account}'/${direction}`);
  let xKeys = xKey.toJSON();
  // TODO would other software know how to reconcile parent-child keys?
  //let xPrivKey = privateRoot.derive(`m/44'/${coinType}'/${account}'`);
  //let xPubKey = xPrivKey.deriveChild(0);
  //let xKeys = {
  //  parentPrivate: xPrivKey.toJSON().xpriv,
  //  childPublic: xPubKey.toJSON().xpub,
  //};

  let xprvParts = await b58c.decode(xKeys.xpriv);
  let xprv = await b58c.encode(xprvParts);
  if (xprv !== xKeys.xpriv) {
    throw new Error(
      `@dashincubator/base58check gave '${xprv}', but expected '${xKeys.xpriv}'`,
    );
  }

  let xpubParts = await b58c.decode(xKeys.xpub);
  let xpub = await b58c.encode(xpubParts);
  if (xpub !== xKeys.xpub) {
    throw new Error(
      `@dashincubator/base58check gave '${xpub}', but expected '${xKeys.xpub}'`,
    );
  }

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
