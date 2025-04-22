'use client'

import { useDepoClient } from "@/contexts/useDepoClientCtx";
import Escrow from "@/utils/sdk/models/escrow";
import { useState, useEffect, useCallback } from "react";
import toast from 'react-hot-toast';
import { useRouter } from "next/navigation";
import ToastWithLinks from "@/components/toasts/ToastWithLinks";
import { useCluster } from "@/components/cluster/cluster-data-access";
import ReadOnlyInput from "@/components/ui/inputs/ReadOnlyInput";
import CreatorButtonSet from "@/components/escrow_item/CreatorButtonSet";
import DepositorButtonSet from "@/components/escrow_item/DepositorButtonSet";

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
                    if (result.isPublicDeposit || (wallet?.publicKey && result.depositors.includes(wallet.publicKey))) {
                        setIsDepositor(true)
                    }
                    if (wallet?.publicKey && result.recipients.includes(wallet.publicKey)) {
                        setIsRecipient(true)
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
    }, [getEscrow, uuid, refreshTrigger])

    return (
        <div>
            <h1 className="text-2xl font-bold">Escrow #{escrow?.uuid}</h1>
            {isLoading && <p>Loading escrow data...</p>}
            
            {error && <p className="text-red-500">{error}</p>}
            
            {!isLoading && escrow && (
                <>
                  <div className="grid grid-cols-2 gap-4 space-y-2">
                    <div className="space-y-2 pt-4"> 
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
                        {escrow.modules.map((module) => (
                          <div key={module.id}>
                            <p>{module.moduleType.toString()}</p>
                          </div>
                        ))}
                        </div>
                      )}

                      <div className="flex flex-row gap-2">
                        {isCreator && (
                          <CreatorButtonSet escrow={escrow} refreshEscrow={refreshEscrow} />
                        )}
                        {isDepositor && (
                          <DepositorButtonSet escrow={escrow} refreshEscrow={refreshEscrow} />
                        )}
                      </div>
                    </div>
                    <div className="space-y-2"> 
                        <p>Status: {escrow.status}</p>
                        <p>Is Public Deposit: {escrow.isPublicDeposit ? "Yes" : "No"}</p>
                        <p>Depositors Count: {escrow.depositorsCount}</p>
                        <p>Recipients Count: {escrow.recipientsCount}</p>
                    </div>
                  </div>
                </>
            )}
        </div>
    )
}

export default EscrowItem;