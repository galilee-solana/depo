'use client'

import { useDepoClient } from "@/contexts/useDepoClientCtx";
import Escrow from "@/utils/sdk/models/escrow";
import { useState, useEffect } from "react";
import toast from 'react-hot-toast';
import { useRouter } from "next/navigation";
import ToastWithLinks from "@/components/toasts/ToastWithLinks";
import { useCluster } from "@/components/cluster/cluster-data-access";
import SmallButton from "@/components/ui/buttons/SmallButton";
import SmallButtonDanger from "@/components/ui/buttons/SmallButtonDanger";
/**
 * A page that displays an escrow item.
 * @param uuid - The UUID of the escrow.
 * @returns A page that displays an escrow item.
 */
function EscrowItem({ uuid }: { uuid: string }) {
    const router = useRouter()
    const { getEscrow, client, wallet } = useDepoClient()
    const [escrow, setEscrow] = useState<Escrow | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)
    const [isStarting, setIsStarting] = useState(false)
    const { getExplorerUrl } = useCluster()

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
    }, [getEscrow, uuid])


    const deleteEscrow = async (escrow: Escrow) => {
        if (wallet?.connected && !isDeleting) {
            try {
                setIsDeleting(true)

                const tx = await client?.deleteDraftEscrow(escrow.uuid)
                
                toast.success(
                    <ToastWithLinks
                        message={`Escrow deleted: ${escrow.uuid}`}
                        linkText="View transaction"
                        url={getExplorerUrl(`tx/${tx}`)}
                    />
                )
                router.push('/escrow')
            } catch (error: any) {
                const errorMessage = error.message || JSON.stringify(error)
                if (errorMessage.includes("doesn't exist")) {
                    toast.success("Escrow already deleted")
                    router.push('/escrow')
                } else if (errorMessage.includes("EscrowNotDraft")) {
                    toast.error("Cannot delete: Escrow is not in draft status")
                } else if (errorMessage.includes("DepositorsExist")) {
                    toast.error("Cannot delete: Escrow has depositors")
                } else if (errorMessage.includes("RecipientsExist")) {
                    toast.error("Cannot delete: Escrow has recipients")
                } else if (errorMessage.includes("ModulesExist")) {
                    toast.error("Cannot delete: Escrow has modules")
                } else {
                    toast.error(`Error deleting escrow: ${errorMessage}`)
                }
            } finally {
                setIsDeleting(false)
            }
        }
    }

    const startEscrow = async (escrow: Escrow) => {
        if (wallet?.connected && !isStarting) {
            try {
                setIsStarting(true)
                const tx = await client?.startEscrow(escrow.uuid)
                toast.success(
                    <ToastWithLinks
                        message={`Escrow started: ${escrow.uuid}`}
                        linkText="View transaction"
                        url={getExplorerUrl(`tx/${tx}`)}
                    />
                )
            } catch (error: any) {
                toast.error(`Error starting escrow: ${error.message}`)
            } finally {
                setIsStarting(false)
            }
        }

    }

    return (
        <div>
            <h1 className="text-2xl font-bold">Escrow #{escrow?.uuid}</h1>
            {isLoading && <p>Loading escrow data...</p>}
            
            {error && <p className="text-red-500">{error}</p>}
            
            {!isLoading && escrow && (
                <>
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
                            escrow.modules.map(module => {
                                const moduleTypeName = Object.keys(module.moduleType)[0];
                                return moduleTypeName
                            }).join(", ") :
                            "No modules"
                        }</p>
                        <p>Initializer: {escrow.initializer.toString()}</p>
                        <p>Created At: {escrow.createdAtFormatted}</p>
                    </div>
                    <div className="flex gap-2 pt-4">
                        <SmallButtonDanger
                            onClick={() => deleteEscrow(escrow)}
                            disabled={isDeleting}
                        >
                            {isDeleting ? 'Deleting...' : 'Cancel'}
                        </SmallButtonDanger>
                        {escrow.status === "draft" && (
                            <SmallButton
                                onClick={() => startEscrow(escrow)}
                                disabled={isStarting}
                            >
                                {isStarting ? 'Starting...' : 'Start'}
                            </SmallButton>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}

export default EscrowItem;