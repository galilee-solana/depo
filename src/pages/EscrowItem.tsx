'use client'

import { useDepoClient } from "@/contexts/useDepoClientCtx";
import Escrow from "@/utils/sdk/models/escrow";
import { useState, useEffect, useCallback } from "react";
import toast from 'react-hot-toast';
import ReadOnlyInput from "@/components/ui/inputs/ReadOnlyInput";
import CreatorButtonSet from "@/components/escrow_item/CreatorButtonSet";
import DepositorButtonSet from "@/components/escrow_item/DepositorButtonSet";
import RecipientButtonSet from "@/components/escrow_item/RecipientButtonSet";
import DynamicComponentList from "@/components/ui/lists/DynamicComponentList";
import { formatTimestamp } from "@/utils/timestamp-formatter";
import { lamportsToSol } from "@/utils/number-formatter";

/**
 * A page that displays an escrow item.
 * @param uuid - The UUID of the escrow.
 * @returns A page that displays an escrow item.
 */
function EscrowItem({ uuid }: { uuid: string }) {
    const { getEscrow, wallet } = useDepoClient()
    const [escrow, setEscrow] = useState<Escrow | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isDepositor, setIsDepositor] = useState(false)
    const [isCreator, setIsCreator] = useState(false)
    const [isRecipient, setIsRecipient] = useState(false)
    const [depositorAccount, setDepositorAccount] = useState<{}>({})
    const [recipientAccount, setRecipientAccount] = useState<{}>({})

    const [refreshTrigger, setRefreshTrigger] = useState(0)
    
    const refreshEscrow = useCallback(() => {
      setRefreshTrigger(prev => prev + 1)
    }, [])

    
    useEffect(() => {
        let isMounted = true
        const fetchEscrow = async () => {
            try {
                setIsLoading(true)
                setError(null)
                const result = await getEscrow(uuid)
                
                if (!isMounted) return
                
                if (result) {
                    setEscrow(result)

                    if (wallet?.publicKey && result.initializer.equals(wallet.publicKey)) {
                        setIsCreator(true)
                    }

                    if (result.isPublicDeposit || (
                        wallet?.publicKey && 
                        Array.isArray(result.depositors) && 
                        result.depositors.some(d => wallet.publicKey?.equals(d.account?.wallet))
                    )) {
                        setIsDepositor(true)
                        
                        if (wallet?.publicKey && Array.isArray(result.depositors)) {
                            const depositorAccount = result.depositors.find(d => 
                                d.account?.wallet && wallet.publicKey?.equals(d.account.wallet)
                            )
                            if (depositorAccount) {
                                setDepositorAccount(depositorAccount)
                            }
                        }
                    }

                    if (wallet?.publicKey && 
                        Array.isArray(result.recipients) && 
                        result.recipients.some(rec => wallet.publicKey?.equals(rec.account?.wallet))
                    ) {
                        setIsRecipient(true)
                        const recipientAccount   = result.recipients.find(rec =>
                            rec.account?.wallet && wallet.publicKey?.equals(rec.account.wallet)
                        )
                        if (recipientAccount) {
                            setRecipientAccount(recipientAccount)
                        }
                    }   
                } else {
                    setError(`Escrow with ID ${uuid} not found`)
                    toast.error(`ID: ${uuid} not found`)
                }
            } catch (err) {
                if (isMounted) {
                    setError('Failed to load escrow')
                    toast.error('Failed to load escrow')
                }
            } finally {
                if (isMounted) setIsLoading(false)
            }
        }

        fetchEscrow()
        return () => {
            isMounted = false
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getEscrow, uuid, refreshTrigger])

    const addressTagStyle = "text-md bg-white p-2 rounded-lg border border-gray-200 flex flex-row gap-2 w-full justify-between"

    const renderRecipients = () => {
        if (!escrow?.recipients) return [];
        return escrow.recipients.map((recipient, index) => {
            const percentage = recipient.account?.percentage ? `${recipient.account?.percentage/100}` : ""
            return (
                <div key={index + "recipient"} className={addressTagStyle}>
                    <span className="flex flex-row gap-2">
                        <p>{recipient.account?.wallet?.toString()}</p>
                        {recipient.account?.hasWithdrawn && <p className="text-xs bg-green-500 text-white font-bold px-2 py-1 rounded-md">Withdrawn</p>}
                    </span>
                    {percentage && <p>Receive: {percentage}%</p>}
                </div>
            )
        })
    }

    const renderDepositors = () => {
        if (!escrow?.depositors) return [<p key="no-depositors">No depositors</p>];
        return escrow.depositors.map((depositor, index) => {
            return (
                <div key={index + "depositor"} className={addressTagStyle}>
                    <span className="flex flex-row gap-2">
                        <p>{depositor.account?.wallet?.toString()}</p>
                        {depositor.account?.wasRefunded && <p className="text-xs bg-red-500 text-white font-bold px-2 py-1 rounded-md">Refunded</p>}
                    </span>
                    <p className="text-green-500 font-bold">+ {lamportsToSol(depositor.account?.depositedAmount)} SOL</p>
                </div>
            )
        })
    }

    const renderModules = () => {
        if (!escrow?.modules) return [];
        
        return escrow.modules.map((module, index) => {
            const moduleType = Object.keys(module.moduleType)[0];
            if (moduleType === "timelock" && escrow.timelock?.account) {
                return <p key={index}>Release after: {formatTimestamp(escrow.timelock.account.releaseAfter)}</p>
            }
            if (moduleType === "minimumAmount" && escrow.minimumAmount?.account) {
                return <p key={index}>Minimum amount: {lamportsToSol(escrow.minimumAmount.account.minAmount)} SOL</p>
            }
            if (moduleType === "targetAmount" && escrow.targetAmount?.account) {
                return <p key={index}>Target amount: {lamportsToSol(escrow.targetAmount.account.targetAmount)} SOL</p>
            }
            return <p key={index}>Module: {moduleType}</p>;
        })
    }

    return (
        <div>
            <div className="flex flex-row gap-2">
                <h1 className="text-2xl font-bold">Escrow #{escrow?.uuid}</h1>
            </div>
        
            {isLoading && <p>Loading escrow data...</p>}
            
            {error && <p className="text-red-500">{error}</p>}
            
            {!isLoading && escrow && (
                <>
                  <div className="grid grid-cols-2 gap-4 space-y-2">
                    <div className="space-y-3 pt-4"> 
                        <div className="flex flex-row gap-2 mb-6">
                            <p className="text-md font-bold p-2 px-4 w-fit rounded-md border-b-2 border-gray-200 bg-black text-white">
                                {escrow.isPublicDeposit ? "Public Escrow" : "Private Escrow"} - {escrow.status[0].toUpperCase() + escrow.status.slice(1)} 
                            </p>
                            <p className="text-md font-bold p-2 px-4 rounded-md border-2 border-black bg-gray-200">
                                Total Amount: {escrow.depositedAmount} SOL
                            </p>
                        </div>
                      <ReadOnlyInput
                        label="Name"
                        id="name"
                        value={escrow.name}
                      />
                      <ReadOnlyInput
                        label="Description"
                        id="description"
                        value={escrow.description}
                      />
                      {escrow.modules.length > 0 && (
                        <div className="py-4 space-y-2">
                          <h2 className="text-lg font-bold">Release conditions:</h2>
                          {renderModules()} 
                        </div>
                      )}

                      <div className="flex flex-row gap-2">
                        {isCreator && (
                          <CreatorButtonSet escrow={escrow} refreshEscrow={refreshEscrow} />
                        )}
                        {isDepositor && (
                          <DepositorButtonSet escrow={escrow} depositor={depositorAccount} refreshEscrow={refreshEscrow} />
                        )}
                        {isRecipient && (
                          <RecipientButtonSet escrow={escrow} recipient={recipientAccount} refreshEscrow={refreshEscrow} />
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                        <DynamicComponentList
                            label="Recipients"
                            description="List of recipients who can withdraw funds from this escrow"
                            itemsPerPage={3}
                            toRender={renderRecipients()}
                        />
                        {escrow.depositors.length > 0 ? (
                            <DynamicComponentList 
                              label="Depositors" 
                              description="List of depositors who deposited funds into this escrow"  
                              itemsPerPage={3} 
                              toRender={renderDepositors()}
                            />
                        ) : (
                            <p className="px-6">No depositors yet</p>
                        )}
                    </div>
                  </div>
                </>
            )}
        </div>
    )
}

export default EscrowItem;