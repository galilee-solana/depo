'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ToogleInputFieldSolAddress from '@/components/create/ToogleInputFieldSolAddress';
import { useEscrow } from '@/contexts/useEscrowCtx';

export default function SetRecipientAddressPage() {
  const router = useRouter();
  const { setRecipients } = useEscrow();

  const [recipientFields, setRecipientFields] = useState([
    { id: crypto.randomUUID(), enabled: false, address: '' },
  ]);

  const addRecipientField = () => {
    const newField = {
      id: crypto.randomUUID(),
      enabled: false,
      address: '',
    };
    setRecipientFields((prev) => [...prev, newField]);
  };

  const removeRecipientField = (id: string) => {
    if (recipientFields.length === 1) return;
    setRecipientFields((prev) => prev.filter((field) => field.id !== id));
  };

  const handleNext = () => {
    const activeRecipients = recipientFields
      .filter((field) => field.enabled && field.address.trim() !== '')
      .map(({ id, address }) => ({ id, address }));

    setRecipients(activeRecipients);
    router.push('/escrow/create');
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Please add recipient address(es)</h1>

      {recipientFields.map((field, index) => (
        <div key={field.id} className="flex items-start gap-4">
          <div className="flex-1">
            <ToogleInputFieldSolAddress
              label={`Recipient address #${index + 1}`}
              placeholder="Add recipient public Solana address"
              enabled={field.enabled}
              setEnabled={(enabled) => {
                const updated = [...recipientFields];
                updated[index].enabled = enabled;
                setRecipientFields(updated);
              }}
              value={field.address}
              setValue={(value) => {
                const updated = [...recipientFields];
                updated[index].address = value;
                setRecipientFields(updated);
              }}
            />
          </div>
          {recipientFields.length > 1 && (
            <button
              onClick={() => removeRecipientField(field.id)}
              className="text-black-500 hover:text-grey-100 font-bold text-xl"
              title="Supprimer ce champ"
            >
              ✕
            </button>
          )}
        </div>
      ))}

      <button
        onClick={addRecipientField}
        className="mpx-6 py-3 border-2 border-black text-black bg-white rounded-lg hover:bg-gray-100 transition"
      >
        + Add Recipient
      </button>

      <button
        onClick={handleNext}
        className="mpx-6 py-3 border-2 text-white bg-black rounded-lg hover:bg-gray-30 transition"
      >
        Confirm Address(es)
      </button>
    </div>
  );
}