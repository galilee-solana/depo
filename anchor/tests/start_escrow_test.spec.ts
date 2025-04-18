import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair, LAMPORTS_PER_SOL} from '@solana/web3.js'
import {Depo} from '../target/types/depo'
import {v4 as uuidv4} from 'uuid'
import {strict as assert} from 'assert'
import {before} from "node:test";
import {BN} from "bn.js";

describe('Test- Intruction: start_escrow', () => {
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)

  const program = anchor.workspace.Depo as Program<Depo>

  const initializer = Keypair.generate()
  let escrowId: Uint8Array
  let escrowKey: anchor.web3.PublicKey
  let recipientWallet = Keypair.generate()
  let recipientKey: anchor.web3.PublicKey

  beforeEach(async () => {
    const signature = await provider.connection.requestAirdrop(
        initializer.publicKey,
        10 * LAMPORTS_PER_SOL
    )

    await provider.connection.confirmTransaction(signature, 'confirmed')

    const balance = await provider.connection.getBalance(initializer.publicKey)

    assert(balance > 0, 'Airdrop failed')

    // UUID Generation
    const uuid = uuidv4().replace(/-/g, '')
    // Convert UUID to Uint8Array (16 bytes)
    escrowId = Uint8Array.from(Buffer.from(uuid, 'hex'))

    // Escrow Name (100 bytes)
    const testName = 'TEST_ESCROW name'
    const name = Buffer.alloc(100)
    name.write(testName)

    // Escrow Description (200 bytes)
    const testDescription = 'TEST_ESCROW description'
    const description = Buffer.alloc(200)
    description.write(testDescription)

    const [escrowPDA, _bump] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from('escrow'), escrowId],
        program.programId
    )
    escrowKey = escrowPDA

    await program.methods.createEscrow(
        Array.from(escrowId),
        name,
        description
    )
    .accounts({
      escrow: escrowKey,
      signer: initializer.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .signers([initializer])
    .rpc()

    const escrowAccount = await program.account.escrow.fetch(escrowKey)
    expect(escrowAccount.status).toEqual({draft: {}});

    const [recipientPDA, _recipientBump] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from('recipient'), escrowKey.toBuffer(), recipientWallet.publicKey.toBuffer()],
        program.programId
    )

    recipientKey = recipientPDA

    await program.methods.addRecipient(
        Array.from(escrowId),
        recipientWallet.publicKey,
        new BN(100 * 100)
    )
    .accounts({
      escrow: escrowKey,
      recipient: recipientPDA,
      initializer: initializer.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .signers([initializer])
    .rpc()
  })

  it('starts escrow', async () => {
    const nowMinus1s = Math.floor(Date.now() / 1000) - 1
    await program.methods.startEscrow(
        Array.from(escrowId)
    )
    .accounts({
      escrow: escrowKey,
      initializer: initializer.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    }).signers([initializer])
    .rpc()

    const escrowAccount = await program.account.escrow.fetch(escrowKey)
    expect(escrowAccount.status).toEqual({started: {}});
    expect(escrowAccount.startedAt.toNumber()).toBeGreaterThanOrEqual(nowMinus1s)
  })

  it("fails to start escrow if not in draft status", async () => {
    await program.methods.startEscrow(
        Array.from(escrowId)
    )
    .accounts({
      escrow: escrowKey,
      initializer: initializer.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    }).signers([initializer])
    .rpc()

    const escrowAccount = await program.account.escrow.fetch(escrowKey)
    expect(escrowAccount.status).toEqual({started: {}});

    let err: any
    try {
      await program.methods.startEscrow(
          Array.from(escrowId)
      )
      .accounts({
        escrow: escrowKey,
        initializer: initializer.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      }).signers([initializer])
      .rpc()
    } catch (error) {
      err = error
    }

    expect(err).toBeDefined()
    expect(err.error.errorCode.code).toBe("EscrowNotDraft")
    expect(err.error.errorMessage).toBe("Escrow must be in Draft status to modify it")
  })

  it("fails to start escrow if there is no recipients", async () => {
    await program.methods.removeRecipient(
        Array.from(escrowId),
        recipientWallet.publicKey
    )
    .accounts({
      escrow: escrowKey,
      recipient: recipientKey,
      initializer: initializer.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .signers([initializer])
    .rpc()

    let escrowAccount = await program.account.escrow.fetch(escrowKey)
    expect(escrowAccount.recipientsCount).toBe(0)

    let err: any
    try {
      await program.methods.startEscrow(
          Array.from(escrowId)
      )
      .accounts({
        escrow: escrowKey,
        initializer: initializer.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      }).signers([initializer])
      .rpc()
    } catch (error) {
      err = error
    }

    expect(err).toBeDefined()
    expect(err.error.errorCode.code).toBe("NoRecipients")
    expect(err.error.errorMessage).toBe("No recipients in escrow")
  })
})