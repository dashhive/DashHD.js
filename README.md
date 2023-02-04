# [DashHD.js](https://github.com/dashhive/dashhd.js)

Manage HD Keys from HD Wallet Seed and Extended (xprv, xpub) Key Paths. \
(compatible with the [Hierarchical Deterministic Keys (BIP-32)][bip-32] spec)

A fully-functional, production-ready reference implementation of Dash HD -
suitable for learning DASH specs and protocols, and porting to other languages.

```txt
HD Wallet Seed         : ac27495480225222079d7be181583751e86f571027b0497b5b5d11218e0a8a13332572917f0f8e5a589620c6f15b11c61dee327651a14c34e18231052e48c069

HD Key Path            :  m/44'/5'/0'/0/0
WIF                    :  XCGKuZcKDjNhx8DaNKK4xwMMNzspaoToT6CafJAbBfQTi57buhLK
Address                :  XrZJJfEKRNobcuwWKTD3bDu8ou7XSWPbc9

HD Key Path            :  m/44'/5'/1'/1/1
WIF                    :  XF9murLtNpJaZXbwMxqJ6BhigEtu9NxfBCJDBokCJcqFkYkz3itz
Address                :  XueHW2ELMxoXzXcaHMxmwVWhcADE1W5s8c
```

(that's the canonical _Zeed_ seed, generated from the canonical _Zoomonic_)

[bip-32]: https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki
[bip-39]: https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki
[bip-44]: https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki
[dash-phrase]: https://github.com/dashhive/dashphrase.js

## Install

### Node, Bun, & Bundlers

```sh
npm install --save @dashincubator/secp256k1@1.x
npm install --save dashhd@3.x
```

```js
let DashHd = require("dashd");
```

### Browser

```html
<script src="https://unpkg.com/@dashincubator/secp256k1.js"></script>
<script src="https://unpkg.com/dashkeys@0.9/dashkeys.js"></script>
<script src="https://unpkg.com/dashhd@3.x/dashhd.js"></script>
```

## Usage

**example:**

```js
var DashHd = require("dashhd");
var seed =
  "a0c42a9c3ac6abf2ba6a9946ae83af18f51bf1c9fa7dacc4c92513cc4dd015834341c775dcd4c0fac73547c5662d81a9e9361a0aac604a73a321bd9103bce8af";
var hdkey = await DashHd.fromMasterSeed(Buffer.from(seed, "hex"));
console.log(hdkey.privateExtendedKey);

// => 'xprv9s21ZrQH143K2SKJK9EYRW3Vsg8tWVHRS54hAJasj1eGsQXeWDHLeuu5hpLHRbeKedDJM4Wj9wHHMmuhPF8dQ3bzyup6R7qmMQ1i1FtzNEW'

var xpub = await hdkey.getPublicExtendedKey();
console.log(xpub);
// => 'xpub661MyMwAqRbcEvPmRAmYndzERhyNux1GoHzHxgzVHMBFkCro3kbbCiDZZ5XabZDyXPj5mH3hktvkjhhUdCQxie5e1g4t2GuAWNbPmsSfDp2'
```

### `await DashHd.fromMasterSeed(seedBuffer[, versions])`

Creates an `hdkey` object from a master seed buffer. Accepts an optional
`versions` object.

```js
var seed =
  "a0c42a9c3ac6abf2ba6a9946ae83af18f51bf1c9fa7dacc4c92513cc4dd015834341c775dcd4c0fac73547c5662d81a9e9361a0aac604a73a321bd9103bce8af";
var hdkey = await DashHd.fromMasterSeed(Buffer.from(seed, "hex"));
```

### `await DashHd.fromExtendedKey(extendedKey[, versions, skipVerification])`

Creates an `hdkey` object from a `xprv` or `xpub` extended key string. Accepts
an optional `versions` object & an optional `skipVerification` boolean. If
`skipVerification` is set to true, then the provided public key's x (and y if
uncompressed) coordinate will not will be verified to be on the curve.

```js
var key =
  "xprvA2nrNbFZABcdryreWet9Ea4LvTJcGsqrMzxHx98MMrotbir7yrKCEXw7nadnHM8Dq38EGfSh6dqA9QWTyefMLEcBYJUuekgW4BYPJcr9E7j";
var hdkey = await DashHd.fromExtendedKey(key);
```

**or**

```js
var key =
  "xpub6FnCn6nSzZAw5Tw7cgR9bi15UV96gLZhjDstkXXxvCLsUXBGXPdSnLFbdpq8p9HmGsApME5hQTZ3emM2rnY5agb9rXpVGyy3bdW6EEgAtqt";
var hdkey = DashHd.fromExtendedKey(key);
```

---

### `await hdkey.derive(path)`

Derives the `hdkey` at `path` from the current `hdkey`.

```js
var seed =
  "fffcf9f6f3f0edeae7e4e1dedbd8d5d2cfccc9c6c3c0bdbab7b4b1aeaba8a5a29f9c999693908d8a8784817e7b7875726f6c696663605d5a5754514e4b484542";
var hdkey = await DashHd.fromMasterSeed(Buffer.from(seed, "hex"));
var childkey = await hdkey.derive("m/0/2147483647'/1");

var xprv = await childkey.getPrivateExtendedKey();
console.log(xprv);
// -> "xprv9zFnWC6h2cLgpmSA46vutJzBcfJ8yaJGg8cX1e5StJh45BBciYTRXSd25UEPVuesF9yog62tGAQtHjXajPPdbRCHuWS6T8XA2ECKADdw4Ef"

var xpub = await childkey.getPublicExtendedKey();
console.log(xpub);
// -> "xpub6DF8uhdarytz3FWdA8TvFSvvAh8dP3283MY7p2V4SeE2wyWmG5mg5EwVvmdMVCQcoNJxGoWaU9DCWh89LojfZ537wTfunKau47EL2dhHKon"
```

Newer, "hardened" derivation paths look like this:

```js
// as defined by BIP-44
var childkey = await hdkey.derive("m/44'/0'/0'/0/0");
```

### `hdkey.wipePrivateData()`

Wipes all record of the private key from the `hdkey` instance. After calling
this method, the instance will behave as if it was created via
`DashHd.fromExtendedKey(xpub)`.

### `hdkey.getPrivateKey()`

Get the `hdkey`'s private key, stored as a buffer.

### `hdkey.publicKey`

Get the `hdkey`'s public key, stored as a buffer.

### `await hdkey.getPrivateExtendedKey()`

Get the `hdkey`'s `xprv`, stored as a string.

### `await hdkey.getPublicExtendedKey()`

Get the `hdkey`'s `xpub`, stored as a string.

## References

- https://github.com/bitcoinjs/bitcoinjs-lib/blob/master/src/hdnode.js
- http://bip32.org/
- http://blog.richardkiss.com/?p=313
- https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki
- http://bitcoinmagazine.com/8396/deterministic-wallets-advantages-flaw/

## License

Copyright © 2023 Dash Incubator \
Copyright © 2023 AJ ONeal \
Copyright © 2018-2022 cryptocoinjs

MIT License
