"use client";

import React, { createContext, useContext, useMemo } from "react";
import { useAnchorProvider } from "@/components/solana/solana-provider";
import { useWallet } from "@solana/wallet-adapter-react";
import DepoClient from "@/utils/depo_client";
import Escrow from "@/utils/models/escrow";
type DepoClientContextType = {
  client: DepoClient | null;
  getEscrows: () => Promise<Escrow[]>;
  getEscrow: (uuid: string) => Promise<Escrow | null>;
};

const DepoClientContext = createContext<DepoClientContextType>({
  client: null,
  getEscrows: async () => Promise.resolve([]),
  getEscrow: async () => Promise.resolve(null),
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

  const getEscrows = useMemo(() => {
    return async () => {
      if (depoClient) {
        return await depoClient.getEscrows();
      }
      return [];
    };
  }, [depoClient]);

  const getEscrow = (uuid: string): Promise<Escrow | null> => {
    if (depoClient) {
      return depoClient.getEscrow(uuid);
    }
    return Promise.resolve(null);
  };

  const exposed: DepoClientContextType = {
    client: depoClient,
    getEscrows,
    getEscrow,
  };

  return (
    <DepoClientContext.Provider value={exposed}>
      {children}
    </DepoClientContext.Provider>
  );
};

const useDepoClient = () => useContext(DepoClientContext);

export { DepoClientContext, DepoClientProvider, useDepoClient };