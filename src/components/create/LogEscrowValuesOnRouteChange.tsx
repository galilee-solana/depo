"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useEscrow } from '@/contexts/useEscrowCtx';

export const LogEscrowValuesOnRouteChange = () => {
  const pathname = usePathname();
  const {
    name,
    description,
    recipients,
    modules,
  } = useEscrow();

  useEffect(() => {
    console.log(`[Navigation] Navigated to: ${pathname}`);
    console.log("Escrow context values:", {
      name,
      description,
      recipients,
      modules,
    });
  }, [pathname]);

  return null;
};
