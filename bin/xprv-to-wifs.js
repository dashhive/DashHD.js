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
    console.error("Usage: xprv-to-wifs <./xprv.txt> <start-index> [end-index]");
    console.error("");
    process.exit(1);
  }

  let startIndex = parseInt(args[1], 10) || 0;
  let endIndex = parseInt(args[2], 10) || startIndex;
  let hasMany = "string" === typeof args[2];

  let txt = await Fs.readFile(xprvPath, "utf8");
  let xprv = txt.trim();

  let privateRoot = HdKey.fromExtendedKey(xprv);
  let xprvParts = await b58c.decode(xprv);
  let depth = parseInt(xprvParts.xprv.slice(0, 2), 16);
  let parentIndex = parseInt(xprvParts.xprv.slice(10, 18), 16);

  let hdpath = "m";
  for (let i = 1; i < depth; i += 1) {
    hdpath += "/?";
  }
  let harden = "";
  //@ts-ignore
  let isHardened = parentIndex >= HdKey.HARDENED_OFFSET;
  if (isHardened) {
    harden = "'";
  }
  hdpath += `/${parentIndex}${harden}`;

  for (let index = startIndex; index <= endIndex; index += 1) {
    //@ts-ignore
    let hdKey = privateRoot.deriveChild(index);
    let wif = await b58c.encode({
      privateKey: hdKey.privateKey.toString("hex"),
    });
    let addr = await Xaddr.publicKeyToAddr(hdKey.publicKey);

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
