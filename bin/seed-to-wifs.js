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

  let [seedPath, fromPath, toPath] = args;
  if (!seedPath) {
    console.error("");
    console.error("Usage:");
    console.error("        seed-to-wif <./seed.hex> [fromPath] [toPath]");
    console.error("");
    console.error("The default from path is \"m/44'/5'/0'/0/0\".");
    console.error(
      "(a BIP44 Dash wallet's first account's first receiving address)",
    );
    console.error(
      "Only the latter, most unique parts of the path are required.",
    );
    console.error("");
    console.error("EXAMPLES");
    console.error("");
    console.error("        (these are all EQUIVALENT)");
    console.error('        seed-to-wif ./seed.hex "5" "15"');
    console.error('        seed-to-wif ./seed.hex "0/5" "15"');
    console.error('        seed-to-wif ./seed.hex "0/5" "0/15"');
    console.error('        seed-to-wif ./seed.hex "0\'/0/5" "15"');
    console.error('        seed-to-wif ./seed.hex "m/44\'/5\'/0\'/0/5" "15"');
    console.error(
      "        seed-to-wif ./seed.hex \"m/44'/5'/0'/0/5\" \"m/44'/5'/0'/0/15\"",
    );
    console.error("");
    console.error('        seed-to-wif ./seed.hex "m/44\'/5\'/0\'/0/0" "10"');
    console.error(
      "        seed-to-wif ./seed.hex \"m/44'/5'/0'/0/0\" \"1'/10\"",
    );
    console.error(
      "        seed-to-wif ./seed.hex \"m/44'/5'/0'/0/0\" \"3'/1/5\"",
    );
    console.error("");
    process.exit(1);
  }

  let txt = await Fs.readFile(seedPath, "utf8");
  let seedHex = txt.trim();
  let seedBuf = Buffer.from(seedHex, "hex");

  let privateRoot = HdKey.fromMasterSeed(seedBuf);

  let defaultEntries = `m/44'/${coinType}'/0'/0/0`.split("/");

  let fromEntries = (fromPath || "").split("/").filter(Boolean);
  let toEntries = (toPath || "").split("/").filter(Boolean);

  let possibleChild = toEntries.length <= fromEntries.length;
  if (!possibleChild) {
    throw new Error(`'${fromPath}' is not a parent of '${toPath}'`);
  }

  fromEntries = defaultEntries
    .slice(0, defaultEntries.length - fromEntries.length)
    .concat(fromEntries);

  toEntries = fromEntries
    .slice(0, fromEntries.length - toEntries.length)
    .concat(toEntries);

  /*
  // skip 'm'
  for (let pIndex = 1; pIndex < defaultEntries.length; pIndex += 1) {
    if (fromEntries[pIndex] === toEntries[pIndex]) {
        continue;
    }

    for (let ) {
    }
  }
  */

  // First 15 addresses of account 0
  // m/44'/5'/0'/0/0 => m/44'/5'/0'/0/14
  // m/44'/5'/0'/0 [0] => [14]
  //
  // First addresses of first 10 accounts
  // m/44'/5'/0'/0/0 => m/44'/5'/10'/0/0
  // m/44'/5'/2'/0 [0] => [0]
  async function walkPath(common, fromEntries, toEntries) {
    //console.log(common);
    if (!fromEntries.length) {
      let key = await privateRoot.derive(common);
      let wif = await b58c.encode({
        privateKey: key.privateKey.toString("hex"),
        compressed: true,
      });
      console.info(`${common}: ${wif}`);
      return;
    }

    // go from 'from' to 'to'
    let from = parseInt(fromEntries[0], 10);
    let to = parseInt(toEntries[0], 10);
    if (from > to) {
      throw new Error(`can't count backwords from '${from}' to '${to}'`);
    }

    let harden = "";
    if ("'" === fromEntries[0].slice(-1)) {
      harden = "'";
    }

    for (let i = from; i <= to; i += 1) {
      await walkPath(
        `${common}/${i}${harden}`,
        fromEntries.slice(1),
        toEntries.slice(1),
      );
    }
  }

  await walkPath("m", fromEntries.slice(1), toEntries.slice(1));

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
}

main()
  .then(function () {
    console.info();
    process.exit(0);
  })
  .catch(function (err) {
    console.error(err.stack || err);
    process.exit(1);
  });
