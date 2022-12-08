# Fixtures

For the sake of brevity, the [README.md](./README.md) shows just the first and
last WIFs (Private Keys) and Pay Addresses (PubKey Hashes) in the range of
`m/44'/5'/0'/0/0` to `m/44'/5'/2'/1/2`.

This is the _full_ range of

- mnemonic
- seeds (with and without "passphrase")
- accounts
- internal & external addresses

## Fixtures with Empty Secret

Mnemonic:

```txt
again cable air agree veteran march surface dragon behind isolate just wreck
```

Secret:

` ` (empty)

Seed:

```txt
f3f1ff73a93aa5b2fa5db7bdabc184e26bd5120fac3345d89133b3e027982f3d5a7b02704b7f03142873bb264498676798dbefa86ff63f18f14d12e61d114be4
```

HD Paths, WIFs, and Addrs:

```txt
m/44'/5'/0'/     Dash bip44 wallet, account 0

            0/   (external, receiving)
              0: XD3sNsdXjXvsnGtcbiqj3SCVdGHyHCRWFDaCAhWotxVfudSN4iRt
                 XnRtALP7ns8stH6o79RQTiWGeW2SQeetxL
              1: XJ8RCLHTg55mBbvv5mF5Ja3DikzBYWxHn5DvKyJoFm2cufBdUSc2
                 XeGtfXhcgeyLS2EtAnrkbEKNmVVDupZV6p
              2: XDD96h14FKRegvGsEMpymNLu4UqJzpY4PkUrhkhP9o3g7z65oMRE
                 Xkx2ocmdFcUGECGK3xcrRuyzoqDwLtShyc

            1/   (internal, change)
              0: XGDgATT8RqA6WG3FSRstKYaGuyGkoZXeMRmgU5FF1CWYt1b7DSkR
                 XyadxkLofvRTFmrvf3qsiTGX1m5dGiCuYX
              1: XHgFpm1ywS43EQwYDWEmxc2Zy6k48kHzvEBJPvdx2KyZgXQQCVqG
                 Xfz21AVj1Ua4x7fS2dD9dTanaBE8DP7Uyg
              2: XCN3TLzsmCdnhbw8HmJztkLWHCePChFYLuA9QZraFUzaMZPkamXL
                 XdaRs2Q8B3qkJVRLES2ApqPb75ExMmtceu


m/44'/5'/1'/     Dash bip44 wallet, account 1

            0/   (external, receiving)
              0: XFNpYLsUGoijAzDdooJzGxJPkP8NrNf6S2EGLEAAmb8TcPcGVoFd
                 XsB9ggzxJ3UgpE4RriwXvb3jiGw3uv8sDQ
              1: XE2ptvbvK8T2WApvgh7fzM94WtRhZRqkJqNrW7sfiuYahhBQQNLj
                 XmgLAeUdnKT93vJWo54vd78eT2tdnoMF3w
              2: XFuXKP9svkJkzpp8puGkavC5nQRU1Cjt5oPbGtXX5hKEEPEsWMxj
                 Xr86PVRvhgTnJ9USTctm9sP1WZt1eGZUfW

            1/   (internal, change)
              0: XKfd1GVmLyJfU68zyxzFrvVX6tnr77JzJ6Ad1xmAwo231pd6pfDr
                 XkP76UZeuqwVnhKA2ncx6aZdB4AAgZv4yS
              1: XBpr8kxFNxvFJe3nkftPywuLJhFH5ygko53YxkToLcvDZzX3Y9NW
                 Xx4EHCRe3d1CpHkpa57eDKvLvhUKvgC4SP
              2: XD9cDzRAhEXXkgWqcUoBUXKin9dM5eqdTwcepXQjgtcdZqboRQXL
                 XeHNoHf3FewcBMEy9mWQL7kFMonWh6PFSf


m/44'/5'/2'/     Dash bip44 wallet, account 2

            0/   (external, receiving)
              0: XDizH1g3P3CqAh7nNPYX83RtQtDsG29iErpPmxHP7ZjmhQRVZAqx
                 XtC2Sm4UY7tXdqyxjURxSApJHYZ33uF8aU
              1: XH8fhARTyJgScm6DrHYbSALK6H4iNFzyESzwCnCbbtbTz6bKoLwG
                 XgKbEjcWsx7RRu5ohXFFsLttjS6gBRvZMt
              2: XJh4ZoEEYAh2AM1VrQJJoafKkQTVAzAJSh2bcQ9AP9a89atY2D9m
                 Xajv1vCGKvyusZWegp8UgzESY6zqjyTnWZ

            1/   (internal, change)
              0: XJWgvKhgLqcsBTUwLj6n864azj2Vqo6hBYXm7VR7JwL6KmU9JBNG
                 XisHWzTAN8Rm7kaigogATdTuMfPjnFsq2U
              1: XK7vChAcbx7tLHHqyHMdVE7MRFKTZcx2xyoKfb49mXnJvVC7CJwe
                 XuauANur1G4for2EXV53zKvZP979xpESf8
              2: XJDdTJ1WigKiUdsvofPGmMCHoPd4kpWKD1yGrigJXuwqcxoLUn4W
                 XoMEcuxW4Ki1SXduDjQUdntSYU4PWzhqTC
```

