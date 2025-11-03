import React from 'react';

interface EditableFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
}

export default function EditableField({
  value,
  onChange,
  placeholder = '',
  className = '',
  minHeight = '60px'
}: EditableFieldProps) {
  return (
    <div
      className={`w-full px-3 py-2 no-border rounded-md bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      style={{ minHeight }}
      contentEditable
      data-placeholder={placeholder}
      suppressContentEditableWarning
      onBlur={(e) => onChange(e.target.innerText)}
    >
      {value}
    </div>
  );
} 