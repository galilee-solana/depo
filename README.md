# DEPO
### Dynamic Escrow Platform Operations

A modular escrow solution on Solana, composed of a smart contract, a demo interface, and a JavaScript library, designed for quick integration into both Web2 and Web3 applications.

This project is developed as part of an academic proof of concept and focuses on creating a functional prototype showcasing the fundamental use cases of a decentralized escrow using an Anchor Program (Smart Contract) and a demo interface

Refer to the <a href="https://drive.google.com/drive/folders/14HRC7c7Hqz0cto9BRxC9p3FstWeAc_1n?usp=sharing">Product Requirements Document</a> for all the details

## Project Participants
- Romain Ecorchard
- Guillaume Debavelaere
- Maxime Normandin

## Links
- <a href="https://depo-tau.vercel.app/">Front-End Dapp</a>
- <a href="">Program in Explorer</a> // TODO Add link when deployed
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

You will manually need to update the constant in `anchor/lib/counter-exports.ts` to match the new program id.

```shell
pnpm anchor keys sync
```

#### Build the program:

```shell
pnpm anchor-build
```

#### Start the test validator with the program deployed:

```shell
pnpm anchor-localnet
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