import { createContext, useContext, useState } from 'react';
import { PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { v4 as uuidv4 } from 'uuid';
import BN from 'bn.js';

const EscrowContext = createContext(null);

export function EscrowProvider({ children }) {
  const [client, setClient] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [recipients, setRecipients] = useState([]); // [{ id, address }]
  const [modules, setModules] = useState([]);

  const create = async () => {
    if (!client || !name || !description) return;

    try {
      const uuid = uuidv4().replace(/-/g, '');
      const { key: escrowKey, bufferId: escrowId } = client.getPdaKeyAndBufferId(uuid);

      const nameBuffer = Buffer.alloc(100);
      nameBuffer.write(name);
      const descriptionBuffer = Buffer.alloc(200);
      descriptionBuffer.write(description);

      const transaction = new Transaction();

      const createEscrowIx = await client.program.methods
        .createEscrow(
          Array.from(escrowId),
          nameBuffer,
          descriptionBuffer
        )
        .accounts({
          escrow: escrowKey,
          signer: client.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .instruction();

      transaction.add(createEscrowIx);

      if (recipients && recipients.length > 0) {
        for (const recipient of recipients) {
          const addRecipientIx = await client.program.methods
            .addRecipient(
              Array.from(escrowId),
              recipient.address,
              0
            )
            .accounts({
              escrow: escrowKey,
              initializer: client.wallet.publicKey,
              systemProgram: SystemProgram.programId,
            })
            .instruction();

          transaction.add(addRecipientIx);
        }
      }

      if (modules.some(m => m.type === 'minimumAmount')) {
        const minModule = modules.find(m => m.type === 'minimumAmount');
        const minAmountPda = PublicKey.findProgramAddressSync(
          [Buffer.from('minimum_amount'), escrowKey.toBuffer()],
          client.program.programId
        )[0];

        const minAmountIx = await client.program.methods
          .addMinimumAmount(
            Array.from(escrowId),
            new BN(minModule.amount)
          )
          .accounts({
            escrow: escrowKey,
            minimumAmount: minAmountPda,
            initializer: client.wallet.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .instruction();

        transaction.add(minAmountIx);
      }

      if (modules.some(m => m.type === 'withdrawAuthority')) {
        const withdrawModule = modules.find(m => m.type === 'withdrawAuthority');
        if (!withdrawModule?.wallet || !PublicKey.isOnCurve(new PublicKey(withdrawModule.wallet))) {
          throw new Error("Invalid withdraw authority address");
        }

        const withdrawAuthority = new PublicKey(withdrawModule.wallet);

        const withdrawAuthPda = PublicKey.findProgramAddressSync(
          [Buffer.from('withdraw_authority'), escrowKey.toBuffer()],
          client.program.programId
        )[0];

        const withdrawIx = await client.program.methods
          .addWithdrawAuthority(Array.from(escrowId), withdrawAuthority)
          .accounts({
            escrow: escrowKey,
            withdrawAuthority: withdrawAuthPda,
            initializer: client.wallet.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .instruction();

        transaction.add(withdrawIx);
      }

      const txid = await client.program.provider.sendAndConfirm(transaction);
      console.log("Transaction confirmed:", txid);

      return { escrowKey, txid, uuid };
    } catch (error) {
      console.error("Error creating escrow:", error);
      throw error;
    }
  };

  return (
    <EscrowContext.Provider value={{ client, setClient, name, setName, description, setDescription, recipients, setRecipients, modules, setModules, create }}>
      {children}
    </EscrowContext.Provider>
  );
}

export const useEscrow = () => useContext(EscrowContext);