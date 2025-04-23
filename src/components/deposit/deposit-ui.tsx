'use client'

import { useState, useEffect, KeyboardEvent, useCallback } from 'react'
import BaseInput from "../ui/inputs/BaseInput"
import { isValidDecimalNumber, solToBN, formatSol } from '@/utils/number-formatter'
import SmallButton from '../ui/buttons/SmallButton'
import SmallButtonDanger from '../ui/buttons/SmallButtonDanger'
import { useDepoClient } from '@/contexts/useDepoClientCtx'
import Escrow from '@/utils/sdk/models/escrow'
import EscrowDetailCard from './escrow_detail_card'
import { toast } from 'react-hot-toast'
import ToastWithLinks from '../toasts/ToastWithLinks'
import { useRouter } from 'next/navigation'

function DepositUI({ uuid = "" }: { uuid: string }) {
    const router = useRouter()
    const { client, wallet, getExplorerUrl } = useDepoClient()
    const [amount, setAmount] = useState('')
    const [id, setId] = useState<string>(uuid)
    const [escrow, setEscrow] = useState<Escrow | null>(null)
    const [isLoading, setIsLoading] = useState(false)

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

    const handleDeposit = async () => {
        if (!amount) return;
        if (!client) return;
        
        try {
            const lamportsBN = solToBN(amount)
            if (!lamportsBN) {
                toast.error("Invalid amount")
                return;
            }

            const tx = await client.depositEscrow(id, lamportsBN)
            toast.success(
                <ToastWithLinks 
                    message={`Successfully deposited ${amount} SOL`}
                    linkText="View transaction"
                    url={getExplorerUrl(`/tx/${tx}`)}
                />
            )
            router.push(`/escrow/${id}`)
        } catch (error: any) {
            toast.error("Failed to deposit: " + error.message)
            console.error(error)
        }
    }

    const handleFetchEscrow = useCallback(async () => {
        if (!client || !id) return;
        try {
            setIsLoading(true);
            const escrow = await client.getEscrow(id);
            setEscrow(escrow);
            if (!escrow) {
                toast.error(`Escrow with ID ${id} not found`);
            }
        } catch (error: any) {
            toast.error("Failed to load escrow: " + error.message);
        } finally {
            setIsLoading(false);
        }
    }, [client, id]);

    useEffect(() => {
        if (uuid && !escrow && client) {
            handleFetchEscrow();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [uuid, client]);

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && id && !escrow && !isLoading) {
            handleFetchEscrow();
        }
    };

    const isAuthorizedToDeposit = () => {
        if (!escrow) return false;

        const isStarted = escrow?.isStarted()
        const isPublicDeposit = escrow?.isPublicDeposit
        console.log(escrow.depositors)
        const isDepositor = 
            wallet?.publicKey?.toBase58() 
            && escrow.depositors.some(depositor => 
                depositor.account?.wallet?.toBase58() === wallet?.publicKey?.toBase58()
            )
        
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
                  enabled={!isLoading}
                  placeholder=""
                  value={id}
                  setValue={handleIdChange}
                  inputMode="decimal"
                  onKeyDown={handleKeyDown}
                />
                {!escrow && (
                    <SmallButton
                        onClick={handleFetchEscrow}
                        disabled={!id || isLoading}
                    >
                        {isLoading ? 'Loading...' : 'Search'}
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