'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ToogleInputFieldNumber from '@/components/create/ToogleInputFieldNumber'
import ToogleInputFieldDateTime from '@/components/create/ToogleInputFieldDateTime'
import ToogleInputLink from '@/components/create/ToogleInputLink'

export default function CreateEscrow() {
  const { publicKey } = useWallet()
  const router = useRouter()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [startTimeEnabled, setStartTimeEnabled] = useState(false)
  const [startTime, setStartTime] = useState('')
  const [timelockEnabled, setTimelockEnabled] = useState(false)
  const [timelock, setTimelock] = useState('')
  const [minimumAmountEnabled, setMinimumAmountEnabled] = useState(false)
  const [minimumAmount, setMinimumAmount] = useState('')
  const [targetAmountEnabled, setTargetAmountEnabled] = useState(false)
  const [targetAmount, setTargetAmount] = useState('')
  const [DepositorEnabled, setDepositorEnabled] = useState(false)
  const [RecipientEnabled, setRecipientEnabled] = useState(false)

  useEffect(() => {
    if (publicKey) {
      console.log("Connected pubKey is :", publicKey.toBase58())
    }
  }, [publicKey])

  if (!publicKey) {
    return (
      <div className="p-6">
        <p>Please connect your wallet to create a new DEPO.</p>
      </div>
    )
  }

  const depositData = {
    id: crypto.randomUUID(), // To change to an iterative add
    name,
    start_time: startTimeEnabled ? startTime : null,
    timelock: timelockEnabled ? timelock : null,
    minimum_amount: minimumAmountEnabled ? minimumAmount : null,
    target_amount: targetAmountEnabled ? targetAmount : null,
    walletPublicKey: publicKey.toBase58(),
  }

  const handleConfirm = () => {
    router.push('/confirm') // Route to page = src/app/escrow/confirm/page.tsx
    // TO DO : Set confirm page
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Create your new DEPO.</h1>

      <input
        placeholder="Deposit name #1"
        className="w-full px-3 py-2 border-2 border-black rounded-2xl bg-white text-black"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        placeholder="Description"
        className="w-full px-3 py-2 border-2 border-black rounded-2xl bg-white text-black"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <ToogleInputFieldDateTime
        label="Start Time"
        placeholder="Deposit start time"
        enabled={startTimeEnabled}
        setEnabled={setStartTimeEnabled}
        value={startTime}
        setValue={setStartTime}
      />

      <ToogleInputFieldDateTime
        label="Time Lock"
        placeholder="Time Lock"
        enabled={timelockEnabled}
        setEnabled={setTimelockEnabled}
        value={timelock}
        setValue={setTimelock}
      />

      <ToogleInputFieldNumber
        label="Minimum Amount"
        placeholder="Minimum Amount"
        enabled={minimumAmountEnabled}
        setEnabled={setMinimumAmountEnabled}
        value={minimumAmount}
        setValue={setMinimumAmount}
      />

      <ToogleInputFieldNumber
        label="Target Amount"
        placeholder="Target Amount"
        enabled={targetAmountEnabled}
        setEnabled={setTargetAmountEnabled}
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
        enabled={DepositorEnabled}
        setEnabled={setDepositorEnabled}
      />

      <ToogleInputLink
        question="Is there multiple recipients ?"
        linkLabel="List of recipient address"
        href="create/set_recipient_address"
        enabled={RecipientEnabled}
        setEnabled={setRecipientEnabled}
      />

      <button
        onClick={handleConfirm}
        className="px-6 py-3 border-2 border-black text-black bg-white rounded-lg hover:bg-gray-100 transition"
      >
        Confirm Deposit
      </button>
    </div>
  )
}
