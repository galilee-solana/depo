'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CreateEscrow() {
  const { publicKey } = useWallet()
  const router = useRouter()

  const [name, setName] = useState('')
  const [startTimeEnabled, setStartTimeEnabled] = useState(false)
  const [startTime, setStartTime] = useState('')
  const [timelockEnabled, setTimelockEnabled] = useState(false)
  const [timelock, setTimelock] = useState('')
  const [minimumAmountEnabled, setMinimumAmountEnabled] = useState(false)
  const [minimumAmount, setMinimumAmount] = useState('')
  const [targetAmountEnabled, setTargetAmountEnabled] = useState(false)
  const [targetAmount, setTargetAmount] = useState('')
  const [description, setDescription] = useState('')
  const [singleApproval, setSingleApproval] = useState(false)
  const [multisigApproval, setMultisigApproval] = useState('')

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
    description,
    single_approval: singleApproval,
    multisig_approval: multisigApproval,
    walletPublicKey: publicKey.toBase58(),
  }

  const handleConfirm = () => {
    router.push('/confirm') // Route to page = src/app/escrow/confirm/page.tsx
    // TO DO : Set confirm page
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Create new Escrow</h1>
      <p>Your pubKey is : {publicKey.toBase58()}</p>

      <input
        placeholder="Deposit name #1"
        className="w-full border px-3 py-2 rounded"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={startTimeEnabled}
          onChange={() => setStartTimeEnabled(!startTimeEnabled)}
        />
        <span>Enable Start Time</span>
      </label>
      {startTimeEnabled && (
        <input
          placeholder="Start Time"
          className="w-full border px-3 py-2 rounded"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
      )}

      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={timelockEnabled}
          onChange={() => setTimelockEnabled(!timelockEnabled)}
        />
        <span>Enable Timelock</span>
      </label>
      {timelockEnabled && (
        <input
          placeholder="Timelock"
          className="w-full border px-3 py-2 rounded"
          value={timelock}
          onChange={(e) => setTimelock(e.target.value)}
        />
      )}

      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={minimumAmountEnabled}
          onChange={() => setMinimumAmountEnabled(!minimumAmountEnabled)}
        />
        <span>Enable Minimum Amount</span>
      </label>
      {minimumAmountEnabled && (
        <input
          placeholder="Minimum Amount"
          className="w-full border px-3 py-2 rounded"
          value={minimumAmount}
          onChange={(e) => setMinimumAmount(e.target.value)}
        />
      )}

      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={targetAmountEnabled}
          onChange={() => setTargetAmountEnabled(!targetAmountEnabled)}
        />
        <span>Enable Target Amount</span>
      </label>
      {targetAmountEnabled && (
        <input
          placeholder="Target Amount"
          className="w-full border px-3 py-2 rounded"
          value={targetAmount}
          onChange={(e) => setTargetAmount(e.target.value)}
        />
      )}

      <button
        onClick={() => setDescription('Add a description message')}
        className="text-left text-black flex items-center space-x-2"
      >
        <span>➕</span>
        <span>Add a description message</span>
      </button>

      <button
        onClick={() => setSingleApproval(!singleApproval)}
        className="text-left text-black flex items-center space-x-2"
      >
        <span>➕</span>
        <span>Set manual approval</span>
      </button>

      <button
        onClick={() => setMultisigApproval('Add multisig address')}
        className="text-left text-black flex items-center space-x-2"
      >
        <span>➕</span>
        <span>Add multisig address</span>
      </button>

      <button
        onClick={handleConfirm}
        className="px-6 py-3 border-2 border-black text-black bg-white rounded-lg hover:bg-gray-100 transition"
      >
        Confirm Deposit
      </button>
    </div>
  )
}
