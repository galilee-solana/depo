'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ToogleInputFieldNumber from '@/components/ui/inputs/ToogleInputFieldNumber'
import ToogleInputFieldDateTime from '@/components/ui/inputs/ToogleInputFieldDateTime'
import ToogleInputLink from '@/components/ui/inputs/ToogleInputLink'
import ConfirmEscrow from '@/components/confirmescrow/ConfirmEscrow'
import { useEscrow } from '@/contexts/useEscrowCtx'
import RecipientsInputs from '@/components/create/RecipientsInputs'
import DynamicInputList from '@/components/ui/inputs/DynamicInputList'

export default function CreateEscrow() {
  const router = useRouter()

  const { name, setName, description, setDescription, timelock, setTimelock, minimumAmount, setMinimumAmount, targetAmount, setTargetAmount } = useEscrow()

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Create your new DEPO</h1>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2"> 
          <input
            placeholder="Deposit name #1"
            className="w-full px-3 py-2 border-2 border-black rounded-2xl bg-white text-black"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            placeholder="Description"
            className="w-full px-3 py-2 border-2 border-black rounded-2xl bg-white text-black"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="py-4 space-y-2">
            <h2 className="text-lg font-bold">Release conditions:</h2>
            <ToogleInputFieldDateTime
              label="Timelock"
              placeholder="Timelock"
              value={timelock}
              setValue={setTimelock}
            />

            <ToogleInputFieldNumber
              label="Minimum Amount"
              placeholder="Minimum Amount"
              value={minimumAmount}
              setValue={setMinimumAmount}
            />

            <ToogleInputFieldNumber
              label="Target Amount"
              placeholder="Target Amount"
              value={targetAmount}
              setValue={setTargetAmount}
            />
          </div>

          <ConfirmEscrow
            name={name}
            description={description}
            timelock={timelock}
            minimumAmount={minimumAmount}
            targetAmount={targetAmount}
          />
        </div>
        <div className="space-y-2">
          <DynamicInputList label="Recipients" />
        </div>
      </div>
    </div>
  )
}