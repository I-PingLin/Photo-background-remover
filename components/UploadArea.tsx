import React, { useCallback, useState } from 'react';
import { UploadCloud, Image as ImageIcon, AlertCircle } from 'lucide-react';

interface UploadAreaProps {
  onImageSelected: (base64: string, mimeType: string, previewUrl: string) => void;
}

const UploadArea: React.FC<UploadAreaProps> = ({ onImageSelected }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback((file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (PNG, JPG, WEBP).');
      return;
    }
    
    // Validate file size (e.g., max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size too large. Please upload an image smaller than 10MB.');
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      // Extract base64 and mime type
      const mimeType = result.split(';')[0].split(':')[1];
      const base64 = result.split(',')[1];
      onImageSelected(base64, mimeType, result);
    };
    reader.readAsDataURL(file);
  }, [onImageSelected]);

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div 
      className={`relative w-full border-2 border-dashed rounded-2xl transition-all duration-300 ease-in-out group
        ${isDragging 
          ? 'border-indigo-500 bg-indigo-500/10' 
          : 'border-slate-700 hover:border-indigo-500/50 hover:bg-slate-900/50 bg-slate-900/20'
        }
      `}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <input
        type="file"
        accept="image/*"
        onChange={onInputChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        aria-label="Upload image"
      />
      
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className={`
          p-4 rounded-full mb-4 transition-colors duration-300
          ${isDragging ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-indigo-400'}
        `}>
          {isDragging ? <UploadCloud className="w-8 h-8" /> : <ImageIcon className="w-8 h-8" />}
        </div>
        
        <h3 className="text-lg font-semibold text-slate-200 mb-1">
          {isDragging ? 'Drop image here' : 'Upload Product Photo'}
        </h3>
        <p className="text-sm text-slate-400 max-w-xs mx-auto mb-2">
          Drag and drop your image here, or click to browse.
        </p>
        <p className="text-xs text-slate-500">
          Supports JPG, PNG, WEBP up to 10MB
        </p>

        {error && (
          <div className="mt-4 flex items-center gap-2 text-red-400 bg-red-400/10 px-3 py-2 rounded-lg text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadArea;