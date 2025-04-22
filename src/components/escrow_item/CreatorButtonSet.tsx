import SmallButtonDanger from "../ui/buttons/SmallButtonDanger"
import {useDepoClient} from "@/contexts/useDepoClientCtx"
import { useCluster } from "@/components/cluster/cluster-data-access"
import { useRouter } from "next/navigation"
import { useState } from "react"
import toast from "react-hot-toast"
import ToastWithLinks from "../toasts/ToastWithLinks"
import Escrow from "@/utils/sdk/models/escrow"

function CreatorButtonSet({ escrow }: { escrow: Escrow }) {
  const { client, wallet } = useDepoClient()
  const [isDeleting, setIsDeleting] = useState(false)
  const { getExplorerUrl } = useCluster()
  const router = useRouter()

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
  return (
    <>  
      <SmallButtonDanger
        onClick={() => deleteEscrow(escrow)}
        disabled={false}
      >
        Delete
      </SmallButtonDanger>
    </>
  )
}

export default CreatorButtonSet