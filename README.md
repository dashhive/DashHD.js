# [DashHD.js](https://github.com/dashhive/dashhd.js)

Manage HD Keys from HD Wallet Seed and Extended (xprv, xpub) Key Paths. \
(compatible with the [Hierarchical Deterministic Keys (BIP-44)][bip-44] and [BIP-32][bip-32]
specs)

> A fully-functional, production-ready reference implementation of Dash HD -
> suitable for learning DASH specs and protocols, and porting to other
> languages.

```text
HD Wallet Seed:  ac27495480225222079d7be181583751e86f571027b0497b5b5d11218e0a8a13332572917f0f8e5a589620c6f15b11c61dee327651a14c34e18231052e48c069
                 (the canonical _Zeed_ seed, from the canonical _Zoomonic_)
```

```text
  HD XKey Path:  m/44'/5'/0'/0

          XPrv:  xprvA2L7qar7dyJNhxnE47gK5J6cc1oEHQuAk8WrZLnLeHTtnkeyP4w6
                 Eo6Tt65trtdkTRtx8opazGnLbpWrkhzNaL6ZsgG3sQmc2yS8AxoMjfZ
          XPub:  xpub6FKUF6P1ULrfvSrhA9DKSS3MA3digsd27MSTMjBxCczsfYz7vcFL
                 nbQwjP9CsAfEJsnD4UwtbU43iZaibv4vnzQNZmQAVcufN4r3pva8kTz


   HD Key Path:  m/44'/5'/0'/0/0

           WIF:  XCGKuZcKDjNhx8DaNKK4xwMMNzspaoToT6CafJAbBfQTi57buhLK
       Address:  XrZJJfEKRNobcuwWKTD3bDu8ou7XSWPbc9
```

```text
  HD XKey Path:  m/44'/5'/1'/1

          XPrv:  xprvA2ACWaqwADRtbkLsM6oQHzeWtqZVviBmKMKNRBFcwKGGRBgWHNeo
                 ZSKzduFMFkqvNsV5LaqRT9XRibzgSAweAAsfMF35PWy6beK3aL1BwTU
          XPub:  xpub6F9Yv6NpzazBpERLT8LQf8bFSsPzLAucgaEyDZfEVeoFHz1epuy4
                 7EeUVCRTNVToM1zgFZMxiGs2AFc9cNqZE2UVwJod2zPkG7W4ZGRuwJJ


   HD Key Path:  m/44'/5'/1'/1/1

           WIF:  XF9murLtNpJaZXbwMxqJ6BhigEtu9NxfBCJDBokCJcqFkYkz3itz
       Address:  XueHW2ELMxoXzXcaHMxmwVWhcADE1W5s8c
```

[bip-32]: https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki
[bip-39]: https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki
[bip-43]: https://github.com/bitcoin/bips/blob/master/bip-0043.mediawiki
[bip-44]: https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki
[dash-phrase]: https://github.com/dashhive/DashPhrase.js
[dash-keys]: https://github.com/dashhive/DashKeys.js

# Table of Contents

