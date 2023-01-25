#!/usr/bin/env node
"use strict";

let Fs = require("node:fs/promises");

let DashHD = require("../dashhd.js");

let Dashphrase = require("dashphrase");

async function main() {
  let args = process.argv.slice(2);

  let [mnemonicPath, passPath] = args;
  if (!mnemonicPath) {
    console.error(
      "Usage: mnemonic-to-seed <./mnemonic.txt> [./passphrase.txt]",
    );
    process.exit(1);
  }
  let txt = await Fs.readFile(mnemonicPath, "utf8");
  let words = txt
    .trim()
    .split(/[\s,]+/m)
    .filter(Boolean);
  let mnemonic = words.join(" ");

  let secret = "";
  if (passPath) {
    let secretTxt = await Fs.readFile(passPath, "utf8");
    secret = secretTxt.trim();
  }

  let seedBuf = await Dashphrase.toSeed(mnemonic, secret);
  let seed = new Uint8Array(seedBuf.buffer);
  let seedHex = DashHD.utils.u8ToHex(seedBuf);

  // stderr
  console.error(`${seed.length}-byte seed:`);
  // stdout (to file)
  console.info(`${seedHex}`);
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
