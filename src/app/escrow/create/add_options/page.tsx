'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import ToogleInputFieldSolAddress from '@/components/ui/inputs/ToogleInputFieldSolAddress';
import ToogleInputLink from '@/components/ui/inputs/ToogleInputLink'



export default function Add_options() {
    const router = useRouter();

    const [description, setDescription] = useState('')
    const [SingleApprovalEnabled, setSingleApprovalEnabled] = useState(false)
    const [SingleApprovalSolAddress, setSingleApprovalSolAddress] = useState('')
    const [MultisigEnabled, setMultisigEnabled] = useState(false)

    return(
        <div className="p-6 space-y-4">
            <h1 className="text-2xl font-bold">Add options to your DEPO.</h1>
            <h2>Add a description of your DEPO that your depositors will see.</h2>
            <input
                placeholder="Description"
                className="w-full px-3 py-2 border-2 border-black rounded-2xl bg-white text-black"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <div>{"///"}</div>
            <h2>Add a single address for approval of your DEPO.</h2>
            <h2>If not selected : the actual public address will be used by default.</h2>
            <ToogleInputFieldSolAddress
            label="Single_approval_address"
            placeholder="Single Approval Address"
            enabled={SingleApprovalEnabled}
            setEnabled={setSingleApprovalEnabled}
            value={SingleApprovalSolAddress}
            setValue={setSingleApprovalSolAddress}
            />
                        <div>{"///"}</div>
            <h2>Add multig addresses recipient to your DEPO.</h2>
            <ToogleInputLink
                question="Would you like to set a multisig approval ?"
                linkLabel="List of multisig addresses"
                href="/escrow/create/add_options/add_multisig_approval"
                enabled={MultisigEnabled}
                setEnabled={setMultisigEnabled}
            />
        </div>
    );
}