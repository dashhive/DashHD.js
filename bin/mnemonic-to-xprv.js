#!/usr/bin/env node
"use strict";

let Fs = require("node:fs/promises");

let Base58Check = require("@dashincubator/base58check").Base58Check;
let b58c = Base58Check.create();
let HdKey = require("hdkey");

let Bip39 = require("bip39");

let purpose = 44; // TODO testnet?
let coinType = 5; // TODO testnet?

async function main() {
  let args = process.argv.slice(2);

  let [mnemonicPath, passPath, hdpath] = args;
  if (!mnemonicPath) {
    console.error(
      [
        "",
        "Usage",
        "        mnemonic-to-xprv <./mnemonic.txt> [./password.txt] [hdpath]",
        "",
        "Examples",
        "        # '/'-suffixed paths will assume the default prefix",
        "        # (these are all equivalent)",
        '        mnemonic-to-xprv ./mnemonic.txt ./password.txt "/0"',
        '        mnemonic-to-xprv ./mnemonic.txt ./password.txt "/0\'/0"',
        "        mnemonic-to-xprv ./mnemonic.txt ./password.txt \"m/44'/5'/0'/0\"",

        "",
        "        # specify hdpath without password",
        '        mnemonic-to-xprv ./mnemonic.txt "" "/0"',
        "",

        "        # 'm'-prefixed paths will be used exactly (allowing broad xkeys)",
        "        # (each of these are different)",
        "        mnemonic-to-xprv ./mnemonic.txt ./password.txt \"m/44'/5'/0'/0\"",
        "        mnemonic-to-xprv ./mnemonic.txt ./password.txt \"m/44'/5'/0'\"",
        "        mnemonic-to-xprv ./mnemonic.txt ./password.txt \"m/44'/5'\"",
        "",
        "IMPORTANT",
        "        \"m/44'/5'\" MUST be used for compatibility with other Dash wallets",
        "",
      ].join("\n"),
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

  let privateRoot = HdKey.fromMasterSeed(seedBuf);

  let defaultEntries = `m/${purpose}'/${coinType}'/0'/0`.split("/");

  let fromEntries = (hdpath || "").split("/").filter(Boolean);

  let isPathSuffix = !fromEntries[0]?.startsWith("m");
  if (isPathSuffix) {
    fromEntries = defaultEntries
      .slice(0, defaultEntries.length - fromEntries.length)
      .concat(fromEntries);
  }

  // a "wallet" is the path up to `m/44'/${coinType}'/${account}'`
  // the "addresses" are the paths down from `${direction}/${index}`
  let hdPrefix = fromEntries.join("/");
  let xKey = privateRoot.derive(hdPrefix);
  let xKeys = xKey.toJSON();

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
