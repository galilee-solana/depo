import SmallButtonDanger from "../ui/buttons/SmallButtonDanger"
import {useDepoClient} from "@/contexts/useDepoClientCtx"
import { useCluster } from "@/components/cluster/cluster-data-access"
import { useRouter } from "next/navigation"
import { useState } from "react"
import toast from "react-hot-toast"
import ToastWithLinks from "../toasts/ToastWithLinks"
import Escrow from "@/utils/sdk/models/escrow"
import SmallButton from "../ui/buttons/SmallButton"

function CreatorButtonSet({ escrow, refreshEscrow }: { escrow: Escrow, refreshEscrow: () => void }) {
  const { client, wallet } = useDepoClient()
  const [isDeleting, setIsDeleting] = useState(false)
  const [isStarting, setIsStarting] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)
  const { getExplorerUrl } = useCluster()
  const router = useRouter()

  const deleteDraftEscrow = async (escrow: Escrow) => {
    if (  wallet?.connected && !isDeleting) {
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
        refreshEscrow()
      } catch (error: any) {
        toast.error(`Error starting escrow: ${error.message}`)
      } finally {
        setIsStarting(false)
      }
    }
  }

  const cancelEscrow = async (escrow: Escrow) => {
    if (wallet?.connected && !isCancelling) {
      try {
        setIsCancelling(true)
        const tx = await client?.cancelEscrow(escrow.uuid)
        toast.success(
          <ToastWithLinks
            message={`Escrow cancelled: ${escrow.uuid}`}
            linkText="View transaction"
            url={getExplorerUrl(`tx/${tx}`)}
          />
        )
        refreshEscrow()
      } catch (error: any) {
        toast.error(`Error cancelling escrow: ${error.message}`)
      } finally {
        setIsCancelling(false)
      }
    }
  } 
  

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
            onClick={() => {console.log("release")}}
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