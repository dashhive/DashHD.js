#!/usr/bin/env node
"use strict";

let Dashphrase = require("dashphrase");

async function main() {
  let bitLen = parseInt(process.argv[2], 10);
  if (!bitLen) {
    bitLen = 128;
  }

  // Ex: 'zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo wrong'
  let mnemonic = await Dashphrase.generate(bitLen);

  // TODO save to file
  console.info(mnemonic);
}

main();
