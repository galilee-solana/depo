import EscrowItemPage from "@/pages/EscrowItemPage";

export default function EscrowItem({ params }: { params: { id: string } }) {
  return (
    <EscrowItemPage uuid={params.id} />
  )
}