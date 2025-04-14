// 'use client'
//
// import { useWallet } from '@solana/wallet-adapter-react'
// import { WalletButton } from '../solana/solana-provider'
// import { useDepositProgram } from './deposit-data-access'
// import { DepositList } from './deposit-ui'
//
// export default function DepositFeature() {
//   const { publicKey } = useWallet()
//   const { programId } = useDepositProgram()
//
//   return publicKey ? (
//     <div>
//       <DepositList />
//     </div>
//   ) : (
//     <div className="max-w-4xl mx-auto">
//       <div className="hero py-[64px]">
//         <div className="hero-content text-center">
//           <WalletButton />
//         </div>
//       </div>
//     </div>
//   )
// }
