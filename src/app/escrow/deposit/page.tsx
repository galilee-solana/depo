import DepositUI from "@/components/deposit/deposit-ui"

export default async function DepositPage({ searchParams }: { searchParams: { id?: string } }) {
  const id = searchParams.id || ""
  return (
    <DepositUI uuid={id} />
  )
}