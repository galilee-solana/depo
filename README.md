![DEPO - Dynamic Escrow Platform Operations](/docs/readme.gif)

<div align="center">
  <img src="https://img.shields.io/github/v/release/galilee-solana/depo?include_prereleases&labelColor=%23000000" alt="Version">
  <img src="https://img.shields.io/github/check-runs/galilee-solana/depo/main?labelColor=%23000000" alt="Checks">
  <img src="https://img.shields.io/github/contributors/galilee-solana/depo?labelColor=%23000000&color=%23ffffff" alt="GitHub contributors" >
  <img src="https://img.shields.io/github/issues/galilee-solana/depo.svg?labelColor=%23000000&color=%23ffffff" alt="Issues">
  <img src="https://img.shields.io/github/issues-pr-closed/galilee-solana/depo?labelColor=%23000000&color=%23ffffff" alt="Close PR">
  <img src="https://img.shields.io/badge/license-MIT-blue.svg?labelColor=%23000000&color=%23ffffff" alt="License">
</div>

A modular escrow solution on Solana, composed of a smart contract, a demo interface, and a JavaScript library, designed for quick integration into both Web2 and Web3 applications.

This project is developed as part of an academic proof of concept and focuses on creating a functional prototype showcasing the fundamental use cases of a decentralized escrow using an Anchor Program (Smart Contract) and a demo interface

Refer to the <a href="https://drive.google.com/drive/folders/14HRC7c7Hqz0cto9BRxC9p3FstWeAc_1n?usp=sharing">Product Requirements Document</a> for all the details

## Project Participants
- Romain Ecorchard
- Guillaume Debavelaere
- Maxime Normandin

## Links
- <a href="https://depo-tau.vercel.app/">Front-End Dapp</a>
- <a href="https://explorer.solana.com/address/8KnV7ENXbvy4Dx1YkmSkxCSvYDYubsU49FxKaDAfQNgm/domains?cluster=devnet">Program in Explorer</a>
- <a href="https://drive.google.com/drive/folders/14HRC7c7Hqz0cto9BRxC9p3FstWeAc_1n?usp=sharing">Product Requirements Document</a>
- <a href="https://excalidraw.com/#json=tSkZHuFGEfzd1i5n750T4,WuOR1v8TvPtiurGzndmHWQ">Excalidraw Document</a>

## Getting Started

### Prerequisites

- Node v18.18.0 or higher
- Rust v1.77.2 or higher
- Anchor CLI 0.30.1 or higher
- Solana CLI 1.18.17 or higher

### Installation

#### Clone the repo

```shell
git clone git@github.com:galilee-solana/depo.git
cd depo
```

#### Install Dependencies

Install pnpm first if you don't have it already:  
https://pnpm.io/installation

```shell
pnpm install
```

#### Start the web app

```
pnpm dev
```

## Apps

### anchor

This is a Solana program written in Rust using the Anchor framework.

#### Commands

You can use any normal anchor commands. Either move to the `anchor` directory and run the `anchor` command or prefix the
command with `pnpm`, eg: `pnpm anchor`.

#### Sync the program id:

Running this command will create a new keypair in the `anchor/target/deploy` directory and save the address to the
Anchor config file and update the `declare_id!` macro in the `./src/lib.rs` file of the program.

You will manually need to update the constant in `anchor/src/depo-exports.ts` to match the new program id.

```shell
pnpm anchor keys sync
```

#### Build the program:

```shell
pnpm anchor-build
```

#### Build the program and deployed it to configured machine cluster

```shell
pnpm anchor-build-deploy
```

#### Run the tests

```shell
pnpm anchor-test
```

#### Deploy to Devnet

```shell
pnpm anchor deploy --provider.cluster devnet
```

#### Run Rust Linter (Clippy)

```shell
pnpm rust-clippy
```

#### Start local test validator
Open a separate terminal to run the validator

```shell
solana-test-validator
```

Start the validator with a clean slate
```shell
solana-test-validator --reset
```


### web

This is a React app that uses the Anchor generated client to interact with the Solana program.

#### Commands

Start the web app

```shell
pnpm dev
```

Build the web app

```shell
pnpm build
```