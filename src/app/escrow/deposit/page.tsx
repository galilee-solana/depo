import DepositUI from "@/components/deposit/deposit-ui"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Deposit to Escrow',
  description: 'Deposit funds to an escrow',
}

interface DepositPageProps {
  params: {}
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function DepositPage({ searchParams }: DepositPageProps) {
  const searchParamsData = await Promise.resolve(searchParams);
  const id = typeof searchParamsData.id === 'string' ? searchParamsData.id : "";
  
  return (
    <DepositUI uuid={id} />
  )
}