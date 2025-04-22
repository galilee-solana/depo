
import SmallButton from "../ui/buttons/SmallButton"
import Escrow from "@/utils/sdk/models/escrow"
import useRecipientButtonSet from "@/hooks/useRecipientButtonSet"

function RecipientButtonSet({ escrow, recipient, refreshEscrow }: { escrow: Escrow, recipient: any, refreshEscrow: () => void }) {
  const { claimFunds, isClaimingFunds } = useRecipientButtonSet(escrow, refreshEscrow)

  return (
    <>  
      {escrow.status === "released" && !recipient.account.hasWithdrawn && (
        <>
          <SmallButton
            onClick={() => claimFunds()}
            disabled={isClaimingFunds}
          >
            Claim your funds
          </SmallButton>  
        </>
      )}
    </>
  )
}

export default RecipientButtonSet