## Password-Protected Fixtures

Mnemonic:

```txt
again cable air agree veteran march surface dragon behind isolate just wreck
```

Secret:

```txt
supersecret123
```

Seed (Protected):

```txt
6f9c7acc33e3690d734de56619936d7dce1d3aadf624cdbb09e50a3c978c13234f59112e791910d0cd94c483113dcab0a637cb7f7b85fa78e7af6464e3967713
```

HD Paths, WIFs, and Addrs:

In the range from `m/44'/5'/0'/0/0` to `m/44'/5'/2'/1/2`:

```txt
m/44'/5'/0'
            0/   (external, receiving)
              0: XKHiWYkmDkNnWGP756UCGcuZ21mHGeYdWeCBBHCBGZaf3NYw1SAz
                 XjxyR1gve94LuKqkMLEeqJbEVM5B5q1ZSx
              1: XCsy8Qw1fLH7C1UxLjBfTfLpn8DMRK1TMNNE2a5J1F4TyE5UApcK
                 XxRrwh1xBWig9rfLyiy494u2vj6YXQMsH7
              2: XK2VqpG59y2fdSCHzy9wfJSXhF7xgvvXu3oKNQodUAM8qhvN8ZVR
                 XeEhD8B2r3Fdz8szsFY8pY8cH3r4mh1UDF

            1/   (internal, change)
              0: XKXE4RCQKB3pHnFW1tNNXvAP9tqhxo3qN4bN5uHjXQ84UwdhVJgj
                 Xqa3XBhRAxTCVc9ojvbKJA7KZmsUd5d8fe
              1: XKcK7JSZzXG2eJrWjHikEykPEM2KvywcieQYCEeSDAFFRjMxRrQ4
                 Xs6KRVFbt3hv5G5HuPe3oBWMteA5CGdcta
              2: XHkDo8mqv3VgatjBqhNrq6jsmnNSt7puPYfQhtM8QB6g1pvbPzzM
                 XnWTMRckDXVez6FYCsCy2U7x6tcFerbHfd


m/44'/5'/1'/
            0/   (external, receiving)
              0: XEWDJiCKuSaNHUoYFaGiTv1QG3p49xc4vx6cbS19CHZFe1TpwvJF
                 XrX7Ph3rXV9kyzQfcDteCf14xvm8nM5Mmg
              1: XHTyj295ekRT4UqDnYd5zdHwLZ5iJdQnN8DjH9CQqPxFVipJqYns
                 XxTRzgDwnED8cPmrnCRRwpnnT3v5VL3KcE
              2: XChARnRCL6PBpBoDKQGy82dkSabviZPUPgRPs2MGHQViXWYbgGxg
                 XwSs9Y8eX7iLT1wSpC1qgxkU6h4LW6vUni

            1/   (internal, change)
              0: XFsMU7foVNWXxapcUS2veCFwrV87zAKKsDr37zTCRrW8fBj7rqy5
                 XbmKVM4uE16DZs2RBEycWpBFRzoa9NmyjF
              1: XJREPzkMSHobz6kpxKd7reMiWr3YoyTdaj3sJXLGCmiDHaL7vmaQ
                 Xj4Ey1oerk5KUKM71UQCTUBbmfyQuoUHDr
              2: XHrVjW9GkhviuQ5UJotSXFVxcUC1TKZrHL2R8AwHpHpC9fA3gZQj
                 XetM1kukDW5G96wFuUqpRA66fxHH9nRzTi


m/44'/5'/2'/
            0/   (external, receiving)
              0: XELXmQX4LRgGnYqrPMa1jPDGhYUikmxivodEcX74KHyvtRWK1KjF
                 XtYkQDxFs75iLsadeouNfCrcg3bYGydTuJ
              1: XKaiDcvK8hy7BPkPJozdv6z17GnPxFh2kiidhJZkWrj4kqW3Z1pK
                 XnmuW1WYJhejfSiW864tCqmJTdv9vsz89n
              2: XDBC1bc8Z4ooD7p5GRzeJS8SFGHNkXrs4CAQ2qCbvWxPDiceRTyp
                 XeU31xtaxdi4qWjHYmJB7F14gKpqzadN8t

            1/   (internal, change)
              0: XFbug6RN1sYGnkxLrHnvDTaDhNnN9YW4xgb96Bv62fzseCz2Fb7E
                 Xpz5Wm5qwWZh1GHf8DDDQwzBbaVS358rrJ
              1: XFMHz7bH1UTsUSMx9eMeigpeS5zbfY4FbcCc4K8t8uNU5961xBCC
                 XhDQGGcNCQDkP95dNJBznoMUYdcC8Ttxqe
              2: XBwqVpx9SLtvoscmLgC2AtXoKZi5FxYKtYbPGTyjzsKBxsfAxrmy
                 XhWFxtNSqwTqLYAQ9XQJbfQG3Hj64qLoGt
```
