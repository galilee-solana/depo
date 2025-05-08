import React from 'react'
import { ExplorerLink } from '../cluster/cluster-ui'

export function TransactionToast({ signature }: { signature: string }) {
  return (
    <div className="text-center">
      <div className="text-lg">Transaction sent</div>
      <ExplorerLink
        path={`tx/${signature}`}
        label="View Transaction"
        className="btn btn-xs btn-primary"
      />
    </div>
  )
}
