'use client'

import { useState } from 'react'
import BaseInput from "../ui/inputs/BaseInput"
import { isValidDecimalNumber, solToBN, formatSol } from '@/utils/number-formatter'
import SmallButton from '../ui/buttons/SmallButton'

function DepositUI() {
    const [amount, setAmount] = useState('')
    const [id, setId] = useState('')

    const handleAmountChange = (value: string) => {
        if (isValidDecimalNumber(value)) {
            setAmount(value)
        }
    }

    const handleIdChange = (value: string) => {
        setId(value)
    }

    const handleDeposit = () => {
        // Convert to lamports when sending to blockchain
        const lamportsBN = solToBN(amount)
        
        // Your deposit logic here
        // client.depositEscrow(..., lamportsBN, ...)
    }

    return (
        <div className="mx-auto max-w-xl items-center align-center">
            <h1 className="text-2xl font-bold pb-4">Deposit your fund</h1>
            <div className="flex flex-col gap-2">
              Escrow ID: 
              <BaseInput 
                type="text"
                id="id"
                enabled={true}
                placeholder=""
                value={id}
                setValue={handleIdChange}
                inputMode="decimal"
              />
            </div>
            <div className="flex flex-col gap-2 pt-4">
              Amount: 
              <BaseInput 
                type="text"
                id="amount"
                enabled={true}
                placeholder="0.0"
                value={amount}
                setValue={handleAmountChange}
                inputMode="decimal"
              />
            </div>
            
            {amount && (
                <div className="mt-2 text-sm text-gray-600">
                    Amount: {formatSol(amount, 9)} SOL
                </div>
            )}
            <div className="flex justify-center w-full pt-4">
                <SmallButton
                    onClick={handleDeposit}
                    disabled={!amount && parseFloat(amount) <= 0 && !id}
                >
                    Deposit
                </SmallButton>
            </div>
        </div>
    )
}

export default DepositUI;