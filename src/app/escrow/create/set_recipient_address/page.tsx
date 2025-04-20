"use client";

import { useEffect } from "react";
import ToogleInputFieldSolAddress from "@/components/create/ToogleInputFieldSolAddress";
import { useEscrow } from "@/contexts/useEscrowCtx";
import { useRouter } from "next/navigation";

export default function SetRecipientAddressPage() {
  const { recipients, setRecipients } = useEscrow();
  const router = useRouter();

  useEffect(() => {
    if (recipients.length === 0) {
      setRecipients([{ id: crypto.randomUUID(), address: "", active: false }]);
    }
  }, []);

  const updateRecipient = (id: string, address: string, active: boolean) => {
    setRecipients((prev) =>
      prev.map((r) => (r.id === id ? { ...r, address, active } : r))
    );
  };

  const addRecipientField = () => {
    setRecipients((prev) => [
      ...prev,
      { id: crypto.randomUUID(), address: "", active: false },
    ]);
  };

  const handleConfirm = () => {
    console.log("Confirmed Recipients:", recipients);
    router.push("/escrow/create");
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-semibold">Set Recipient address(es)</h1>
      {recipients.map((recipient) => (
        <ToogleInputFieldSolAddress
          key={recipient.id}
          placeholder="Solana address"
          value={recipient.address ?? ""}
          setValue={(newAddress) =>
            updateRecipient(recipient.id, newAddress, recipient.active)
          }
          enabled={recipient.active ?? false}
          setEnabled={(newActive) =>
            updateRecipient(recipient.id, recipient.address, newActive)
          }
          showRemove={recipients.length > 1}
          onRemove={() =>
            setRecipients((prev) =>
              prev.filter((r) => r.id !== recipient.id)
            )
          }
        />
      ))}
      <div className="flex gap-4 mt-4">
        <button onClick={addRecipientField} className="px-4 py-2 bg-gray-200 rounded">
          + Add recipient
        </button>
        <button onClick={handleConfirm} className="px-4 py-2 bg-black text-white rounded">
          Confirm Address(es)
        </button>
      </div>
    </div>
  );
}