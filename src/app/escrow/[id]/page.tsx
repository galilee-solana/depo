import EscrowItemPage from "@/pages/EscrowItemPage";

interface PageProps {
  params: {
    id: string
  }
}

export default function EscrowItem({ params }: PageProps) {
  return (
    <EscrowItemPage uuid={params.id} />
  )
}