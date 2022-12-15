#!/usr/bin/env node
"use strict";

let Fs = require("node:fs/promises");

let Xaddr = require("./_xaddr.js");

let Base58Check = require("@dashincubator/base58check").Base58Check;
let HdKey = require("hdkey");

let b58c = Base58Check.create();

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

  let txt = await Fs.readFile(xpubPath, "utf8");
  let xpub = txt.trim();
  let publicRoot = HdKey.fromExtendedKey(xpub);

  let xpubParts = await b58c.decode(xpub);
  let depth = parseInt(xpubParts.xpub.slice(0, 2), 16);
  let parentIndex = parseInt(xpubParts.xpub.slice(10, 18), 16);

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
    let hdPub = publicRoot.deriveChild(index);
    let addr = await Xaddr.publicKeyToAddr(hdPub.publicKey);
    let fullpath = `${hdpath}/${index}`;

    console.error(`\n${fullpath}`);
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
