import SmallButton from "../ui/buttons/SmallButton"
import { useRouter } from "next/navigation"
import Escrow from "@/utils/sdk/models/escrow"
import useDepositorButtonSet from "@/hooks/useDepositorButtonSet"

function DepositorButtonSet({ escrow, depositor, refreshEscrow }: { escrow: Escrow, depositor: any, refreshEscrow: () => void }) {
  const router = useRouter()
  const { claimRefund, isClaimingRefund } = useDepositorButtonSet(escrow, refreshEscrow)
  
  return (
    <>  
      {escrow.status === "started" && (
        <>
          <SmallButton
            onClick={() => router.push(`/escrow/deposit?id=${escrow.uuid}`)}
            disabled={false}
          >
            Deposit
          </SmallButton>
        </>
      )}
      {escrow.status === "cancelled" && !depositor && !depositor.account.wasRefunded && (
        <SmallButton
          onClick={() => claimRefund()}
          disabled={isClaimingRefund}
        >
          Claim Refund
        </SmallButton>
      )}
    </>
  )
}

export default DepositorButtonSet