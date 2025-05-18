'use client'

import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

type ConfirmButtonProps = {
    name : string
    description : string
    timelockEnabled : boolean
    timelock : string
    minimumAmountEnabled : boolean
    minimumAmount : string
    targetAmountEnabled : boolean
    targetAmount : string
    walletPublicKey : string
}

export default function ConfirmEscrow({
    name,
    description,
    timelockEnabled,
    timelock,
    minimumAmountEnabled,
    minimumAmount,
    targetAmountEnabled,
    targetAmount,
    walletPublicKey,
}: ConfirmButtonProps) {
  const router = useRouter()

  const validateFields = () => {
    const errors: string[] = []

    // Check if name and description are not empty
    if(!name.trim()) errors.push("Name is required.")
    if(!description.trim()) errors.push("Description is required")

    // START TIME ACTIVATE WHEN READY
    //if (startTimeEnabled) {
    //  const now = new Date()
    //  const selectedStartTime = new Date(startTime)
    //  if (selectedStartTime <= now) {
    //    errors.push("Start time must be in the future.")
    //  }
    //}
    
    // Set minimum timelock -> 5min ahead : We can discuss about that.
    if (timelockEnabled) {
        const now = new Date()
        const lockTime = new Date(timelock)
        if (isNaN(lockTime.getTime()) || lockTime.getTime() < now.getTime() + 5 * 60 * 1000) {
            errors.push("Timelock must be at least 5 minutes in the future.")
        }
    }

    // If target_amount only -> must be > 0
    if (targetAmountEnabled) {
        const target = parseFloat(targetAmount)
        if (isNaN(target) || target <= 0) {
            errors.push("Target must be superior to 0.")
        }
    }

    // If both min & target active -> target > min
    if (minimumAmountEnabled && targetAmountEnabled) {
        const min = parseFloat(minimumAmount)
        const target = parseFloat(targetAmount)
        if (!isNaN(min) && !isNaN(target) && target <= min) {
            errors.push("Target amount must be greater than minimum amount.")
        }
    }

    return errors
  }

  const handleClick = () => {
    const errors = validateFields()
    if (errors.length > 0) {
        errors.forEach((e) => toast.error(e))
        return
    }
  

    const depositData = {
        id: crypto.randomUUID(),
        name,
        description,
        timelock: timelockEnabled ? timelock : null,
        minimumAmount: minimumAmountEnabled ? minimumAmount : null,
        target_amount: targetAmountEnabled ? targetAmount : null,
        walletPublicKey,
    }
  
    // I don't like this push but was just for testing front
    // Need to be changed this with secured component handling Sol transaction with POST
    // Need to set a component to write transaction using validateFields and pop-up window
    router.push(`/demo/escrow/confirm?data=${encodeURIComponent(JSON.stringify(depositData))}`)
}

return (
    <button
        onClick={handleClick}
        className="px-6 py-3 border-2 border-black text-black bg-white rounded-lg hover:bg-gray-100 transition"
    >
        Confirm DEPO
    </button>
  )
}