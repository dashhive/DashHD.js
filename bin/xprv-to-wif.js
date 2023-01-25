#!/usr/bin/env node
"use strict";

let Fs = require("node:fs/promises");

let HdKey = require("hdkey");

let Base58Check = require("@dashincubator/base58check").Base58Check;
let b58c = Base58Check.create();

let Xaddr = require("./_xaddr.js");

async function main() {
  let args = process.argv.slice(2);

  let [xprvPath] = args;
  if (!xprvPath) {
    console.error("");
    console.error("Usage: xprv-to-wif <./xprv.txt> <index>");
    console.error("");
    process.exit(1);
  }

  let index = parseInt(args[1], 10) || 0;

  let txt = await Fs.readFile(xprvPath, "utf8");
  let xprv = txt.trim();

  let privateRoot = HdKey.fromExtendedKey(xprv);

  //@ts-ignore
  let hdKey = privateRoot.deriveChild(index);
  let wif = await b58c.encode({
    privateKey: hdKey.privateKey.toString("hex"),
  });
  let addr = await Xaddr.publicKeyToAddr(hdKey.publicKey);

  console.info(wif);
  console.error(addr);
}

main()
  .then(function () {
    process.exit(0);
  })
  .catch(function (err) {
    console.error(err.stack || err);
    process.exit(1);
  });
