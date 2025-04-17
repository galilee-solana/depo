import EscrowItem from "@/pages/EscrowItem";

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EscrowItemPage(props: PageProps) {
  const params = await props.params;
  return (
    <EscrowItem uuid={params.id} />
  )
}