'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ToogleInputFieldSolAddress from '@/components/create/ToogleInputFieldSolAddress';
import { EscrowProvider } from '@/contexts/useEscrowCtx';

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
    router.push('/escrow/create/next_step');
  };

  return (
    <EscrowProvider>
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
              className="text-red-500 hover:text-red-700 font-bold text-xl"
              title="Supprimer ce champ"
            >
              ✕
            </button>
          )}
        </div>
      ))}

      <button
        onClick={addRecipientField}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        + Ajouter un destinataire
      </button>

      <button
        onClick={handleNext}
        className="ml-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Continuer
      </button>
    </div>
    </EscrowProvider>
  );
}