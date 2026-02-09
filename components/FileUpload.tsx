
import React, { useRef, useState } from 'react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, selectedFile }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  return (
    <div 
      className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 text-center cursor-pointer ${
        isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-blue-400 bg-white'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input 
        type="file" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleChange} 
        accept=".pdf"
      />
      <div className="flex flex-col items-center">
        <div className={`w-16 h-16 mb-4 rounded-full flex items-center justify-center ${selectedFile ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
          <i className={`fa-solid ${selectedFile ? 'fa-file-circle-check' : 'fa-cloud-arrow-up'} text-2xl`}></i>
        </div>
        <h3 className="text-lg font-semibold text-slate-800">
          {selectedFile ? selectedFile.name : 'Upload your resume'}
        </h3>
        <p className="text-sm text-slate-500 mt-1">
          {selectedFile 
            ? `Size: ${(selectedFile.size / 1024).toFixed(1)} KB` 
            : 'PDF format supported. Drag and drop or click to browse.'}
        </p>
      </div>
    </div>
  );
};
