import Escrow from "@/utils/sdk/models/escrow"
import { useDepoClient } from "@/contexts/useDepoClientCtx"
import { useState } from "react"
import { toast } from "react-hot-toast"
import ToastWithLinks from "@/components/toasts/ToastWithLinks"

function useRecipientButtonSet(escrow: Escrow, refreshEscrow: () => void) {
  const { client, wallet, getExplorerUrl } = useDepoClient()
  const [isClaimingFunds, setIsClaimingFunds] = useState(false)

  const claimFunds = async () => {
    if (wallet?.connected && !isClaimingFunds) {
      try {
        setIsClaimingFunds(true)
        const tx = await client?.withdrawEscrow(escrow.uuid)
        toast.success(
          <ToastWithLinks
            message={`Withdrew funds from escrow: ${escrow.uuid}`}
            linkText="View transaction"
            url={getExplorerUrl(`tx/${tx}`)}
          />
        )
        refreshEscrow()
      } catch (error: any) {
        toast.error(`Error claiming funds: ${error.message}`)
      } finally {
        setIsClaimingFunds(false)
      }
    }
  }

  return {
    claimFunds,
    isClaimingFunds
  }
}

export default useRecipientButtonSet