- [Install](#install)
  - Node, Bun, & Bundlers
  - Browser
- [Usage Overview](#usage-overview)
- [**Production-Ready** QuickStart](#production-quickstart)
- [API](#api)
  - Note on derivation exceptions
  - DashHd derivations & encodings
  - HD Key Types
- [Tutorial Walkthrough](#walkthrough)
  - Recovery Phrase, Secret, Seed
  - Wallet Derivation
    - HD Path Derivation
    - _Wallet_, _Account_, and _X Key_ Derivation
      - XPrv and XPub Encoding
    - _Address Key_ Derivation
      - WIF and Address Encoding
- [Glossary](#glossary)

# Install

Notes:

- **`secp256k1`** is **not a listed dependency** in `package.json` for this - \
  because there are many decent implementations to choose from. \
  HOWEVER, [DashKeys][dash-keys] will use `@dashincubator/secp256k1@1.x` \
  by default, it if is installed. \
  See [DashKeys][dash-keys] if you prefer to use another implementation.
- [DashPhrase][dash-phrase] is recommended, but not strictly required. \
  (you can work with bare `seed`s without a word list)

## Node, Bun, & Bundlers

```sh
npm install --save @dashincubator/secp256k1@1.x
npm install --save dashhd@3.x
npm install --save dashphrase
```

```js
let DashHd = require("dashhd");
let DashPhrase = require("dashphrase");
```

## Browser

```html
<script src="https://unpkg.com/@dashincubator/secp256k1@1.7.1-5/secp256k1.js"></script>
<script src="https://unpkg.com/dashkeys@1.x/dashkeys.js"></script>
<script src="https://unpkg.com/dashhd@3.x/dashhd.js"></script>
```

```js
let DashHd = window.DashHd;
let DashPhrase = window.DashPhrase;
```

# Usage Overview

**Already know** what you're doing?

**Clueless?** Go to the _QuickStart_ or _Tutorial_ section.

1. Generate a _Wallet_

   ```js
   let walletKey = await DashHd.fromSeed(seedBytes);
   ```

   - As a one-off, you can **directly** generate an _Address Key_ by _HD Path_

     ```js
     let hdpath = `m/44'/5'/0'/0/0`;
     let key = await DashHd.derivePath(walletKey, hdpath);

     let wif = await DashHd.toWif(key.privateKey);
     let address = await DashHd.toAddr(key.publicKey);
     ```

2. Generate an _Account_
   ```js
   let accountIndex = 0;
   let accountKey = await walletKey.deriveAccount(accountIndex);
   ```
3. Generate an _XPrv_ or _XPub_ _X Key_ (Extended Private or Public Key)
   ```js
   // generally used for as a 'receive' address (as opposed to 'change' address)
   let use = DashHd.RECEIVE;
   let xprvKey = await accountKey.deriveXKey(use);
   ```
4. (Optional) Generate _XPrv_ and _XPubs_
   ```js
   let xprv = await DashHd.toXPrv(xprvKey);
   let xpub = await DashHd.toXPub(xprvKey);
   ```
5. Generate an _Address Key_
   ```js
   let index = 0;
   let addressKey = await xprvKey.deriveAddress(index);
   ```
6. Generate _WIF_ & _Address_
   ```js
   let wif = await DashHd.toWif(key.privateKey);
   let address = await DashHd.toAddr(key.publicKey);
   ```

# Production QuickStart

However, production code will look more like this:

1. Get a _Seed_ from the user's _Recovery Phrase_ and _Secret Salt_

   ```js
   let wordList = "zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo wrong";
   let secretSalt = "TREZOR";

   // Derive a Wallet Seed
   let seedBytes = await DashPhrase.toSeed(wordList, secretSalt);
   ```

2. Derive a _Wallet_, _Account_, and _X Key_, if possible. \
    (reject the _Recovery Phrase_ or _Seed_ if _Account_ index 0 is not valid)

   ```js
   let accountIndex = 0;
   let xprvKey;

   try {
     let walletKey = await DashHd.fromSeed(seedBytes); // from step 1

     let accountKey = await walletKey.deriveAccount(accountIndex);

     void (await accountKey.deriveXKey(DashHd.CHANGE));
     xprvKey = await accountKey.deriveXKey(DashHd.RECEIVE);
   } catch (e) {
     window.alert(
       "Error: The recovery phrase can't generate a valid 1st account!",
     );
   }
   ```

   **Note**: For multi-*Account*s apps, just mark failed indexes as invalid.

3. Derive a batch of _Address_ keys (20 is the typical number)

   ```js
   let keys = [];
   let previousIndex = 0;
   let use = DashHd.RECEIVE;

   let last = previousIndex + 20;
   for (let i = previousIndex; i < last; i += 1) {
     let key;
     try {
       key = await xprvKey.deriveAddress(i); // xprvKey from step 2
     } catch (e) {
       // to make up for skipping on error
       last += 1;
       continue;
     }

     let wif = await DashHd.toWif(key.privateKey);
     let address = await DashHd.toAddr(key.publicKey);
     let hdpath = `m/44'/5'/${accountIndex}'/${use}/${i}`; // accountIndex from step 2
     keys.push({
       index: i,
       hdpath: hdpath, // useful for multi-account indexing
       address: address, // XrZJJfEKRNobcuwWKTD3bDu8ou7XSWPbc9
       wif: wif, // XCGKuZcKDjNhx8DaNKK4xwMMNzspaoToT6CafJAbBfQTi57buhLK
     });
   }
   ```

   Note: it may be useful to indicate the path of the

# API

- IMPORTANT
  - _all_ derivations _can_ fail
- DashHd
  ```js
  Constants
      MAINNET, TESTNET
      HARDENED, PUBLIC
      RECEIVE, CHANGE
  async fromSeed(seedBytes, opts)   // depth-0 hdkey (Wallet)
  async fromXKey(xprv||xpub, opts)  // depth-4 hdkey (XKey)
  async toPublic(xKey)
  async wipePrivateData(xKey)
  async toWif(privBytes, opts)
  async toAddr(pubBytes, opts)
  async toXPrv(xprvKey, opts)
  async toXPub(xKey, opts)
  ```
- DashHd (BIP-32)
  ```js
  create(hdkey)                      // depth-n HDKey (any)
  async derivePath(
          hdkey,
          hdpath,
        )
  async deriveChild(                 // (mostly for debugging)
          hdkey,
          index,
          isHardened,
        )
  ```
- HD Key Types
  ```js
  Wallet Key
    async deriveAccount(accountIndex)
  Account Key
    async deriveXKey(use = 0)
  X (Extended) Key
    async deriveAddress(keyIndex)
  Address Key
    { privateKey, publicKey }
  HD Key (Base Type)
    { versions, depth, parentFingerprint,
      index, chainCode, privateKey, publicKey }
  ```

## IMPORTANT

All _derive_ methods can fail (throw an error).

This is _highly-unlikely_, but _normal_ (because maths).

It's recommended that:

1. **Before accepting a seed as valid**, derive these HD Paths:
   ```
   m/44'/5'/0'/0/0
   m/44'/5'/0'/0/1
   m/44'/5'/0'/1/0
   m/44'/5'/0'/1/1
   ```
   If derivation fails, **reject the seed**.
2. When creating a **new Account Index**, always **derive both *Use Index*es**:
   ```
   m/44'/5'/n'/0
   m/44'/5'/n'/1
   ```
   If either the _Account Index_ or _Use Index_ derivation fails, \
   **mark the whole Account Index as invalid**.
3. If a key derivation ever fails, simply **mark that key as invalid**.
   ```
   m/44'/5'/0'/0/n
   ```

Most likely you will never personally encounter this failure.

However, when your software is generating millions and billions of keys across
thousands and millions of accounts, eventually one of the key expansion hashes
will _just so happen_ to hit _Infinity_ or _Zero_ on the curve.

Some libraries abstract this away by automatically incrementing to the next
index on failure, but since the occurrence is so rare, and therefore will
inevitably lead to highly confusing and difficult to track bugs (including
address re-use, a privacy concern), we do not.

## `DashHd`

This is the top-level export, and these methods are specific to the (modern &
current) BIP-44 standard for HD Keys for:

- Wallet Key
- Account Key
- X (Extended) Key (XPrv or XPub)
- Address Key (WIF or Address)

### Constants

**`MAINNET`**, **`TESTNET`**

The `version` byte that gets base58check encoded to a human-friendly prefix.

```js
//                          "xprv"              "xpub"
DashHd.MAINNET = { private: 0x0488ade4, public: 0x0488b21e };
```

```js
//                          "tprv"              "tpub"
DashHd.TESTNET = { private: 0x0488ade4, public: 0x0488b21e };
```

**`HARDENED`**, **`PUBLIC`**

Whether the HD Key should be derived as _Hardened_ or _Public_ (sharable).

```js
DashHd.HARDENED = true;
DashHd.PUBLIC = false;
```

**`RECEIVE`**, **`CHANGE`**

The intended use of the key - as a receiving address for external funds, or an
internal change address.

```js
DashHd.RECEIVE = 0;
DashHd.CHANGE = 1;
```

### `fromSeed(seedBytes, opts)`

Generate a [Wallet](#wallet) (depth-0 HD Key) \
with a default HD Path prefix of `m/44'/5'`.

```js
let words = "zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo wrong";
let secret = "TREZOR";
let seedBytes = await DashPhrase.toSeed(words, secret);
```

```js
let walletKey = await DashHd.fromSeed(seedBytes, options);
// { deriveAccount,
//   versions,
//   depth: 0, parentFingerprint: 0, index: 0,
//   chainCode, privateKey, publicKey }
```

**Options**

```json5
{
    purpose: 44, // BIP-44 (default)
    coinType: 5, // DASH (default)
    versions: DashHd.MAINNET, // default
}
```

### `fromXKey(xprv || xpub, opts)`

Parses a Base58Check-encoded `xprv` or `xpub` (Extended Private or Public Key)
into an _X Key_ (depth-4 HD Key).

Only the _depth_ is known. The prefix is **_not_** recoverable, but can be
assumed to be something like `m/44'/5'/0'/0`.

```js
let xprv =
  "xprvA2L7qar7dyJNhxnE47gK5J6cc1oEHQuAk8WrZLnLeHTtnkeyP4w6Eo6Tt65trtdkTRtx8opazGnLbpWrkhzNaL6ZsgG3sQmc2yS8AxoMjfZ";
```

```js
let xkey = await DashHd.fromXKey(xprvOrXPub, options);
// { deriveAddress,
//   versions: v, depth: n, parentFingerprint: p, index: 0,
//   chainCode: c, privateKey: privOrNull, publicKey: pubBytes }
```

**Options**

```json5
{
    bip32: false, // allow arbitrary depth (Wallet, Purpose, Coin, Account, etc)
    normalizePublicKey: false, // validate pubkey by re-ploting X,Y on curve
    versions: DashHd.MAINNET, // must match the given version
}
```

### `toPublic(xkey)`

Creates a copy of the HD Key with `privateKey` set to `null`.

```js
let xpubKey = await DashHd.toPublic(xprvKey);
```

### `wipePrivateData(xkey)`

Performs an in-place secure erase of the private key memory.

```js
await DashHd.wipePrivateData(xprvKey);
```

### `toWif(privBytes, opts)`

Wrapper around `DashKeys.encodeKey(keyBytes, options)` to Base58Check-encode a
Private Key as in _WIF_ (_Wallet Import Format_).

```js
let addressIndex = 0;
let key = await xprvKey.deriveAddress(addressIndex);
```

```js
let wif = await DashHd.toWif(key.privateKey);
// "XCGKuZcKDjNhx8DaNKK4xwMMNzspaoToT6CafJAbBfQTi57buhLK"
```

**Options**

```json5
{
  version: "cc", // (default) mainnet DASH Private Key
}
```

### `toAddr(pubBytes, opts)`

Wrapper around `DashKeys.encodeKey(keyBytes, options)` to Base58Check-encode a
Public Key as an _Address_.

```js
let addressIndex = 0;
let addressKey = await xkey.deriveAddress(addressIndex);
```

```js
let addr = await DashHd.toAddr(key.publicKey);
// "XrZJJfEKRNobcuwWKTD3bDu8ou7XSWPbc9"
```

**Options**

```json5
{
  version: "4c", // (default) mainnet DASH PubKeyHash
}
```

### `toXPrv(hdkey)`

Encode an _HD Key_ to **eXtended Private Key** format. \
(Base58Check with `xprv` magic version bytes)

Wrapper around `DashKeys.encodeKey(keyBytes, options)` to Base58Check-encode an
_X Key_ as an _XPrv_.

1. Get your XKey (XPrv Key) by one of

   - Derive via HD Path directly from a Wallet Key

   ```js
   // `m/${purpose}'/${coinType}'/${accountIndex}'/${use}`
   let hdpath = `m/44'/5'/0'/0`;
   let xprvKey = await DashHd.derivePath(walletKey, hdpath);
   ```

   - Derived from Account Key

   ```js
   let use = DashHd.RECEIVE;
   let xprvKey = await accountKey.deriveXKey(use);
   ```

   - Decode an Extended Private Key (`xprv`)

   ```js
   let xprvKey = await DashHd.fromXKey(xprv);
   ```

2. Encode to Base58Check `xprv`
   ```js
   let xprv = await DashHd.toXPrv(xprvKey);
   // "xprvA2L7qar7dyJNhxnE47gK5J6cc1oEHQuAk8WrZLnLeHTtnkeyP4w6Eo6Tt65trtdkTRtx8opazGnLbpWrkhzNaL6ZsgG3sQmc2yS8AxoMjfZ"
   ```

### `toXPub(hdkey)`

Encode an _HD Key_ to **eXtended Public Key** format. \
(Base58Check with `xprv` magic version bytes)

Wrapper around `DashKeys.encodeKey(keyBytes, options)` to Base58Check-encode an
_X Key_ as an _XPub_.

1. Get your XKey (XPub Key) by one of

   - Derive via HD Path directly from a Wallet Key

   ```js
   // `m/${purpose}'/${coinType}'/${accountIndex}'/${use}`
   let hdpath = `m/44'/5'/0'/0`;
   let xprvKey = await DashHd.derivePath(walletKey, hdpath);
   ```

   - Derived from Account Key

   ```js
   let use = DashHd.RECEIVE;
   let xprvKey = await accountKey.deriveXKey(use);
   ```

   - Decode an Extended Private Key (`xprv`)

   ```js
   let xpubKey = await DashHd.fromXKey(xprvOrXPub);
   ```

2. Encode to Base58Check `xprv`

   ```js
   let xpub = await DashHd.toXPub(xprvKeyOrXPubKey);
   // "xpub6FKUF6P1ULrfvSrhA9DKSS3MA3digsd27MSTMjBxCczsfYz7vcFLnbQwjP9CsAfEJsnD4UwtbU43iZaibv4vnzQNZmQAVcufN4r3pva8kTz"
   ```

## `DashHd` (BIP-32)

These are the more rudimentary functions which can be used for either style of
HD Keys:

- BIP-44 / BIP-43 (Wallet, Account, XKey, Key)
- or BIP-32 (generic HD Keys)

These do not enforce BIP-44 compliance, so they can be useful for testing and
debugging.

### `create(hdkey)`

Returns an _HD Key_ with any missing values set to their default.

```js
let hdkey = DashHd.create({
  chainCode: chainBytes,
  privateKey: privOrNull,
  publicKey: pubBytes,
});
```

**HD Key**

```json5
{
  versions: DashHd.MAINNET,
  depth: 0,
  parentFingerprint: 0,    // should be set if depth is set
  index: 0,
  chainCode: chainBytes,   // required
  privateKey: privOrNull,  // required (or null)
  publicKey: pubBytes,     // required
}
```

### `deriveChild(hdkey, index, isHardened)`

Derives one additional depth of an HD Key, by index value and hardness.

```js
let hdkey = await DashHd.fromXKey(xpub, { bip32: true });
```

```js
let UNHARDENED = false;
let nextIndex = 42;
let nextHdkey = await DashHd.deriveChild(hdkey, nextIndex, UNHARDENED);
```

### `derivePath(hdkey, hdpath)`

Iterates over an HD Path, calling `deriveChild(hdkey, index, isHardened)` for
each index.

Can derive any valid BIP-32 path, at any depth. \
(even if nonsensical - such as a hardened key after an unhardened one)

```js
let hdkey = await DashHd.fromSeed(seedBytes);
```

```js
let childKey = await DashHd.derivePath(hdkey, `m/0'/0/1'/1/0`);
// { versions, depth, parentFingerprint,
//   index, chainCode, privateKey, publicKey }
```

This is the same as

```js
let childKey = hdkey;
childKey = await DashHd.deriveChild(childKey, 0, true);
childKey = await DashHd.deriveChild(childKey, 0, false);
childKey = await DashHd.deriveChild(childKey, 1, true);
childKey = await DashHd.deriveChild(childKey, 1, false);
childKey = await DashHd.deriveChild(childKey, 0, false);
// { versions, depth, parentFingerprint,
//   index, chainCode, privateKey, publicKey }
```

## Key Types

A BIP-44 _HD Path_ has 5 depths, each with their own HD Key Type:

```js
//0         1        2           3      4        5
`m/${purpose}'/${coin}'/${account}'/${use}/${index}`;
//m        44'       5'          a'    0|1       i
```

- Depth 0: _Wallet (Root) Key_ - calculated from a Seed
- Depth 1: _Purpose Key_ - predefined as index `44'` for BIP-44
- Depth 2: _Coin Key_ - predefined as index `5'` for DASH (`1'` for testnet) \
  (this is also sometimes referred to as the "Wallet")
- Depth 3: _Account Key_ - derived by account index
- Depth 4: _X Key_ is for sharing, derived by Use (Receiving or Change)
- Depth 5: _Address Key_ is for paying and getting paid (WIF or Address)
- Depth 6+: not defined by _BIP-44_, application specific

Keys can be derived

- by instance (recommended: faster, maintains state):

  ```js
  let walletKey = await DashHd.fromSeed(seedBytes);

  let accountIndex = 0;
  let accountKey = await walletKey.deriveAccount(accountIndex);

  let use = DashHD.RECEIVE;
  let xkey = await accountKey.deriveXKey(use);

  let addressIndex = 0;
  let key = await xkey.deriveAddress(addressIndex);
  ```

- by path (slow if used in for loops):

  ```js
  let walletKey = await DashHd.fromSeed(seedBytes);

  let hdpath = `m/${purpose}'/${coin}'/${account}'/${use}/${index}`;
  let key = await DashHd.derivePath(walletKey, hdpath);
  ```

The benefit of deriving _by instance_ is that when you need to derive in a loop,
such as multiple keys at the same depth - e.g. Addresses from the same X Key, or
Accounts from the same Wallet - you're not deriving from the Wallet Root each
time.

Since the key derivation process is intentionally somewhat slow, it's best to
loop at the lowest level that you can. For example:

```js
// ...
let xkey = await accountKey.deriveXKey(use);

for (let addressIndex = 0; addressIndex < 100; addressIndex += 1) {
  let key = await xkey.deriveAddress(addressIndex);
  // ...
}
```

### Wallet (depth 0)

A root HD Key with a `deriveAccount(accountIndex)` method.

Can also derive BIP-32 HD Keys.

From a Seed:

```js
let words = "zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo wrong";
let secret = "TREZOR";
let seedBytes = await DashPhrase.toSeed(words, secret);

let walletKey = await DashHd.fromSeed(seedBytes, {});
```

To a different Coin Type or non-BIP-44 scheme:

```js
let purpose = 44; // depth 1 is always 44 for DASH
let coinType = 0; // depth 2 is always 0 for DASH
let accountIndex = 0;
let accountKey = await DashHd.derivePath(
  walletKey,
  `m/${purpose}'/${coinType}'/${accountIndex}'`,
);
```

### Purpose (depth 1)

Always `44'`, as in BIP-44 for DASH (and most other cryptocurrencies)

### Purpose (depth 3)

Always `5'`, which is a magic number specifying DASH.

Except `1'` for testnet, as per
https://github.com/satoshilabs/slips/blob/master/slip-0044.md.

See `fromSeed(seedBytes)` for options to change `purpose`, `coinType`, and
`versions`.

### Account (depth 3)

A hardened HD Key with a `deriveXKey(use)` method.

From a Wallet:

```js
let accountIndex = 0;
let accountKey = walletKey.deriveAccount(accountIndex);

let use = DashHd.RECEIVE;
let xkey = await accountKey.deriveXKey(use);
```

From an HD Path:

```js
let accountIndex = 0;
let accountKey = await DashHd.derivePath(
  walletKey,
  `m/44'/5'/${accountIndex}'`,
);

let use = DashHd.RECEIVE;
let xkey = await accountKey.deriveXKey(use);
```

### XKey (XPrv or XPub) (depth 4)

An HD Key with a `deriveAddress(addressIndex)` method.

Represents a "public" (i.e. non-hardened) XPrv or XPub.

Share an XPub with a contact so that they can derive additional addresses to pay
you repeatedly without sacrificing privacy, and without needing interaction from
you to creat a new address each time.

Share an XPrv with an application so that you can load the XPub side and it can
use the XPrv side to make payments on your behalf.

From an Account:

```js
let use = DashHd.RECEIVE;
let xkey = await accountKey.deriveXKey(use);

let addressIndex = 0;
let key = await xkey.deriveAddress(addressIndex);
// { ...,
//  privateKey: privBytes, publicKey: pubBytes }
```

From an `xprv`:

```js
let xkey = await accountKey.fromXKey(xprv);

let addressIndex = 0;
let key = await xkey.deriveAddress(addressIndex);
// { ...,
//  privateKey: privBytes, publicKey: pubBytes }
```

From an `xpub`:

```js
let xkey = await accountKey.fromXKey(xprv);

let addressIndex = 0;
let key = await xkey.deriveAddress(addressIndex);
// { ...,
//  privateKey: null, publicKey: pubBytes }
```

### Key (depth 5)

The base _HD Key_ type, but with no additional methods.

A fully-derived BIP-44 Address ("public" a.k.a. non-hardened).

```json5
{ ...,
  privateKey: privBytes, publicKey: pubBytes }
```

From a Wallet:

```js
let accountIndex = 0;
let accountKey = await walletKey.deriveAccount(accountIndex);

let use = DashHd.RECEIVE;
let xkey = await accountKey.deriveXKey(use);

let addressIndex = 0;
let key = await xkey.deriveAddress(addressIndex);
```

From an XPrv:

```js
let xkey = await accountKey.fromXKey(xprv);

let addressIndex = 0;
let key = await xkey.deriveAddress(addressIndex);
// { ...,
//   privateKey: privBytes, publicKey: pubBytes }
```

From an XPub:

```js
let xkey = await accountKey.fromXKey(xpub);

let addressIndex = 0;
let key = await xkey.deriveAddress(addressIndex);
// { ...,
//   privateKey: null, publicKey: pubBytes }
```

### HDKey

A generic HD Key at any depth.

```json5
{
  versions: DashHd.MAINNET,
  depth: 0,
  parentFingerprint: 0,    // should be set if depth is non-zero
  index: 0,
  chainCode: chainBytes,   // required
  privateKey: privOrNull,  // required (or null)
  publicKey: pubBytes,     // required
}
```

The same structure as [Key](#key), but documented separately - because BIP-32
doesn't define semantic differences between HD Keys at different depths (other
than the root).

# Walkthrough

This will focus on the **most typical** use case, where you intend to generate
**multiple addresses** as part of your application's lifecycle.

## Part 1: Recovery Phrase, Secret, Seed

The Recovery Phrase (or Seed), **is** the Wallet.

- A _Wallet_ is derived from a _Seed_.
- A _Seed_ is typically derived from a _Recovery Phrase_ and _Secret Salt_.

From a code perspective:

1. If your user doesn't supply a _Recovery Phrase_, you can generate one:
   ```js
   let targetBitEntropy = 128;
   let wordList = await DashPhrase.generate(targetBitEntropy);
   // "cat swing flag economy stadium alone churn speed unique patch report train"
   ```
2. Typically the _Secret Salt_ is left as an **empty string**:
   ```js
   let secretSalt = "";
   ```
3. HOWEVER, for this demo we'll use the _Zoomonic_ and _Zecret_ \
   (these values are specified by BIP-39's test suite for demos, debugging, etc)
   ```js
   let wordList = "zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo wrong";
   let secretSalt = "TREZOR";
   ```
4. _Key Expansion_ derives the _Seed_ from the _Recovery Phrase_ + _Secret_ \
   (FYI: it's a specific configuration of PBKDF2 under the hood)
   ```js
   let seedBytes = await DashPhrase.toSeed(wordList, secretSalt);
   ```

Prompt the user **to make a backup** of their _Recovery Phrase_. \
(or their _Seed_, if you're not implementing *Recovery Phrase*s)

It's common to print this out and put it in a safe.

If the **_Recovery Phrase_ is lost**, the Wallet (and all money) is
**unrecoverable**.

## Part 2: The Wallet Derivation

As mentioned in the API section, it is, in fact, possible for any derivation to
fail.

It's highly unlikely that you'll ever encounter it, but it should be handled
nonetheless.

1. Generate a _Wallet_ Key \
   (uses an HMAC-style Key Expansion, defined in BIP-32 )
   ```js
   let walletKey;
   try {
     walletKey = await DashHd.fromSeed(seedBytes);
   } catch (e) {
     window.alert(
       "the recovery phrase (or seed) could not be used to derive keys",
     );
   }
   ```
2. Notify the user and retry a different Recovery Phrase on failure.

### Part 2a: HD Path Derivation

As a **one-off**, HD Path Derivation can be very convenient:

Note: this approach would be **5x slower** for deriving multiple keys because
each key will derive from the Root Wallet Key each time.

1. Define the target HD Path indexes to Depth 4 (_Use_ a.k.a. _X Key_)
   ```js
   let accountIndex = 0;
   let use = DashHd.RECEIVE;
   let addressIndex = 0;
   let maxTries = 3;
   let hdPartial = `m/44'/5'/${accountIndex}'/${use}`;
   ```
2. Derive the Address Key (Depth 5)

   ```js
   let key;
   for (let i = addressIndex; i < maxTries; i += 1) {
     try {
       let hdpath = `${hdPartial}/${addressIndex}`;
       key = await DashHd.derivePath(wallet, hdpath); // as defined above
       break;
     } catch (e) {
       // ignore
     }
   }

   if (!key) {
     // more than 1 failure in a row would indicate
     // the accountIndex or use index could not be derived
     // (and hence no addressIndex will ever derive)
     throw new Error(
       `'${hdPartial}': 'account' or 'use' index cannot be derived`,
     );
   }
   ```

3. Mark the Account index as invalid and advance to the next on failure. \
   (or fail hard if it's the first account)

### Part 2b: _Wallet_, _Account_, _X Key_

This is the more **typical** and **efficient** use - for when you intend to
generate **multiple addresses** as part of your application's lifecycle.

1. Derive an Account Key and X Key \
   (reject the seed if the account at index 0 fails)

   ```js
   let accountIndex = 0;
   let accountKey;

   let use = DashHd.RECEIVE; // 0 = receive, 1 = change
   let xkey;

   while (!accountKey) {
     try {
       accountKey = await walletKey.deriveAccount(accountIndex);
       xkey = await accountKey.deriveXKey(use);
       break;
     } catch (e) {
       accountIndex += 1;
       // if your app handles multiple accounts, just try the next
     }
   }
   ```

   Note: technically you could advance the Use index, \
   but that's more complicated than just advancing to the next account

2. (optional) Encode the _X Key_ as XPrv or XPub for sharing
   ```js
   let xprv = await DashHd.toXPrv(xkey); // "xprv......"
   let xpub = await DashHd.toXPub(xkey); // "xpub......"
   ```

## Part 3: _Address Key_

This is final piece, which you use for making and receiving payments.

1. Derive an Address Key

   ```js
   let index = 0;
   let maxTries = 3;
   let last = index + maxTries;
   let key;

   for (let i = index; i < last; i += 1) {
     try {
       key = await xkey.deriveAddress(index);
     } catch (e) {
       // you may wish to mark the index as failed
     }
   }
   ```

2. Encode the Address Key as WIF or Address for use or sharing
   ```js
   let wif = DashKeys.toWif(keys.privateKey); // "X....."
   let addr = DashKeys.toAddr(keys.publicKey); // "X..."
   ```

# Glossary

See also [Dash Tools Glossary](https://github.com/dashhive/dash-tools#glossary).

- [Base2048](#base2048)
- [Base58Check](#base58Check)
- [BIPs](#bip)
- [BIP-32](#bip-32)
- [BIP-39](#bip-39)
- [BIP-43](#bip-43)
- [BIP-44](#bip-44)
- [Curve](#curve)
- [Derive (by Path)](#derive-by-path)
- [Derived Child Key](#derived-child)
- [Key Expansion](#key-expansion)
- [HD Account](#hd-account)
- [HD Address Key](#hd-address-key)
- [HD Keys](#hd-keys)
- [HD Recovery Phrase](#hd-recovery-phrase)
- [HD Path](#hd-path)
- [HD Wallet](#hd-wallet)
- [HD X Key](#hd-x-key)
- [Root Seed](#root-seed)
- [Root Key](#root-key)
- [Secp256k1](#secp256k1)
- [Test Vectors](#test-vectors)
- [XPrv](#xprv)
- [XPub](#xpub)
- [Zecret](#zecret)
- [Zeed](#zeed)
- [Zoomonic](#zoomonic)

## Base2048

Also: Base2048, _BIP39_, _BIP-0039_

Rather than a bank of 2, 16, 32, 58, 62, or 64 characters, \
you can encode data using a bank of whole words. \
If you use 2048 words, each word represents 11 _bits_. \
12 words represent 131 _bits_ of information. \
Any extra bits are used for checksumming the data. \

See [_HD Recovery Phrase_](#hd-recovery-phrase).

## Base58Check

The encoding format used for sharing _XPrv_ and _XPub_ Keys (_X Keys_). \
(among other things, such as _WIF_ and _Address_)

```text
xprvA2L7qar7dyJNhxnE47gK5J6cc1oEHQuAk8WrZLnLeHTtnkeyP4w6Eo6Tt65trtdkTRtx8opazGnLbpWrkhzNaL6ZsgG3sQmc2yS8AxoMjfZ
```

```text
xpub6FKUF6P1ULrfvSrhA9DKSS3MA3digsd27MSTMjBxCczsfYz7vcFLnbQwjP9CsAfEJsnD4UwtbU43iZaibv4vnzQNZmQAVcufN4r3pva8kTz
```

## BIP

Also: BIPs

Bitcoin Improvement Proposal(s). \
Specification Drafts / RFCs (Request For Comments).

## BIP-32

See [_HD Keys_](#hd-keys).

## BIP-39

Also: Base2048, _BIP39_, _BIP-0039_

BIP for [_HD Recovery Phrase_](#hd-recovery-phrase).

## BIP-43

BIP for the _Purpose_ index of the _HD Path_.

```js
`m/${purpose}'`;
```

This is the basis of [BIP-44][#bip-44] defining HD Paths as `m/44'/`.

See [_HD Keys_](#hd-keys).

## BIP-44

See [_HD Path_](#hd-path).

## Curve

Related to parameters of Elliptic Curve (ECDSA) cryptography / algorithms.

A single X value produces two Y values on a curve (rather than 1 on a line).

In rare instances, an X value may produce **no points** on the curve.

## Derive (by Path)

To split an HD Path by `/` and then iterate to derive each index (_Child_) in
turn.

**Cannot be reversed**.

See [`derivePath(hdkey, hdpath)`][#derivePath-hdkey-hdpath].

## Derived Child

A key directly derived from another key by an _HD Path_ index. \
(typically referring to a single index of the path, not the whole)

See
[`deriveChild(hdkey, index, isHardened)`][#derivePath-hdkey-index-ishardened].

## Key Expansion

An algorithm that creates a larger (byte-size) output than its input. \
Typically uses hashing algos: HMAC, SHA-2, SHA-3, etc. \
May combine multiple algos together. \
Usually intentionally slow. \
May run a high number of "Rounds" in succession. \
(typically hundreds or thousands).

_Recovery Phrase_ to _Seed_ (BIP-39) uses _PBKDF2_. \
_HD Keys_ (BIP-44) use HMAC and *Secp256k1 Tweak*ing for each index.

See also:

- `DashPhrase.toSeed(wordList)`
- `DashHd.fromSeed(seedBytes)`
- `DashHd.deriveChild(hdkey, index, isHardened)`

## HD Account

An HD Key derived at `m/44'/5'/n'` (Depth 3) of the HD Path.

See [API: Key Types](#key-types).

## HD Address Key

Also: _Key_, _HD Private Key_, _WIF_, _Address_

An HD Key at final depth `m/44'/5'/0'/0/0` (Depth 5) of an _HD Path_. \
Can be encoded as _WIF_ or _Address_ for making or receiving payments.

See also [API: Key Types](#key-types).

## HD Keys

Also: _Hierarchical Deterministic Keys_, _BIP-32_, _BIP-44_

Any of generic or purpose-specific keys derived deterministically form a seed.

See more at [API: Key Types](#key-types) (code above) and [HD Path](#hd-path).

## HD Recovery Phrase

Also: _Recovery Phrase_, _Mnemonic for Generating Hierarchical Deterministic
Keys_, _HD Wallet_, _BIP-39_

12 words used to derive an HD Seed. \
(11¾ for entropy, ¼ for checksum)

Ex: `zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo wrong`

Not used _directly_ in this library, but...\
it _is_ how the HD Seeds used here are typically generated.

See [DashPhrase.js](dash-phrase).

## HD Path

The path that defines an HD Key - typically of the BIP-44 variety:

- a _Root_, ex: `m` (depth 0, the Wallet Key, straight from the seed)
- an _Coin Key_, ex: `m/44'/5'` (depth 2)
- an _Account_, ex: `m/44'/5'/0'` (depth 3)
- an _X Key_ (_XPrv_ or _XPub_), ex: `m/44'/5'/0'/0` (depth 4, a.k.a. _Use_)
- an _Address Key_, ex: `m/44'/5'/0'/0/0` (depth 5, the end)
- `'` is used for "hardened" (parent) key segments, \
  but not for "public" (shareable) child key segments

In general:

```js
let hdpath = `m/${purpose}'/${coinType}'/${account}'/${use}/${index}`;
```

For DASH:

```js
let hdpath = `m/44'/5'/${account}'/${use}/${index}`;
```

See also [API: Key Types](#key-types) (code above).

## HD Wallet

Either the _Root Key_ at `m` (Depth 0), directly from the _Seed_, \
or the _Coin Key_ at `m/44'/5'` (Depth 2), of the _HD Path_. \
Sometimes also used to mean _HD Account_ at `m/44'/5'/n'`.

Here we typically use it to mean the _Root Key_. \
(because we're focus on DASH more so than other coins)

See also [API: Key Types](#key-types).

## HD X Key

Also: _XKey_, _XPrv_, _XPub_, _Use Key_, _Use Index_, _Extended Key_.

An HD Key derived at `m/44'/5'/0'/n` (Depth 4), of the _HD Path_.

Here we typically use it to mean the _Root Key_. \
(because we're focus on DASH more so than other coins)

See also [API: Key Types](#key-types).

## Root Seed

Also: Master Seed, Seed, HD Seed

Either:

- 64 random bytes
- a 64-byte hash derived from a _Recovery Phrase_

**Cannot be reversed**.

## Root Key

Also: _HD Wallet_, _Master Key_, _HD Master_

An HD Key of `m` (Depth 0), as derived directly from the Seed.

See also [API: Key Types](#key-types).

## Secp256k1

A specific set of parameters "the curve" used by most cryptocurrencies.

See [Curve](#curve).

## Test Vectors

The well-known values used for testing, demos, debugging, and development:

- DashPhrase / BIP-39:
  - <https://github.com/trezor/python-mnemonic/blob/master/vectors.json>
  - Includes the [_Zoomonic_](#zoomonic), [_Zecret_](#zecret), and
    [_Zeed_](#zeed).
- Generic HD Key / BIP-32:
  - <https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki#test-vectors>
- DashKeys / BIP-44:
  - [Zoomonic](#zoomonic)

## XPrv

Also: _Extended Private Key_, _XPriv_, _X Prv_, _X Priv_

Specifically the Base58Check-encoded form of an HD Key at Depth 4. \
(the _X Key_, a.k.a. _Use Key_, including the _Private Key_)\_ \
Can be used to derive any number of *WIF*s and *Address*es.

```text
xprvA2L7qar7dyJNhxnE47gK5J6cc1oEHQuAk8WrZLnLeHTtnkeyP4w6Eo6Tt65trtdkTRtx8opazGnLbpWrkhzNaL6ZsgG3sQmc2yS8AxoMjfZ
```

See [HD X Key](#hd-x-key).

## XPub

Also: _Extended Pubilc Key_, _X Pub_

Specifically the Base58Check-encoded form of an HD Key. \
(just the public key) Can be used to derive any number of receiving *Address*es.

```text
xpub6FKUF6P1ULrfvSrhA9DKSS3MA3digsd27MSTMjBxCczsfYz7vcFLnbQwjP9CsAfEJsnD4UwtbU43iZaibv4vnzQNZmQAVcufN4r3pva8kTz
```

See [XPrv](#xprv), [HD X Key](#hd-x-key).

## Zecret

The _Secret Salt_ used for the BIP-32 Test Vectors.

```text
TREZOR
```

```js
let secretSalt = "TREZOR";
```

Comes from the fact that the company Trezor (a hardware wallet) was involved in
creating the reference implementation and Test Vectors.

## Zeed

The canonical Seed (generated from the Zoomonic salted with "TREZOR"), \
to be used in documentation, examples, and test fixtures.

```txt
ac27495480225222079d7be181583751e86f571027b0497b5b5d11218e0a8a13332572917f0f8e5a589620c6f15b11c61dee327651a14c34e18231052e48c069
```

## Zoomonic

```txt
Recovery Phrase (Mnemonic) :  zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo wrong
Secret (Salt Password)     :  TREZOR
Seed                       :  ac27495480225222079d7be181583751e86f571027b0497b5b5d11218e0a8a13332572917f0f8e5a589620c6f15b11c61dee327651a14c34e18231052e48c069
```

# References

- https://github.com/dashhive/dash-tools
- https://github.com/bitcoinjs/bitcoinjs-lib/blob/master/src/hdnode.js
- http://bip32.org/
- http://blog.richardkiss.com/?p=313
- https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki
- http://bitcoinmagazine.com/8396/deterministic-wallets-advantages-flaw/

# License

Copyright © 2023 Dash Incubator \
Copyright © 2023 AJ ONeal \
Copyright © 2018-2022 cryptocoinjs

MIT License
