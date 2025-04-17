'use client'

import { useDepoClient } from "@/contexts/useDepoClientCtx";
import Escrow from "@/utils/models/escrow";
import { useState, useEffect } from "react";

function EscrowItemPage({ uuid }: { uuid: string }) {
    const { getEscrow } = useDepoClient()
    const [escrow, setEscrow] = useState<Escrow | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

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
                } else {
                    setError(`Escrow with ID ${uuid} not found`)
                }
            } catch (err) {
                if (isMounted) setError('Failed to load escrow')
            } finally {
                if (isMounted) setIsLoading(false)
            }
        }
    
        fetchEscrow()
    
        return () => {
            isMounted = false
        }
    }, [getEscrow, uuid])

return (
        <div>
            <h1 className="text-2xl font-bold">Escrow #{escrow?.uuid}</h1>
            {isLoading && <p>Loading escrow data...</p>}
            
            {error && <p className="text-red-500">{error}</p>}
            
            {!isLoading && escrow && (
                <div>
                    <h2>Name: {escrow.name}</h2>
                    <p>Description: {escrow.description}</p>
                    <p>Deposited Amount: {escrow.depositedAmount.toString()}</p>
                    <p>Withdrawn Amount: {escrow.withdrawnAmount.toString()}</p>
                    <p>Remaining Percentage: {escrow.remainingPercentage / 100} %</p>
                    <p>Status: {escrow.status}</p>
                    <p>Is Public Deposit: {escrow.isPublicDeposit ? "Yes" : "No"}</p>
                    <p>Depositors Count: {escrow.depositorsCount}</p>
                    <p>Recipients Count: {escrow.recipientsCount}</p>
                    <p>Modules: {
                        escrow.modules.length > 0 ?
                        escrow.modules.map(module => module.name).join(", ") :
                        "No modules"
                    }</p>
                    <p>Initializer: {escrow.initializer.toString()}</p>
                    <p>Created At: {escrow.createdAtFormatted}</p>
                </div>
            )}
        </div>
    )
}

export default EscrowItemPage;