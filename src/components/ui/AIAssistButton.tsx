import React from 'react';

interface AIAssistButtonProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export default function AIAssistButton({
  onClick,
  disabled = false,
  loading = false,
  className = '',
  children = 'AI assist'
}: AIAssistButtonProps) {
  return (
    <button
      className={`mt-2 text-sm px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-200 flex items-center gap-2 exclude-from-pdf ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
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
        children
      )}
    </button>
  );
} 