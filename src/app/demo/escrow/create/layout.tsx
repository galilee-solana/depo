import { EscrowProvider } from '@/contexts/useEscrowCtx'

export const metadata = {
  title: 'Create your new DEPO',
  description: 'Create your new DEPO',
}

export default function CreateLayout({ children }: { children: React.ReactNode }) {
  return (
    <EscrowProvider>
      {children}
    </EscrowProvider>
  )
}