'use client'

import { useRouter } from 'next/navigation'
import ToogleInputFieldNumber from '@/components/ui/inputs/ToogleInputFieldNumber'
import ToogleInputFieldDateTime from '@/components/ui/inputs/ToogleInputFieldDateTime'
import ConfirmEscrow from '@/components/confirmescrow/ConfirmEscrow'
import { useEscrow } from '@/contexts/useEscrowCtx'
import DynamicInputList from '@/components/ui/inputs/DynamicInputList'
import SmallButtonDanger from '@/components/ui/buttons/SmallButtonDanger'

export default function CreateEscrow() {
  const router = useRouter()

  const { 
    name, setName, 
    description, setDescription, 
    timelock, setTimelock, 
    minimumAmount, setMinimumAmount, 
    targetAmount, setTargetAmount, 
    recipients, setRecipients, 
    depositors, setDepositors 
  } = useEscrow()

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

          <div className="flex flex-row gap-2">
            <SmallButtonDanger
              onClick={() => {
                router.push('/escrow')
              }}
              disabled={false}
            >
              Cancel
            </SmallButtonDanger>
            <ConfirmEscrow
              name={name}
              description={description}
              timelock={timelock}
              minimumAmount={minimumAmount}
              targetAmount={targetAmount}
            />
          </div>
        </div>
        <div className="space-y-4">
          <DynamicInputList 
            label="Recipients"
            description="Add recipients keys to receive the funds. The funds will be split equally among the recipients."
            placeholder="Public Key"
            itemsPerPage={3}
            initialValues={recipients}
            onChange={(value) => setRecipients(value)}
          />
          <DynamicInputList 
            label="Depositors" 
            description="For private deposits, add the depositors keys of the funds"  
            placeholder="Public Key"
            itemsPerPage={3} 
            initialValues={depositors}
            onChange={(value) => setDepositors(value)}
          />
        </div>
      </div>
    </div>
  )
}