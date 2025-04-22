'use client'

import { useState } from 'react'
import BaseInput from "../ui/inputs/BaseInput"
import { isValidDecimalNumber, solToBN, formatSol } from '@/utils/number-formatter'
import SmallButton from '../ui/buttons/SmallButton'
import SmallButtonDanger from '../ui/buttons/SmallButtonDanger'
import { useDepoClient } from '@/contexts/useDepoClientCtx'
import Escrow from '@/utils/sdk/models/escrow'
import EscrowDetailCard from './escrow_detail_card'

function DepositUI() {
    const { client, wallet } = useDepoClient()
    const [amount, setAmount] = useState('')
    const [id, setId] = useState('')
    const [escrow, setEscrow] = useState<Escrow | null>(null)

    const handleAmountChange = (value: string) => {
        if (isValidDecimalNumber(value)) {
            setAmount(value)
        }
    }

    const handleIdChange = (value: string) => {
        setId(value)
    }

    const handleClear = () => {
        setEscrow(null)
        setAmount('')
        setId('')
    }

    const handleDeposit = () => {
        // Convert to lamports when sending to blockchain
        const lamportsBN = solToBN(amount)

        console.log("Deposit")
        console.log(lamportsBN)
        
        // Your deposit logic here
        // client.depositEscrow(..., lamportsBN, ...)
    }

    const handleFetchEscrow = async () => {
        if (!client) return;
        const escrow = await client.getEscrow(id)
        setEscrow(escrow)
    }

    const isAuthorizedToDeposit = () => {
        if (!escrow) return false;

        const isStarted = escrow?.isStarted()
        const isPublicDeposit = escrow?.isPublicDeposit
        const isDepositor = 
            wallet?.publicKey?.toBase58() 
            && escrow.depositors.includes(wallet?.publicKey?.toBase58() || '')
        
        if (isStarted && isPublicDeposit) return true;
        if (isStarted && isDepositor) return true;

        return false;
    }

    return (
        <div className="mx-auto max-w-xl items-center align-center">
            <h1 className="text-2xl font-bold pb-4">Deposit your fund</h1>
            <div className="flex flex-col gap-2">
              Escrow ID: 
              <div className="flex flex-row gap-2">
                <BaseInput 
                  type="text"
                  id="id"
                  enabled={true}
                  placeholder=""
                  value={id}
                  setValue={handleIdChange}
                  inputMode="decimal"
                />
                {!escrow && (
                    <SmallButton
                        onClick={handleFetchEscrow}
                        disabled={!id}
                    >
                        Search
                    </SmallButton>
                )}
                {escrow && (
                    <SmallButtonDanger
                        onClick={handleClear}
                        disabled={false}
                    >
                        Clear
                    </SmallButtonDanger>
                )}
        
              </div>
            </div>
            {escrow && (
                <>
                    <EscrowDetailCard escrow={escrow} isAuthorized={isAuthorizedToDeposit()} />
                    {isAuthorizedToDeposit() && (
                        <>
                            <div className="flex flex-col gap-2 pt-4">
                                Amount: 
                                <BaseInput 
                                    type="text"
                                    id="amount"
                                    enabled={isAuthorizedToDeposit()}
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
                        </>
                    )}
                </>
            )}
        </div>
    )
}

export default DepositUI;