# dashhd.js

Browser, Node, Bundler, and CLI compatible Dash HD Wallet tools

# CLI

```sh
./bin/mnemonic-generate.js

# again cable air agree veteran march surface dragon behind isolate just wreck
```

```sh
./bin/mnemonic-to-seed.js
# Usage: mnemonic-to-seed <./menmonic.txt> [./passphrase.txt]

# f3f1ff73a93aa5b2fa5db7bdabc184e26bd5120fac3345d89133b3e027982f3d5a7b02704b7f03142873bb264498676798dbefa86ff63f18f14d12e61d114be4
```

```sh
./bin/seed-to-xkeys.js
# Usage: seed-to-wif <./seed.hex> [account] [direction]

# xprvA1uHCfBAez3GCjbyU8UWQitSaZ3RUUy8eft7mf8rnH5z6WCQJ6ehHTNAPRes6k6cwimXjhEHoxka79uoQ2Kdyx7BxbGYKGSnkdjfdjXfvjr
# xpub6EtdcAi4VMbZRDgSaA1WmrqB8asuswgz1toia3YULccxyJXYqdxwqFgeEexVxr8ytJPHZYTrhbYJjqaFumih45awabyaHwUmCvXbGf7sujG
```

```sh
./bin/seed-to-wif.js
# Usage: seed-to-wif <./seed.hex> [account] [direction] [index]

# XD3sNsdXjXvsnGtcbiqj3SCVdGHyHCRWFDaCAhWotxVfudSN4iRt
```

```sh
./bin/seed-to-wifs.js
# Usage:   seed-to-wif <./seed.hex> [fromPath] [toPath]
# Example: seed-to-wif  ./seed.hex   "0'/0/0"    "1'/0/1"
```

```txt
m/44'/5'/0'/0/0: XKHiWYkmDkNnWGP756UCGcuZ21mHGeYdWeCBBHCBGZaf3NYw1SAz
                 XjxyR1gve94LuKqkMLEeqJbEVM5B5q1ZSx
m/44'/5'/0'/0/1: XCsy8Qw1fLH7C1UxLjBfTfLpn8DMRK1TMNNE2a5J1F4TyE5UApcK
                 XxRrwh1xBWig9rfLyiy494u2vj6YXQMsH7

m/44'/5'/1'/0/0: XEWDJiCKuSaNHUoYFaGiTv1QG3p49xc4vx6cbS19CHZFe1TpwvJF
                 XrX7Ph3rXV9kyzQfcDteCf14xvm8nM5Mmg
m/44'/5'/1'/0/1: XHTyj295ekRT4UqDnYd5zdHwLZ5iJdQnN8DjH9CQqPxFVipJqYns
                 XxTRzgDwnED8cPmrnCRRwpnnT3v5VL3KcE
```

# Fixtures

For the purpose of testing against known-good values, we provide these fixtures.

## Mnemonic

This mnemonic can be used to generate any number of seeds, meaning any number of
"password-protected" wallets.

```txt
again cable air agree veteran march surface dragon behind isolate just wreck
```

**Misnomer Alert**: this is obviously a _passphrase_, but early on the term
_passphrase_ was mistakenly used to describe a _salt_, so we're stuck calling
this "mnemonic".

## Seed, xprv, WIFs, & Addrs (Empty Password)

If the mnemonic is used _without_ a "password" (or "secret"), it will produce
this HD Wallet "seed":

```txt
f3f1ff73a93aa5b2fa5db7bdabc184e26bd5120fac3345d89133b3e027982f3d5a7b02704b7f03142873bb264498676798dbefa86ff63f18f14d12e61d114be4
```

The `xprv` and `xpub` for the HD prefixes `m/44'/5'/0'/0` and `m/44'/5'/2'/1`
are:

```sh
# m/44'/5'/0'/0
xprvA1uHCfBAez3GCjbyU8UWQitSaZ3RUUy8eft7mf8rnH5z6WCQJ6ehHTNAPRes6k6cwimXjhEHoxka79uoQ2Kdyx7BxbGYKGSnkdjfdjXfvjr

xpub6EtdcAi4VMbZRDgSaA1WmrqB8asuswgz1toia3YULccxyJXYqdxwqFgeEexVxr8ytJPHZYTrhbYJjqaFumih45awabyaHwUmCvXbGf7sujG
```

