import SmallButton from "../ui/buttons/SmallButton"
import { useRouter } from "next/navigation"
import Escrow from "@/utils/sdk/models/escrow"

function DepositorButtonSet({ escrow, refreshEscrow }: { escrow: Escrow, refreshEscrow: () => void }) {
  const router = useRouter()
  
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
      {escrow.status === "cancelled" && (
        <SmallButton
          onClick={() => {console.log("claim refund")}}
          disabled={false}
        >
          Claim Refund
        </SmallButton>
      )}
    </>
  )
}

export default DepositorButtonSet