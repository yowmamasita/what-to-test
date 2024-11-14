import React, { useCallback } from 'react';
import { Upload } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (content: string) => void;
}

export function FileUpload({ onFileUpload }: FileUploadProps) {
  const [isDragging, setIsDragging] = React.useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onFileUpload(event.target.result as string);
        }
      };
      reader.readAsText(file);
    }
  }, [onFileUpload]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onFileUpload(event.target.result as string);
        }
      };
      reader.readAsText(file);
    }
  }, [onFileUpload]);

  return (
    <div
      className={`w-full p-8 border-2 border-dashed rounded-lg transition-colors ${
        isDragging ? 'border-indigo-500 bg-indigo-500/10' : 'border-gray-700'
      } bg-gray-800`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <label className="flex flex-col items-center justify-center cursor-pointer">
        <Upload className="w-12 h-12 text-gray-400 mb-4" />
        <span className="text-lg font-medium text-gray-200">
          Drop your coverage file here
        </span>
        <span className="text-sm text-gray-400 mt-2">
          or click to select a file
        </span>
        <input
          type="file"
          className="hidden"
          onChange={handleFileInput}
          accept=".out,.txt,.coverage"
        />
      </label>
    </div>
  );
}