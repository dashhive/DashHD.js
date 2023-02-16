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
- [Usage Overview](#usage-overwiew)
- [**Production-Ready** QuickStart](#production-quickstart)
- [API](#api)
  - Note on derivation exceptions
  - DashHd derivations & encodings
  - HD Key Types
- [Tutorial Walkthrough](#walkthrough)
  - Passphrase, Secret, Seed
  - Wallet Derivation
    - HD Path Derivation
    - _Wallet_, _Account_, and _X Key_ Derivation
      - XPrv and XPub Encoding
    - _Address Key_ Derivation
      - WIF and Address Encoding

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
let DashHd = require("dashd");
let DashPhrase = require("dashphrase");
```

## Browser

```html
<script src="https://unpkg.com/@dashincubator/secp256k1.js"></script>
<script src="https://unpkg.com/dashkeys@0.9/dashkeys.js"></script>
<script src="https://unpkg.com/dashhd@3.x/dashhd.js"></script>
```

```js
let DashHd = window.DashHd;
let DashPhrase = window.DashPhrase;
```

# Usage Overview

1. Generate a _Wallet_

   ```js
   let wallet = await DashHd.fromSeed(seedBytes);
   ```

   - As a one-off, you can **directly** generate an _Address Key_ by _HD Path_

     ```js
     let hdpath = `m/44'/5'/0'/0/0`;
     let key = await DashHd.derivePath(hdpath);

     let wif = await DashHd.toWif(key.privateKey);
     let address = await DashHd.toAddr(key.publicKey);
     ```

2. Generate an _Account_
   ```js
   let accountIndex = 0;
   let account = await wallet.deriveAccount(accountIndex);
   ```
3. Generate an _X Key_ (Extended Private or Public Key)
   ```js
   let use = DashHd.RECEIVE;
   let xkey = await account.deriveXKey(use);
   ```
4. (Optional) Generate _XPrv_ and _XPubs_
   ```js
   let xprv = DashHd.toXPrv(xkey);
   let xpub = DashHd.toXPub(xkey);
   ```
5. Generate an _Address Key_
   ```js
   let key = await xkey.deriveKey(use);
   ```
6. Generate _WIF_ & _Address_
   ```js
   let wif = await DashHd.toWif(key.privateKey);
   let address = await DashHd.toAddr(key.publicKey);
   ```

# Production QuickStart

However, production code will look more like this:

1. Get a _Seed_ from the user's _Passphrase Mnemonic_ and _Secret Salt_

   ```js
   let wordList = "zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo wrong";
   let secretSalt = "TREZOR";

   // Derive a Wallet Seed
   let seedBytes = await DashPhrase.toSeed(wordList, secretSalt);
   ```

2. Derive a _Wallet_, _Account_, and _X Key_, if possible. \
    (reject the _Passphrase_ or _Seed_ if _Account_ index 0 is not valid)

   ```js
   let accountIndex = 0;
   let xkey;

   try {
     let wallet = await DashHd.fromSeed(seedBytes); // seed from step 1

     let account = await wallet.deriveAccount(accountIndex);

     void (await account.deriveXKey(DashHd.CHANGE));
     xkey = await account.deriveXKey(DashHd.RECEIVE);
   } catch (e) {
     window.alert("Error: The passphrase can't generate a valid 1st account!");
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
       key = await xkey.deriveKey(i); // xkey from step 2
     } catch (e) {
       last += 1;
       continue;
     }

     let wif = await DashHd.toWif(key.privateKey);
     let address = await DashHd.toAddr(key.publicKey);
     let hdpath = `m/44'/5'/${accountIndex}'/${use}/${i}`;
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
  async toWif(privBytes, opts)
  async toAddr(pubBytes, opts)
  async toXPrv(xkey, opts)
  async toXPub(xkey, opts)
  ```
- DashHd (BIP-32)
  ```js
  create(hdkey)                      // depth-n HDKey (any)
  async derivePath(
          hdkey,
          hdpath,
        )
  async deriveChild(
          hdkey,
          index,
          isHardened,
        )
  ```
- HD Key Types
  ```js
  Wallet
    async deriveAccount(accountIndex)
  Account
    async deriveXKey(use = 0)
  XKey
    async deriveKey(keyIndex)
  Key
    { privateKey, publicKey }
  HDKey
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

This is the top-level export, and these methods are specific for the BIP-44 use
case of HD Keys for:

- Wallet
- Account
- XKey (XPrv or XPub)
- Key (WIF or Address)

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
let seed = await DashPhrase.toSeed(words, secret);
```

```js
let wallet = await DashHd.fromSeed(seedBytes, options);
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
let xkey = await DashHd.fromXKey(xkeyString, options);
// { deriveKey,
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

### `toWif(privBytes, opts)`

Wrapper around `DashKeys.encodeKey(keyBytes, options)` to Base58Check-encode a
Private Key as in _Wallet Import Format_.

```js
let addressIndex = 0;
let key = await xkey.deriveKey(addressIndex);
```

```js
let wif = await DashHd.toWif(key.privateKey);
// "XCGKuZcKDjNhx8DaNKK4xwMMNzspaoToT6CafJAbBfQTi57buhLK"
```

**Options**

```json5
{
  version: "cc",
}
```

### `toAddr(pubBytes, opts)`

Wrapper around `DashKeys.encodeKey(keyBytes, options)` to Base58Check-encode a
Public Key as an _Address_.

```js
let addressIndex = 0;
let key = await xkey.deriveKey(addressIndex);
```

```js
let wif = await DashHd.toAddr(key.publicKey);
// "XrZJJfEKRNobcuwWKTD3bDu8ou7XSWPbc9"
```

**Options**

```json5
{
  version: "4c", // (default) DASH PubKeyHash
}
```

### `toXPrv(hdkey)`

Wrapper around `DashKeys.encodeKey(keyBytes, options)` to Base58Check-encode an
_X Key_ as an _XPrv_.

```js
let use = DashHd.RECEIVE;
let xkey = await account.deriveXKey(use);

// Or...
let xkey = await DashHd.fromXKey(xprv);
```

```js
let xprv = await DashHd.toXPrv(xkey);
// "xprvA2L7qar7dyJNhxnE47gK5J6cc1oEHQuAk8WrZLnLeHTtnkeyP4w6Eo6Tt65trtdkTRtx8opazGnLbpWrkhzNaL6ZsgG3sQmc2yS8AxoMjfZ"
```

### `toXPrv(hdkey)`

Wrapper around `DashKeys.encodeKey(keyBytes, options)` to Base58Check-encode an
_X Key_ as an _XPub_.

```js
let use = DashHd.RECEIVE;
let xkey = await account.deriveXKey(use);

// Or...
let xkey = await DashHd.fromXKey(xpub);
```

```js
let xpub = await DashHd.toXPub(xkey);
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
let hdkey = DashHd.fromXKey(xpub, { bip32: true });
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
let hdkey = DashHd.fromSeed(seedBytes);
```

```js
let childKey = DashHd.derivePath(hdkey, `m/0'/0/1'/1/0`);
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
//0         1        2          3       4        5
`m/${purpose}'/${coin}'/${account}'/${use}/${index}`;
```

- Depth 0: _Wallet (Root) Key_ - calculated from a Seed
- Depth 1: _Purpose Key_ - predefined as index `44'` for BIP-44
- Depth 2: _Coin Key_ - predefined as index `5'` for DASH \
  (this is also sometimes referred to as the "Wallet")
- Depth 3: _Account Key_ - derived by account index
- Depth 4: _X Key_ is for sharing, derived by Use (Receiving or Change)
- Depth 5: _Key_ is for paying and getting paid (WIF or Address)
- Depth 6+: not defined by _BIP-44_, application specific

Keys can be derived

- by instance (recommended):

  ```js
  let wallet = await DashHd.fromSeed(seedBytes);

  let accountIndex = 0;
  let account = await wallet.deriveAccount(accountIndex);

  let use = DashHD.RECEIVE;
  let xkey = await account.deriveXKey(use);

  let addressIndex = 0;
  let key = await xkey.deriveKey(addressIndex);
  ```

- by path (not for loops):

  ```js
  let wallet = await DashHd.fromSeed(seedBytes);

  let hdpath = `m/${purpose}'/${coin}'/${account}'/${use}/${index}`;
  let key = await DashHd.derivePath(wallet, hdpath);
  ```

The benefit of deriving _by instance_ is that when you need to derive in a loop,
such as multiple keys at the same depth - e.g. Addresses from the same X Key, or
Accounts from the same Wallet - you're not deriving from the Wallet Root each
time.

Since the key derivation process is intentionally somewhat slow, it's best to
loop at the lowest level that you can. For example:

```js
// ...
let xkey = await account.deriveXKey(use);

for (let addressIndex = 0; addressIndex < 100; addressIndex += 1) {
  let key = await xkey.deriveKey(addressIndex);
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
let seed = await DashPhrase.toSeed(words, secret);

let wallet = await DashHd.fromSeed(seed, {});
```

To a different Coin Type or non-BIP-44 scheme:

```js
let purpose = 44;
let coinType = 0;
let accountIndex = 0;
let account = await DashHd.derivePath(
  wallet,
  `m/${purpose}'/${coinType}'/${accountIndex}'`,
);
```

### Account (depth 3)

A hardened HD Key with a `deriveXKey(use)` method.

From a Wallet:

```js
let accountIndex = 0;
let account = wallet.deriveAccount(accountIndex);

let use = DashHd.RECEIVE;
let xkey = await account.deriveXKey(use);
```

From an HD Path:

```js
let accountIndex = 0;
let account = await DashHd.derivePath(wallet, `m/44'/5'/${accountIndex}'`);

let use = DashHd.RECEIVE;
let xkey = await account.deriveXKey(use);
```

### XKey (depth 4)

An non-hardened HD Key with a `deriveKey(addressIndex)` method.

Represents a non-hardened XPrv or XPub.

Share an XPub with a contact so that they can derive additional addresses to pay
you repeatedly without sacrificing privacy, and without needing interaction from
you to creat ea new address each time.

Share an XPrv with an application so that you can load the XPub side and it can
use the XPrv side to make payments on your behalf.

From an Account:

```js
let use = DashHd.RECEIVE;
let xkey = await account.deriveXKey(use);

let addressIndex = 0;
let key = await xkey.deriveKey(addressIndex);
// { ...,
//  privateKey: privBytes, publicKey: pubBytes }
```

From an `xprv`:

```js
let xkey = await account.fromXKey(xprv);

let addressIndex = 0;
let key = await xkey.deriveKey(addressIndex);
// { ...,
//  privateKey: privBytes, publicKey: pubBytes }
```

From an `xpub`:

```js
let xkey = await account.fromXKey(xprv);

let addressIndex = 0;
let key = await xkey.deriveKey(addressIndex);
// { ...,
//  privateKey: null, publicKey: pubBytes }
```

### Key (depth 5)

The base _HD Key_ type, but with no additional methods.

A fully-derived BIP-44 Address (non-hardened).

```json5
{ ...,
  privateKey: privBytes, publicKey: pubBytes }
```

From a Wallet:

```js
let accountIndex = 0;
let account = await wallet.deriveAccount(accountIndex);

let use = DashHd.RECEIVE;
let xkey = await account.deriveXKey(use);

let addressIndex = 0;
let key = await xkey.deriveKey(addressIndex);
```

From an XPrv:

```js
let xkey = await account.fromXKey(xprv);

let addressIndex = 0;
let key = await xkey.deriveKey(addressIndex);
// { ...,
//   privateKey: privBytes, publicKey: pubBytes }
```

From an XPub:

```js
let xkey = await account.fromXKey(xpub);

let addressIndex = 0;
let key = await xkey.deriveKey(addressIndex);
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

## Part 1: Passphrase, Secret, Seed

The Passphrase (or Seed), **is** the Wallet.

- A _Wallet_ is derived from a _Seed_.
- A _Seed_ is typically derived from a _Passphrase Mnemonic_ and _Secret Salt_.

From a code perspective:

1. If your user doesn't supply a _Passphrase Mnemonic_, you can generate one:
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
4. _Key Expansion_ derives the _Seed_ from the _Passphrase_ + _Secret_ \
   (it's a specific configuration of PBKDF2 under the hood)
   ```js
   let seedBytes = await DashPhrase.toSeed(wordList, secretSalt);
   ```

Prompt the user **to make a backup** of their _Passphrase_. \
(or their _Seed_, if you're not implementing *Passphrase*s)

It's common to print this out and put it in a safe.

If the **_Passphrase_ is lost**, the Wallet (and all money) is
**unrecoverable**.

## Part 2: The Wallet Derivation

As mentioned in the API section, it is, in fact, possible for any derivation to
fail.

It's highly unlikely that you'll ever encounter it, but it should be handled
nonetheless.

1. Generate a _Wallet_ Key \
   (uses an HMAC-style Key Expansion, defined in BIP-32 )
   ```js
   let wallet;
   try {
     wallet = await DashHd.fromSeed(seed);
   } catch (e) {
     window.alert("the passphrass (or seed) could not be used to derive keys");
   }
   ```
2. Notify the user and retry a different Passphrase on failure.

### Part 2a: HD Path Derivation

As a **one-off**, HD Path Derivation can be very convenient:

Note: this approach would **5x slower** for deriving multiple keys because each
key will derive from the Root Wallet Key each time.

1. Define the target HD Path indexes to Depth 4 (_Use_ / _X Key_)
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
       key = DashHd.derivePath(wallet, hdpath); // as defined above
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
   let account;

   let use = DashHd.RECEIVE; // 0 = receive, 1 = change
   let xkey;

   while (!account) {
     try {
       account = await wallet.deriveAccount(accountIndex);
       xkey = await account.deriveXKey(use);
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
       key = await xkey.deriveKey(index);
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
