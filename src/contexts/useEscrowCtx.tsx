
"use client";

import React, { createContext, useContext, useState } from "react";
import { WalletContextState } from "@solana/wallet-adapter-react";
import DepoClient from "@/utils/depo_client";
import Escrow from "@/utils/models/escrow";
import { useDepoClient } from "./useDepoClientCtx";

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
});

/**
 * EscrowProvider component
 * @param {*} children The children components
 * @returns {Object} The EscrowProvider component
 */
const EscrowProvider = ({ children }: { children: React.ReactNode }) => {
  const { client, wallet } = useDepoClient();

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [timelock, setTimelock] = useState('')
  const [minimumAmount, setMinimumAmount] = useState('')
  const [targetAmount, setTargetAmount] = useState('')



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
  };
  return (
    <EscrowContext.Provider value={exposed}>
      {children}
    </EscrowContext.Provider>
  );
};  

const useEscrow = () => useContext(EscrowContext);

export { EscrowContext, EscrowProvider, useEscrow };