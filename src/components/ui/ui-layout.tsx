'use client'

import Image from 'next/image'
import * as React from 'react'
import { ReactNode, useEffect, useRef } from 'react'
import toast, { Toaster } from 'react-hot-toast'

import { AccountChecker } from '../account/account-ui'
import { ClusterChecker, ClusterUiSelect, ExplorerLink } from '../cluster/cluster-ui'
import { WalletButton } from '../solana/solana-provider'

export function UiLayout({ children }: { children: ReactNode }) {

  // Add test const to check DepoCard display
  //const EscrowList = [
  //  { id: 2, name: 'Escrow Alpha' },
  //  { id: 1, name: 'Paiement sécurisé très long' },
  //  { id: 3, name: 'Mini escrow' },
  //  { id: 5, name: 'Caution pour paiement 5' },
  //  { id: 6, name: 'Ne devrait pas apparaître' },
  //  { id: 4, name: '4 : Celui-ci est vraiment vraiment vraiment très très long' },
  //  { id: 7, name: 'Achat groupé pour 7' },
  //]

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Navbar */}
      <div className="navbar bg-white text-black flex-col md:flex-row items-center justify-between px-4 py-4 min-h-[64px] flex-shrink-0">
        <div className="h-full">
          <a href="/escrow">
            <Image src="/D-logo-white.svg" alt="Logo" width={0} height={0} className="h-10 w-auto object-contain" priority />
          </a>
        </div>
        {/* Wallet & Cluster buttons */}
        <div className="flex-none space-x-2">
          <WalletButton />
          <ClusterUiSelect />
        </div>
      </div>
      <ClusterChecker>
        <AccountChecker />
      </ClusterChecker>
      {/* Main Menu */}
      <div className="flex-grow w-full bg-white text-black overflow-y-auto">
        <div className="h-full px-4 md:px-12">
          {children}
        </div>
        <div>
          <Toaster position="bottom-right" />
        </div>
      </div>
    </div>
  )
}

export function AppModal({
  children,
  title,
  hide,
  show,
  submit,
  submitDisabled,
  submitLabel,
}: {
  children: ReactNode
  title: string
  hide: () => void
  show: boolean
  submit?: () => void
  submitDisabled?: boolean
  submitLabel?: string
}) {
  const dialogRef = useRef<HTMLDialogElement | null>(null)

  useEffect(() => {
    if (!dialogRef.current) return
    if (show) {
      dialogRef.current.showModal()
    } else {
      dialogRef.current.close()
    }
  }, [show, dialogRef])

  return (
    <dialog className="modal" ref={dialogRef}>
      <div className="modal-box space-y-5">
        <h3 className="font-bold text-lg">{title}</h3>
        {children}
        <div className="modal-action">
          <div className="join space-x-2">
            {submit ? (
              <button className="btn btn-xs lg:btn-md btn-primary" onClick={submit} disabled={submitDisabled}>
                {submitLabel || 'Save'}
              </button>
            ) : null}
            <button onClick={hide} className="btn">
              Close
            </button>
          </div>
        </div>
      </div>
    </dialog>
  )
}

export function ellipsify(str = '', len = 4) {
  if (str.length > 30) {
    return str.substring(0, len) + '..' + str.substring(str.length - len, str.length)
  }
  return str
}

export function useTransactionToast() {
  return (signature: string) => {
    toast.success(
      <div className={'text-center'}>
        <div className="text-lg">Transaction sent</div>
        <ExplorerLink path={`tx/${signature}`} label={'View Transaction'} className="btn btn-xs btn-primary" />
      </div>,
    )
  }
}
