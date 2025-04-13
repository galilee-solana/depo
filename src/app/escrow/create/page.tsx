'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ToogleInputFieldNumber from '@/components/create/ToogleInputFieldNumber'
import ToogleInputFieldDateTime from '@/components/create/ToogleInputFieldDateTime'

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
      <h1 className="text-2xl font-bold">Create your new DEPO.</h1>

      <input
        placeholder="Deposit name #1"
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
        onClick={() => router.push('/escrow/create/add_description')}
        className="text-left text-black flex items-center space-x-2"
      >
        <span>➕</span>
        <span>Add a description message</span>
      </button>

      <button
        onClick={() => router.push('/escrow/create/add_single_approval')}
        className="text-left text-black flex items-center space-x-2"
      >
        <span>➕</span>
        <span>Set manual approval</span>
      </button>

      <button
        onClick={() => router.push('/escrow/create/add_multisig_approval')}
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
