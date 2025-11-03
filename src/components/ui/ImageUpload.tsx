import React from 'react';

interface ImageUploadProps {
  images: string[];
  onAddImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteImage: (idx: number) => void;
  onChangeImage: (idx: number) => void;
  className?: string;
  uploading?: boolean;
}

export default function ImageUpload({
  images,
  onAddImage,
  onDeleteImage,
  onChangeImage,
  className = '',
  uploading = false
}: ImageUploadProps) {
  return (
    <div className={`flex flex-wrap gap-4 ${className}`}>
      {/* Render uploaded images */}
      {images
        .filter(path => path && path.trim() && path.trim() !== '')
        .map((path, idx) => (
          <div
            key={idx}
            className="relative group w-32 h-32 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center"
          >
            {/* Image with hover alpha */}
            <img
              src={path}
              alt={`uploaded-${idx}`}
              className="object-cover w-full h-full transition-opacity duration-300 group-hover:opacity-30"
              onError={(e) => {
                // Handle broken image links
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="hidden absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-500 text-sm">
              Image not found
            </div>

            {/* Icon buttons on hover */}
            <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={() => onChangeImage(idx)}
                className="text-white text-xl hover:scale-110 transition-transform"
              >
                ✏️
              </button>
              <button
                onClick={() => onDeleteImage(idx)}
                className="text-white text-xl hover:scale-110 transition-transform"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}

      {/* Add new image card */}
      <div className={`w-32 h-32 rounded-md flex items-center justify-center ${
        uploading 
          ? 'bg-gray-100 cursor-not-allowed' 
          : 'bg-gray-200 cursor-pointer hover:bg-gray-300'
      }`}>
        <label className={`w-full h-full flex items-center justify-center ${
          uploading ? 'cursor-not-allowed' : 'cursor-pointer'
        }`}>
          {uploading ? (
            <div className="text-gray-500 text-sm">Uploading...</div>
          ) : (
            <>
              <span className="text-3xl">+</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onAddImage}
                disabled={uploading}
              />
            </>
          )}
        </label>
      </div>
    </div>
  );
} 