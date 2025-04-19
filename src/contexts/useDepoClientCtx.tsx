"use client";

import React, { createContext, useContext, useMemo } from "react";
import { useAnchorProvider } from "@/components/solana/solana-provider";
import { useWallet } from "@solana/wallet-adapter-react";
import { toast } from "react-hot-toast";
import DepoClient from "@/utils/depo_client";
import Escrow from "@/utils/models/escrow";
type DepoClientContextType = {
  client: DepoClient | null;
  getAllEscrows: () => Promise<Escrow[]>;
  getEscrow: (uuid: string) => Promise<Escrow | null>;
};

const DepoClientContext = createContext<DepoClientContextType>({
  client: null,
  getAllEscrows: async () => Promise.resolve([]),
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
  
  const getEscrow = useMemo<(uuid: string) => Promise<Escrow | null>>(() => {
    return async (uuid: string) => {
      if (depoClient) {
        const result = await depoClient.getEscrow(uuid);
        return result === undefined ? null : result;
      }
      return null;
    };
  }, [depoClient]);

  const getAllEscrows = useMemo<() => Promise<Escrow[]>>(() => {
    return async () => {
      if (depoClient && wallet.connected) {
        try {
          return await depoClient.getAllEscrows();
        } catch (error: any) {
          console.error("Error fetching escrows:", error);
          throw error;
        }
      }
      return [];
    };
  }, [depoClient, wallet.connected]);

  const exposed: DepoClientContextType = {
    client: depoClient,
    getEscrow,
    getAllEscrows,
  };

  return (
    <DepoClientContext.Provider value={exposed}>
      {children}
    </DepoClientContext.Provider>
  );
};

const useDepoClient = () => useContext(DepoClientContext);

export { DepoClientContext, DepoClientProvider, useDepoClient };