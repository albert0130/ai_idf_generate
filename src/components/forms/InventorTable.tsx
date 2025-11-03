import React from 'react';
import { Inventor, IDFData } from '@/types/idf';

interface InventorTableProps {
  inventors: Inventor[];
  onUpdateInventors: (inventors: Inventor[]) => void;
}

export default function InventorTable({ inventors, onUpdateInventors }: InventorTableProps) {
  const handleInventorChange = (idx: number, field: keyof Inventor, value: string) => {
    const updated = [...inventors];
    updated[idx][field] = value;
    onUpdateInventors(updated);
  };

  const handleDeleteInventor = (idx: number) => {
    const updated = [...inventors];
    updated.splice(idx, 1);
    onUpdateInventors(updated);
  };

  const handleAddInventor = () => {
    const newInventor: Inventor = {
      Name: '',
      id: '',
      nationality: '',
      inventorship: '',
      employer: '',
      address: '',
      Phone: '',
      email: '',
    };
    onUpdateInventors([...inventors, newInventor]);
  };

  return (
    <div>
      <strong className="block text-lg font-semibold text-gray-800 mb-2">3. INVENTOR DETAILS:</strong>
      <table className="table-auto w-full border border-gray-300 text-sm rounded-md shadow-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="border px-3 py-2">Personal Info (Name, ID, Nationality)</th>
            <th className="border px-3 py-2">Employer</th>
            <th className="border px-3 py-2">% Inventorship</th>
            <th className="border px-3 py-2">Contact Info (Home, Phone, Email)</th>
            <th className="border px-3 py-2">Signature</th>
            <th className="border px-3 py-2 exclude-from-pdf">Action</th>
          </tr>
        </thead>
        <tbody>
          {inventors.map((inv, idx) => (
            <tr key={idx} className="even:bg-gray-50">
              <td className="border px-0 py-0">
                {(['Name', 'id', 'nationality'] as (keyof Inventor)[]).map((field, i) => (
                  <div key={i} className="border-b last:border-b-0 px-3 py-1">
                    <input
                      placeholder={`Please input ${field}`}
                      className="w-full px-2 py-1 no-border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      value={inv[field] || ''}
                      onChange={(e) => handleInventorChange(idx, field, e.target.value)}
                    />
                  </div>
                ))}
              </td>
              <td className="border px-3 py-2">
                <input
                  className="w-full px-2 py-1 no-border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={inv.employer}
                  placeholder='Please input Employer'
                  onChange={(e) => handleInventorChange(idx, 'employer', e.target.value)}
                />
              </td>
              <td className="border px-3 py-2">
                <input
                  className="w-full px-2 py-1 no-border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={inv.inventorship}
                  placeholder='Please input % of inventorship'
                  onChange={(e) => handleInventorChange(idx, 'inventorship', e.target.value)}
                />
              </td>
              <td className="border px-0 py-0">
                {(['address', 'Phone', 'email'] as (keyof Inventor)[]).map((field, i) => (
                  <div key={i} className="border-b last:border-b-0 px-3 py-1">
                    <input
                      placeholder={field === 'address' ? 'Please input Home Address' : `Please input ${field}`}
                      className="w-full px-2 py-1 no-border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      value={inv[field] || ''}
                      onChange={(e) => handleInventorChange(idx, field, e.target.value)}
                    />
                  </div>
                ))}
              </td>
              <td className="border px-3 py-2 text-center text-gray-400 italic">
                <div className='exclude-from-pdf'>Signed</div>
              </td>
              <td className="border px-3 py-2 text-center exclude-from-pdf">
                <button
                  onClick={() => handleDeleteInventor(idx)}
                  className="text-red-500 hover:underline text-sm"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={handleAddInventor}
        className="mt-2 text-blue-600 hover:underline text-sm exclude-from-pdf"
      >
        + Add Inventor
      </button>
    </div>
  );
} 