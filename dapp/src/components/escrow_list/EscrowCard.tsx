import Escrow from "@/utils/sdk/models/escrow";
import Image from "next/image";
import Link from "next/link";

function EscrowCard({ escrow }: { escrow: Escrow }) {
  return (
    <Link
      href={`/demo/escrow/${escrow.uuid}`}
      className="flex items-center justify-between bg-black text-white rounded-2xl px-4 py-3 cursor-pointer shadow-md hover:bg-gray-900 transition"
    >
      <div className="flex justify-between items-center space-x-4 w-full">
        <div className="flex space-x-4">
          <Image
            src="/D-logo-black.svg"
            alt="Logo DEPO"
            width={0}
            height={0}
            className="h-10 w-auto object-contain"
          />
          <div className="flex flex-col truncate w-full max-w-[200px]">
            <span className="text-md font-bold">
              {escrow.name.length > 24 ? escrow.name.slice(0, 24) + '…' : escrow.name}
            </span>
            <span className="text-sm">
              {escrow.description.length > 24 ? escrow.description.slice(0, 24) + '…' : escrow.description}
            </span>
          </div>
        </div>
        <div className="text-md">
          {`Status: ${escrow.status.charAt(0).toUpperCase() + escrow.status.slice(1)}`}
          <br />
          {`Deposited Amount: ${escrow.depositedAmount} SOL`}
        </div>
      </div>
    </Link>
  )
}

export default EscrowCard;