# Dropil Chain Wallet

Official Dropil Chain Wallet - Access supported Cosmos-SDK based chains to sign/broadcast transfer and delegation transactions

## Get in Touch

If you have questions or concerns about the wallet or you want to discuss being added as a supported network, get in touch with [@jmcalpine](https://t.me/jmcalpine) on Telegram

## Ongoing Development & Pull Requests

This is an ongoing project, development and new releases will be regular. Pull requests are highly welcomed for bug fixes or general feature additions.

### Running on Your Machine

In order to get started with a dev environment for this repo, follow the following steps:

1. Fork repository and open in editor of choice (Visual Studio Code is excellent)
2. Open terminal and run `npm install`
3. In the terminal run `grunt live`. The purpose of this is to generate the static CSS files used for switching between themes and for minified css files on production. Note: grunt is required to be installed in order to run `grunt` commands to generate the static css files
4. In the terminal run `npm run serve`
5. Navigate to `localhost:8080` or whatever URL your editor outputs
6. You are now in the dev environment!

Once you have made changes and have committed to your forked repo, go ahead and create a Pull Request and Dropil will review.

## Current Supported Networks

### Mainnet Networks

* Cosmos Hub (cosmoshub-3)

### Testnet Networks

* Dropil Chain (Dropil-Chain-Poseidon)

### Development Networks

* No supported networks yet

## About the Wallet

The wallet allows users to access their wallet via mnemonic phrase, a saved keystore (generated within the wallet), or a wallet previously saved in their browser. Ledger support will be added soon.

All actions taken by a user are on the client side and user's mnemonics or any method of accessing a wallet is not transmitted to any party including Dropil.

## Features

### Wallet Information & Balances

Once accessing a wallet, a user can view the following information about their wallet:

* Address information with the ability to update the HD derivation path
* Wallet balances (available, rewards, delegated amount, and unbonding amount) and it's current market value
* Active delegations including which validator, the amount delegated, and the amount of unclaimed rewards
* Unbonding delegations including the validator, unbonding amount, and remaining time in lock period

All of the information above is automatically updated every 60 seconds or can be manually reloaded every 10 seconds with the provided refresh button.

### Supported Transactions

The wallet also allows users to sign the following transaction types and then optionally save the signed tx JSON or broadcast the signed tx to a supported public API:

* Send Atoms (or whichever coin for the network they are accessing)
* Delegate Atoms
* Undelegate Atoms
* Transfer Delegation (redelegate)
* Withdraw unclaimed rewards
* Update withdraw rewards address

### Validator List

The wallet displays a list of the validators and some of the information about them to help users choose a validator to delegate their Atoms to. Users may easily delegate to a validator of their choosing by clicking the "delegate" button within the validator list.