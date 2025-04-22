import SmallButtonDanger from "../ui/buttons/SmallButtonDanger"
import Escrow from "@/utils/sdk/models/escrow"
import SmallButton from "../ui/buttons/SmallButton"
import useCreatorButtonSet from "@/hooks/useCreatorButtonSet"

function CreatorButtonSet({ escrow, refreshEscrow }: { escrow: Escrow, refreshEscrow: () => void }) {
  const { deleteDraftEscrow, startEscrow, cancelEscrow, releaseEscrow } = useCreatorButtonSet(escrow, refreshEscrow)
  
  return (
    <>  
      {escrow.status === "draft" && (
        <>
          <SmallButtonDanger
            onClick={() => deleteDraftEscrow(escrow)}
            disabled={false}
      >
          Delete
        </SmallButtonDanger>
        <SmallButton
          onClick={() => startEscrow(escrow)}
          disabled={false}  
        >
            Start
          </SmallButton>
        </>
      )}  
      {escrow.status === "started" && (
        <>
          <SmallButtonDanger
            onClick={() => cancelEscrow(escrow)}
            disabled={false}
          >
            Cancel
          </SmallButtonDanger>
          <SmallButton
            onClick={() => releaseEscrow(escrow)}
            disabled={false}
          >
            Release
          </SmallButton>
        </>
      )}
    </>
  )
}

export default CreatorButtonSet