```sh
# m/44'/5'/2'/1/2
xprvA1zEQq1FvKbQkXosnKgsBTrtk1K6iEfdUSLnHgf7ejLYU2NAU9mK5gqAYNP34ykNMfVkY4emcdTjuaqUmz2J7Hohupn9VFRhQrV6CWpmKaZ

xpub6EyapLY9kh9hy1tLtMDsYbodJ39b7hPUqfGP654jD4sXLphK1h5ZdV9ePgapU2jMrVBy4sXUW4CSxG3aXdDgJGTsMQFy8D51TRSdjcjQxpV
```

Given the HD paths `m/44'/5'/0'/0/0` and `m/44'/5'/2'/1/2`, that seed will
produce these WIFs (Private Keys) and Pay Addresses (PubKey Hashes).

```txt
                 (account 0, external/receiving, address 0)
m/44'/5'/0'/0/0: XD3sNsdXjXvsnGtcbiqj3SCVdGHyHCRWFDaCAhWotxVfudSN4iRt (WIF)
                 XnRtALP7ns8stH6o79RQTiWGeW2SQeetxL                   (Addr)

                 (account 2, internal/change, address 2)
m/44'/5'/2'/1/2: XJDdTJ1WigKiUdsvofPGmMCHoPd4kpWKD1yGrigJXuwqcxoLUn4W (WIF)
                 XoMEcuxW4Ki1SXduDjQUdntSYU4PWzhqTC                   (Addr)
```

## Seed, xprv, WIFs, & Addrs (Empty Password)

If the mnemonic is used with the "password" (or "secret") `supersecret123`, it
will produce this HD Wallet seed:

Secret: `supersecret123`

```txt
6f9c7acc33e3690d734de56619936d7dce1d3aadf624cdbb09e50a3c978c13234f59112e791910d0cd94c483113dcab0a637cb7f7b85fa78e7af6464e3967713
```

The `xprv` and `xpub` for the HD prefixes `m/44'/5'/0'/0` and `m/44'/5'/2'/1`
are:

```sh
# m/44'/5'/0'/0
xprvA1WUDWFxdE5UGW1XNTnkZnd3K6bdidZBTtzvtEQziBpS3N8tajC4QKyRLmas7DK4HXK76wSXgMV1uV6RbKyM5f4uu1VmguEhAqvzQwr2mrC

xpub6EVpd1nrTbdmUz5zUVKkvvZms8S886H2q7vXgcpcGXMQvAU38GWJx8HuC28Bm8Cizq7dHJvL6armkvL7vvxRpxUxAmpVQF6s8aq5BRBCMrD
```

```sh
# m/44'/5'/2'/1
xprvA1UUAiR2AFvujb6WyC4TSokLBR48hKSqczH9MZfBXoBUztPnsvWByTuVs5GvmbySGjZ95mZtBMv3p3eBPJFFi4efT8azWz8v5zqVT2dFm6Z

xpub6ETpaDwuzdVCx5Az5DbTowh4jStd6nAgzDCk9x4o68iTsgiwRTpSXGDyiNDf9dSC75MLM6wTmfcUntPgNFYZ728zZ84Wb3xs43C8YrGZoap
```

Given the HD paths `m/44'/5'/0'/0/0` and `m/44'/5'/2'/1/2`, that seed will
produce these WIFs (Private Keys) and Pay Addresses (PubKey Hashes).

```txt
                 (account 0, external/receiving, address 0)
m/44'/5'/0'/0/0: XKHiWYkmDkNnWGP756UCGcuZ21mHGeYdWeCBBHCBGZaf3NYw1SAz (WIF)
                 XjxyR1gve94LuKqkMLEeqJbEVM5B5q1ZSx                   (Addr)

                 (account 2, internal/change, address 2)
m/44'/5'/2'/1/2: XBwqVpx9SLtvoscmLgC2AtXoKZi5FxYKtYbPGTyjzsKBxsfAxrmy (WIF)
                 XhWFxtNSqwTqLYAQ9XQJbfQG3Hj64qLoGt                   (Addr)
```

**Misnomer Alert**: The so-called "secret" is actually a pbkdf2 _salt_, yet it's
sometimes also referred to as a "passphrase" or "password"... oh well 🤷‍♂️.

## More Fixtures

See [FIXTURES.md](./FIXTURES.md).
