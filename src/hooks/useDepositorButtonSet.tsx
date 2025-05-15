import { useDepoClient } from "@/contexts/useDepoClientCtx"
import { useState } from "react"
import toast from "react-hot-toast"
import ToastWithLinks from "@/components/toasts/ToastWithLinks"
import Escrow from "@/utils/sdk/models/escrow"

function useCreatorButtonSet(escrow: Escrow, refreshEscrow: () => void) {
  const { client, wallet, getExplorerUrl } = useDepoClient()
  const [isClaimingRefund, setIsClaimingRefund] = useState(false)

  const claimRefund = async () => {
    if (wallet?.connected && !isClaimingRefund) {
      try {
        setIsClaimingRefund(true)
        const tx = await client?.claimRefund(escrow.uuid)
        toast.success(
            <ToastWithLinks
                message={`Successfully claimed refund for escrow: ${escrow.uuid}`}
                linkText="View transaction"
                url={getExplorerUrl(`tx/${tx}`)}
            />
        )
        refreshEscrow()
      } catch (error: any) {
        console.error(error)
      } finally {
        setIsClaimingRefund(false)
      }
    }
  }


  return {
    isClaimingRefund,
    claimRefund
  }
}

export default useCreatorButtonSet