import EscrowItemPage from "@/pages/EscrowItemPage";

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EscrowItem(props: PageProps) {
  const params = await props.params;
  return (
    <EscrowItemPage uuid={params.id} />
  )
}