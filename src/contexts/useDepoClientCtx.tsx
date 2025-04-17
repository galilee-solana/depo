"use client";

import React, { createContext, useContext, useState, useEffect, useRef, useMemo } from "react";
import { useAnchorProvider } from "@/components/solana/solana-provider";
import { useWallet } from "@solana/wallet-adapter-react";
import DepoClient from "@/utils/depo_client";

type DepoClientContextType = {
  client: DepoClient | null;
};

const DepoClientContext = createContext<DepoClientContextType>({
  client: null,
});

/**
 * DepoClientProvider component
 * @param {*} children The children components
 * @returns {Object} The UserProvider component
 */
const DepoClientProvider = ({ children }: { children: React.ReactNode }) => {
  const provider = useAnchorProvider();
  const wallet = useWallet();
  
  const depoClient = useMemo(() => {
    if (provider && wallet) {
      return new DepoClient(provider, wallet);
    }
    return null;
  }, [provider, wallet]);

  const exposed: DepoClientContextType = {
    client: depoClient,
  };

  return (
    <DepoClientContext.Provider value={exposed}>
      {children}
    </DepoClientContext.Provider>
  );
};

const useDepoClient = () => useContext(DepoClientContext);

export { DepoClientContext, DepoClientProvider, useDepoClient };