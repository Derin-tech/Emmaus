import React, { useRef } from 'react';
import { UploadCloud, CheckCircle, X, File as FileIcon } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  accept?: string;
  value?: string | File | null;
  placeholder?: string;
}

export function FileUpload({ onFileSelect, accept = '.pdf', value = null, placeholder = 'Click or drag a file to upload' }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getDisplayName = () => {
    if (value instanceof File) return value.name;
    if (typeof value === 'string' && value) return value.split('/').pop()?.split('?')[0] || 'Uploaded File';
    return '';
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const onDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };
  
  const onDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
  };

  return (
    <div className="w-full">
      {value ? (
        <div className="flex items-center justify-between p-3 border border-[#E5E5E5] dark:border-[#333336] rounded-xl bg-[#F5F5F7] dark:bg-[#1D1D1F]">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg shrink-0">
              <FileIcon size={20} />
            </div>
            <div className="flex flex-col truncate">
              <span className="text-sm font-medium text-[#1D1D1F] dark:text-[#F5F5F7] truncate">
                {getDisplayName()}
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                <CheckCircle size={10} /> Selected
              </span>
            </div>
          </div>
          <button 
            type="button"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onFileSelect(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
            className="p-1 hover:bg-[#E5E5E5] dark:hover:bg-[#333336] rounded-md text-[#86868B] transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <label 
          onDrop={onDrop}
          onDragOver={onDragOver}
          className="relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl transition-colors border-[#E5E5E5] dark:border-[#333336] hover:border-blue-500 dark:hover:border-blue-500 bg-[#F5F5F7] dark:bg-[#1D1D1F] cursor-pointer"
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={onFileChange} 
            accept={accept} 
            className="hidden" 
          />
          
          <div className="p-3 bg-white dark:bg-[#2C2C2E] shadow-sm rounded-full mb-3 text-[#86868B]">
            <UploadCloud size={24} />
          </div>
          <span className="text-sm font-medium text-[#1D1D1F] dark:text-[#F5F5F7]">
            {placeholder}
          </span>
          <span className="text-xs text-[#86868B] mt-1">PDF up to 50MB</span>
        </label>
      )}
    </div>
  );
}
