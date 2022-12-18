#!/usr/bin/env node
"use strict";

let Fs = require("node:fs/promises");

let Bip39 = require("bip39");

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

  //let seedBuf = await Bip39.mnemonicToSeed(mnemonic);
  let seedBuf = await Bip39.mnemonicToSeed(mnemonic, secret);
  let seed = new Uint8Array(seedBuf.buffer);
  let seedHex = seedBuf.toString("hex");

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
