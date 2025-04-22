import Escrow from "@/utils/sdk/models/escrow";
import { formatSol } from "@/utils/number-formatter";

function EscrowDetailCard({ escrow, isAuthorized }: { escrow: Escrow, isAuthorized: boolean }) {
    return (
      <div className="flex flex-col gap-4 pt-6">
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-bold border-b pb-3 mb-4">Escrow Details</h2>
          <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col">
                  <span className="text-gray-500 text-sm">Name</span>
                  <span className="font-medium">{escrow.name}</span>
              </div>
              
              <div className="flex flex-col">
                  <span className="text-gray-500 text-sm">Description</span>
                  <span className="font-medium">{escrow.description}</span>
              </div>
              
              <div className="flex flex-col">
                  <span className="text-gray-500 text-sm">Status</span>
                  <span className="font-medium capitalize">{escrow.status}</span>
              </div>
              <div className="flex flex-col">
                  <span className="text-gray-500 text-sm">Deposited Amount</span>
                  <span className="font-medium">{formatSol(escrow.depositedAmount.toString(), 9)} SOL</span>
              </div>
              
              <div className="flex flex-col">
                  <span className="text-gray-500 text-sm">Deposit Authorization</span>
                  <span className={`font-medium ${isAuthorized ? 'text-green-600' : 'text-red-600'}`}>
                      {isAuthorized ? 'Authorized' : 'Not Authorized'}
                  </span>
              </div>
          </div>
      </div>
    </div>
  )
}

export default EscrowDetailCard;