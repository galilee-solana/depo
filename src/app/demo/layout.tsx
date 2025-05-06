import { DepoClientProvider } from "@/contexts/useDepoClientCtx";
import { SolanaProvider } from "@/components/solana/solana-provider";
import { ReactQueryProvider } from "../react-query-provider";
import { ClusterProvider } from "@/components/cluster/cluster-data-access";
import { DemoUILayout } from "@/components/ui/demo-ui-layout";

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <ReactQueryProvider>
      <ClusterProvider>
        <SolanaProvider>
          <DepoClientProvider>
            <DemoUILayout>
              {children}
            </DemoUILayout>
          </DepoClientProvider>
        </SolanaProvider>
      </ClusterProvider>
    </ReactQueryProvider>
  )
}