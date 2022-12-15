#!/usr/bin/env node
"use strict";

let Fs = require("node:fs/promises");

let Xaddr = require("./_xaddr.js");

let HdKey = require("hdkey");

async function main() {
  let args = process.argv.slice(2);

  let [xpubPath] = args;
  if (!xpubPath) {
    console.error("");
    console.error("Usage: xpub-to-addrs <./xpub.txt> <index>");
    console.error("");
    process.exit(1);
  }

  let index = parseInt(args[1], 10) || 0;

  let txt = await Fs.readFile(xpubPath, "utf8");
  let xpub = txt.trim();
  let publicRoot = HdKey.fromExtendedKey(xpub);

  //@ts-ignore
  let hdPub = publicRoot.deriveChild(index);
  let addr = await Xaddr.publicKeyToAddr(hdPub.publicKey);

  console.info(addr);
}

main()
  .then(function () {
    process.exit(0);
  })
  .catch(function (err) {
    console.error(err.stack || err);
    process.exit(1);
  });
