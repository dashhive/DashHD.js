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
    console.error("Usage: seed-to-wif <./seed.hex> [account] [change] [index]");
    process.exit(1);
  }
  let account = 0;
  let direction = 0;
  let index = 0;

  let txt = await Fs.readFile(seedPath, "utf8");
  let seedHex = txt.trim();
  let seedBuf = Buffer.from(seedHex, "hex");

  let privateRoot = HdKey.fromMasterSeed(seedBuf);

  let childKey = privateRoot.derive(
    `m/44'/${coinType}'/${account}'/${direction}/${index}`,
  );

  let wif = await b58c.encode({
    privateKey: childKey.privateKey.toString("hex"),
    compressed: true,
  });

  console.info(`WIF:`, wif);
}

main()
  .then(function () {
    console.info();
    process.exit(0);
  })
  .catch(function (err) {
    console.error();
    process.exit(1);
  });
