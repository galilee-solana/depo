"use client";

import React, { createContext, useContext, useState } from "react";
import { useDepoClient } from "./useDepoClientCtx";
import { toast } from "react-hot-toast";
import ToastWithLinks from "@/components/toasts/ToastWithLinks";
import { validatePubkey } from "@/utils/sdk/utils/validation/validatePubkey";

type EscrowContextType = {
  name: string;
  setName: (name: string) => void;
  description: string;
  setDescription: (description: string) => void;
  timelock: string;
  setTimelock: (timelock: string) => void;
  minimumAmount: string;
  setMinimumAmount: (minimumAmount: string) => void;
  targetAmount: string;
  setTargetAmount: (targetAmount: string) => void;
  create: () => Promise<{ tx: string; escrow: any } | null>;
  recipients: string[];
  setRecipients: (recipients: string[]) => void;
  depositors: string[];
  setDepositors: (depositors: string[]) => void;
};

const EscrowContext = createContext<EscrowContextType>({
  name: '',
  setName: () => {},
  description: '',
  setDescription: () => {},
  timelock: '',
  setTimelock: () => {},
  minimumAmount: '',
  setMinimumAmount: () => {},
  targetAmount: '',
  setTargetAmount: () => {},
  create: () => Promise.resolve(null),
  recipients: [],
  setRecipients: () => {},
  depositors: [],
  setDepositors: () => {},
});

/**
 * EscrowProvider component
 * @param {*} children The children components
 * @returns {Object} The EscrowProvider component
 */
const EscrowProvider = ({ children }: { children: React.ReactNode }) => {
  const { client, wallet, getExplorerUrl } = useDepoClient();

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [timelock, setTimelock] = useState('')
  const [minimumAmount, setMinimumAmount] = useState('')
  const [targetAmount, setTargetAmount] = useState('')
  const [recipients, setRecipients] = useState<string[]>([])
  const [depositors, setDepositors] = useState<string[]>([])

  const create = async () => {
    if (!validateEscrow()) {
      return null;
    }
    
    if (client) {
      const result = await client.createEscrow(
        name, 
        description, 
        timelock, 
        minimumAmount, 
        targetAmount, 
        recipients, 
        depositors
      );
      const explorerUrl = getExplorerUrl(`tx/${result.tx}`)
      toast.success(
        <ToastWithLinks
          message="Escrow created"
          linkText="View transaction"
          url={explorerUrl}
        />
      )
      return result
    }
    return null;
  }

  const validateEscrow = () => {
    if (name.trim() === '') {
      toast.error('Name is required')
      return false
    }
    if (description.trim() === '') {
      toast.error('Description is required')
      return false
    }

    if (timelock.trim() !== '') {
      const now = new Date()
      const lockTime = new Date(timelock)
      if (isNaN(lockTime.getTime()) || lockTime.getTime() < now.getTime() + 5 * 60 * 1000) {
          toast.error("Timelock must be at least 5 minutes in the future.")
          return false
      }
    }

    if (minimumAmount.trim() !== '' && parseFloat(minimumAmount) <= 0) {
      toast.error('Minimum amount must be greater than 0')
      return false
    }

    if (targetAmount.trim() !== '' && parseFloat(targetAmount) <= 0) {
      toast.error('Target amount must be greater than 0')
      return false
    }

    if (minimumAmount.trim() !== '' && targetAmount.trim() !== '' && parseFloat(minimumAmount) > parseFloat(targetAmount)) {
      toast.error('Minimum amount cannot exceed target amount')
      return false
    }

    if (recipients.length === 0) {
      toast.error('At least one recipient is required')
      return false
    }

    if (recipients.some(recipient => !validatePubkey(recipient))) {
      toast.error('Invalid recipient public key')
      return false
    }

    if (depositors.length > 0 && depositors[0].trim() !== '' && depositors.some(depositor => !validatePubkey(depositor))) {
      toast.error('Invalid depositor public key')
      return false
    }
    return true 
  }

  const exposed: EscrowContextType = {
    name,
    setName,
    description,
    setDescription,
    timelock,
    setTimelock,
    minimumAmount,
    setMinimumAmount,
    targetAmount,
    setTargetAmount,
    create,
    recipients,
    setRecipients,
    depositors,
    setDepositors,
  };
  return (
    <EscrowContext.Provider value={exposed}>
      {children}
    </EscrowContext.Provider>
  );
};  

const useEscrow = () => useContext(EscrowContext);

export { EscrowContext, EscrowProvider, useEscrow };