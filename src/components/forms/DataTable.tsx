import React from 'react';

interface DataTableProps<T> {
  title: string;
  data: T[];
  columns: (keyof T)[];
  onUpdateData: (data: T[]) => void;
  onGenerateAI?: () => void;
  loading?: boolean;
  emptyMessage?: string;
  addButtonText?: string;
}

export default function DataTable<T extends Record<string, any>>({
  title,
  data,
  columns,
  onUpdateData,
  onGenerateAI,
  loading = false,
  emptyMessage = 'None known',
  addButtonText = '+ Add Row'
}: DataTableProps<T>) {
  const handleRowChange = (idx: number, field: keyof T, value: string) => {
    const updated = [...data];
    updated[idx][field] = value;
    onUpdateData(updated);
  };

  const handleDeleteRow = (idx: number) => {
    const updated = [...data];
    updated.splice(idx, 1);
    onUpdateData(updated);
  };

  const handleAddRow = () => {
    const emptyRow = columns.reduce((acc, col) => {
      acc[col] = '';
      return acc;
    }, {} as T);
    onUpdateData([...data, emptyRow]);
  };

  return (
    <div>
      <strong className="block text-lg font-semibold text-gray-800 mb-2">{title}</strong>

      {data.length === 0 ? (
        <div className="text-gray-500 text-sm italic mt-2">{emptyMessage}</div>
      ) : (
        <table className="table-auto w-full border border-gray-300 text-sm shadow-sm rounded-md mt-2">
          <thead className="bg-gray-100 text-left text-gray-700">
            <tr>
              {columns.map((col) => (
                <th key={String(col)} className="border px-3 py-2 capitalize">
                  {String(col)}
                </th>
              ))}
              <th className="border px-3 py-2 exclude-from-pdf">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => (
              <tr key={idx} className="even:bg-gray-50">
                {columns.map((col) => (
                  <td key={String(col)} className="border px-3 py-2">
                    <input
                      className="w-full px-2 py-1 no-border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={item[col] || ''}
                      placeholder={`Please input ${String(col)}`}
                      onChange={(e) => handleRowChange(idx, col, e.target.value)}
                    />
                  </td>
                ))}
                <td className="border px-3 py-2 text-center exclude-from-pdf">
                  <button
                    onClick={() => handleDeleteRow(idx)}
                    className="p-2 text-red-600 hover:text-red-800"
                    title="Delete row"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="flex items-center gap-4 mt-2 exclude-from-pdf">
        <button
          className="text-blue-600 hover:underline text-sm"
          onClick={handleAddRow}
        >
          {addButtonText}
        </button>
        {onGenerateAI && (
          <button
            className="text-sm px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-200 flex items-center gap-2"
            onClick={onGenerateAI}
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-gray-800" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Generating...
              </>
            ) : (
              'AI assist'
            )}
          </button>
        )}
      </div>
    </div>
  );
} 