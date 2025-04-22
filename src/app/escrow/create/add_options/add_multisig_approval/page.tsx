'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import ToogleInputFieldSolAddress from '@/components/ui/inputs/ToogleInputFieldSolAddress';

export default function Add_multisig_approval() {
    const router = useRouter();
    const [Multiple_1_ApprovalEnabled, setMultiple_1_ApprovalEnabled] = useState(false)
    const [Multiple_1_SolAddress, setMultiple_1_ApprovalSolAddress] = useState('')

    return(
        <div className="p-6 space-y-4">
            <h1 className="text-2xl font-bold">Set your Multisig approval.</h1>
            <h2>Add the multiple wallet addresses set for approval.</h2>
            <ToogleInputFieldSolAddress
                label="Wallet_1_approval_address"
                placeholder="Wallet #1 Approval Address"
                enabled={Multiple_1_ApprovalEnabled}
                setEnabled={setMultiple_1_ApprovalEnabled}
                value={Multiple_1_SolAddress}
                setValue={setMultiple_1_ApprovalSolAddress}
            />
        </div>
    );
}