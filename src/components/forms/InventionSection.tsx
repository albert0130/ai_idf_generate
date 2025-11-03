import React, { useState } from 'react';
import { Invention, placeholderText } from '@/types/idf';
import EditableField from '@/components/ui/EditableField';
import AIAssistButton from '@/components/ui/AIAssistButton';
import ImageUpload from '@/components/ui/ImageUpload';

interface InventionSectionProps {
  invention: Invention;
  onUpdateInvention: (invention: Invention) => void;
  onUpdateField: (field: keyof Invention) => void;
  updatingField: string | null;
}

export default function InventionSection({
  invention,
  onUpdateInvention,
  onUpdateField,
  updatingField
}: InventionSectionProps) {
  const [uploading, setUploading] = useState(false);
  
  const inventionFields = [
    'description',
    'keywords',
    'background',
    'problem',
    'components',
    'advantages',
    'additionaldata',
    'results',
  ] as const;

  const handleFieldChange = (field: keyof Invention, value: string) => {
    const updated = { ...invention };
    const fieldsToArray = ['keywords', 'results', 'components'] as (keyof Invention)[];
    
    if (fieldsToArray.includes(field)) {
      (updated[field] as string[]) = value.split(',').map((v) => v.trim());
    } else {
      (updated[field] as string) = value;
    }

    onUpdateInvention(updated);
  };

  const handleAddImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);
    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Upload failed' }));
        throw new Error(errorData.error || 'Upload failed');
      }

      const result = await response.json();
      
      if (result.success && result.files) {
        const updated = { ...invention };
        const currentImages = invention.uploadedImages || [];
        updated.uploadedImages = [...currentImages, ...result.files];
        onUpdateInvention(updated);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload images. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = (idx: number) => {
    const currentImages = invention.uploadedImages || [];
    const updatedImages = currentImages.filter((_, i) => i !== idx);
    const updated = { ...invention, uploadedImages: updatedImages };
    onUpdateInvention(updated);
  };

  const handleChangeImage = (idx: number) => {
    // This would typically open a file picker to replace the image
    // For now, we'll just trigger the file input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = async (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (!files || files.length === 0) return;

      setUploading(true);
      try {
        const formData = new FormData();
        formData.append('files', files[0]);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Upload failed' }));
          throw new Error(errorData.error || 'Upload failed');
        }

        const result = await response.json();
        
        if (result.success && result.files && result.files.length > 0) {
          const currentImages = invention.uploadedImages || [];
          const updatedImages = [...currentImages];
          updatedImages[idx] = result.files[0];
          const updated = { ...invention, uploadedImages: updatedImages };
          onUpdateInvention(updated);
        }
      } catch (error) {
        console.error('Upload error:', error);
        alert('Failed to upload image. Please try again.');
      } finally {
        setUploading(false);
      }
    };
    fileInput.click();
  };

  return (
    <div>
      <strong className="block text-lg font-semibold text-gray-800 mb-2">5. THE INVENTION</strong>

      {inventionFields.map((field) => (
        <div key={field} className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {field.toUpperCase()}:
          </label>

          {field === 'additionaldata' ? (
            <>
              {/* Image upload section */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  UPLOADED IMAGES:
                </label>
                <ImageUpload
                  images={invention.uploadedImages || []}
                  onAddImage={handleAddImage}
                  onDeleteImage={handleDeleteImage}
                  onChangeImage={handleChangeImage}
                  uploading={uploading}
                />
              </div>
              
              {/* AI Assist Button for additional data */}
              <div className="mt-2 flex justify-start">
                <AIAssistButton
                  onClick={() => onUpdateField(field)}
                  loading={updatingField === field}
                />
              </div>
              
              {/* Show AI-generated text content below the button */}
              {invention.additionaldata && invention.additionaldata.trim() && (
                <div className="mt-4 p-3 bg-gray-50 rounded border">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    AI GENERATED CONTENT:
                  </label>
                  <div className="text-sm text-gray-600">
                    {invention.additionaldata}
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <EditableField
                value={
                  Array.isArray(invention[field])
                    ? (invention[field] as string[]).join(', ')
                    : (invention[field] as string)
                }
                onChange={(value) => handleFieldChange(field, value)}
                placeholder={placeholderText[field]}
              />

              {/* AI Assist Button */}
              {[
                'description',
                'keywords',
                'background',
                'problem',
                'components',
                'advantages',
                'results',
              ].includes(field) && (
                <div className="mt-2 flex justify-start">
                  <AIAssistButton
                    onClick={() => onUpdateField(field)}
                    loading={updatingField === field}
                  />
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
} 