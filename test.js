"use strict";

let DashHd = require("./");
//let DashHd = require("dashhd");
let DashPhrase = require("dashphrase");
let DashKeys = require("dashkeys");

let words = "zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo wrong";
let secret = "TREZOR";

// m/44'/5'/0'/0/0
let wif000 = "XCGKuZcKDjNhx8DaNKK4xwMMNzspaoToT6CafJAbBfQTi57buhLK";
let addr000 = "XrZJJfEKRNobcuwWKTD3bDu8ou7XSWPbc9";

let xprv00 =
  "xprvA2L7qar7dyJNhxnE47gK5J6cc1oEHQuAk8WrZLnLeHTtnkeyP4w6Eo6Tt65trtdkTRtx8opazGnLbpWrkhzNaL6ZsgG3sQmc2yS8AxoMjfZ";
let xpub00 =
  "xpub6FKUF6P1ULrfvSrhA9DKSS3MA3digsd27MSTMjBxCczsfYz7vcFLnbQwjP9CsAfEJsnD4UwtbU43iZaibv4vnzQNZmQAVcufN4r3pva8kTz";

// m/44'/5'/1'/1/1
let wif111 = "XF9murLtNpJaZXbwMxqJ6BhigEtu9NxfBCJDBokCJcqFkYkz3itz";
let addr111 = "XueHW2ELMxoXzXcaHMxmwVWhcADE1W5s8c";

async function getWalletKeys() {
  let seed = await DashPhrase.toSeed(words, secret);
  let wallet = await DashHd.fromSeed(seed);
  let seedHex = DashKeys.utils.bytesToHex(seed);
  console.info(`Testing against Zoomonic Seed:`);
  console.info(`    ${seedHex}`);
  console.info();

  // m/44'/5'/0'/0/0
  let accountIndex = 0;
  let account = await wallet.deriveAccount(accountIndex);

  let use = DashHd.RECEIVE;
  let xkey = await account.deriveXKey(use);
  let xkey1 = await DashHd.derivePath(wallet, "m/44'/5'/0'/0");
  let xprv = await DashHd.toXPrv(xkey);
  if (xprv !== xprv00) {
    throw new Error("wallet xprv derivation mismatch v canonical");
  }
  let xprv1 = await DashHd.toXPrv(xkey1);
  if (xprv !== xprv1) {
    throw new Error("wallet xprv derivation mismatch");
  }
  let xpub = await DashHd.toXPub(xkey);
  if (xpub !== xpub00) {
    throw new Error("wallet xpub derivation mismatch v canonical");
  }
  let xpub1 = await DashHd.toXPub(xkey1);
  if (xpub !== xpub1) {
    throw new Error("wallet xpub derivation mismatch");
  }
  console.info(`  HD XKey Path:  m/44'/5'/${accountIndex}'/${use}`);
  console.info(`          XPrv: `, xprv.slice(0, 56));
  console.info(`                `, xprv.slice(56));
  console.info(`          XPub: `, xpub.slice(0, 56));
  console.info(`                `, xpub.slice(56));
  console.info();

  let addressIndex = 0;
  let key = await xkey.deriveAddress(addressIndex);
  let key1 = await DashHd.derivePath(wallet, "m/44'/5'/0'/0/0");

  let wif = await DashHd.toWif(key.privateKey);
  if (wif !== wif000) {
    throw new Error("wallet wif derivation mismatch");
  }
  let wif1 = await DashHd.toWif(key1.privateKey);
  if (wif !== wif1) {
    throw new Error("wallet wif derivation mismatch");
  }
  let addr = await DashHd.toAddr(key.publicKey);
  if (addr !== addr000) {
    throw new Error("wallet addr derivation mismatch");
  }
  let addr1 = await DashHd.toAddr(key1.publicKey);
  if (addr !== addr1) {
    throw new Error("wallet addr derivation mismatch");
  }
  let xkey2 = await DashHd.fromXKey(xpub);
  let key2 = await xkey2.deriveAddress(addressIndex);
  let addr2 = await DashHd.toAddr(key2.publicKey);
  if (addr !== addr2) {
    throw new Error("wallet xpub addr derivation mismatch");
  }

  console.info(
    `   HD Key Path:  m/44'/5'/${accountIndex}'/${use}/${addressIndex}`,
  );
  console.info(`           WIF:  ${wif}`);
  console.info(`       Address:  ${addr}`);
  console.info();
  console.info();

  // m/44'/5'/1'/1/1
  accountIndex = 1;
  account = await wallet.deriveAccount(accountIndex);

  use = DashHd.CHANGE;
  xkey = await account.deriveXKey(use);
  xkey1 = await DashHd.derivePath(wallet, "m/44'/5'/1'/1");
  xprv = await DashHd.toXPrv(xkey);
  xprv1 = await DashHd.toXPrv(xkey1);
  if (xprv !== xprv1) {
    throw new Error("wallet xprv derivation mismatch");
  }
  xpub = await DashHd.toXPub(xkey);
  xpub1 = await DashHd.toXPub(xkey1);
  if (xpub !== xpub1) {
    throw new Error("wallet xpub derivation mismatch");
  }
  console.info(`  HD XKey Path:  m/44'/5'/${accountIndex}'/${use}`);
  console.info(`          XPrv: `, xprv.slice(0, 56));
  console.info(`                `, xprv.slice(56));
  console.info(`          XPub: `, xpub.slice(0, 56));
  console.info(`                `, xpub.slice(56));
  console.info();

  addressIndex = 1;
  key = await xkey.deriveAddress(addressIndex);
  key1 = await DashHd.derivePath(wallet, "m/44'/5'/1'/1/1");

  wif = await DashHd.toWif(key.privateKey);
  if (wif !== wif111) {
    throw new Error("wallet wif derivation mismatch");
  }
  wif1 = await DashHd.toWif(key1.privateKey);
  if (wif !== wif1) {
    throw new Error("wallet wif derivation mismatch");
  }
  addr = await DashHd.toAddr(key.publicKey);
  if (addr !== addr111) {
    throw new Error("wallet addr derivation mismatch");
  }
  addr1 = await DashHd.toAddr(key1.publicKey);
  if (addr !== addr1) {
    throw new Error("wallet addr derivation mismatch");
  }
  xkey2 = await DashHd.fromXKey(xpub);
  key2 = await xkey2.deriveAddress(addressIndex);
  addr2 = await DashHd.toAddr(key2.publicKey);
  if (addr !== addr2) {
    throw new Error("wallet xpub addr derivation mismatch");
  }
  let xkey3 = await DashHd.fromXKey(xprv);
  let key3 = await xkey3.deriveAddress(addressIndex);
  let wif3 = await DashHd.toWif(key3.privateKey);
  if (wif !== wif3) {
    throw new Error("wallet xprv wif derivation mismatch");
  }
  let addr3 = await DashHd.toAddr(key3.publicKey);
  if (addr !== addr3) {
    throw new Error("wallet xprv addr derivation mismatch");
  }

  console.info(
    `   HD Key Path:  m/44'/5'/${accountIndex}'/${use}/${addressIndex}`,
  );
  console.info(`           WIF:  ${wif}`);
  console.info(`       Address:  ${addr}`);
  console.info();
  console.info(`PASS: all outputs match expected values`);
}

async function main() {
  await getWalletKeys();
}

main()
  .then(function () {
    process.exit(0);
  })
  .catch(function (err) {
    console.error("Fail:");
    console.error(err.stack || err);
    process.exit(1);
  });
