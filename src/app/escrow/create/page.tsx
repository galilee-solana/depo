'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ToogleInputFieldNumber from '@/components/create/ToogleInputFieldNumber'
import ToogleInputFieldDateTime from '@/components/create/ToogleInputFieldDateTime'
import ToogleInputLink from '@/components/create/ToogleInputLink'
import ConfirmEscrow from '@/components/confirmescrow/ConfirmEscrow'
import { useEscrow } from '@/contexts/useEscrowCtx'

export default function CreateEscrow() {
  const router = useRouter()

  const { name, setName, description, setDescription, timelock, setTimelock, minimumAmount, setMinimumAmount, targetAmount, setTargetAmount } = useEscrow()

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Create your new DEPO.</h1>

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
      
      {/*<ToogleInputFieldDateTime
        label="Start Time"
        placeholder="Deposit start time"
        enabled={startTimeEnabled}
        setEnabled={setStartTimeEnabled}
        value={startTime}
        setValue={setStartTime}
      >*/}

      <ToogleInputFieldDateTime
        label="Time Lock"
        placeholder="Time Lock"
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

      <button
        onClick={() => router.push('/escrow/create/add_options')}
        className="text-left text-black flex items-center space-x-2"
        >
        <span>➕</span>
        <span>Add options</span>
      </button>

      <ToogleInputLink
        question="Is this a private or public DEPO ?"
        linkLabel="List of depositor address"
        href="create/set_depositor_address"
      />

      <ToogleInputLink
        question="Is there multiple recipients ?"
        linkLabel="List of recipient address"
        href="create/set_recipient_address"
      />

      <ConfirmEscrow
        name={name}
        description={description}
        timelock={timelock}
        minimumAmount={minimumAmount}
        targetAmount={targetAmount}
      />
    </div>
  )
}