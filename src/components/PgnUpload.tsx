import React, { useRef, useState } from 'react';
import { Upload, FileText } from 'lucide-react';

interface PgnUploadProps {
  onPgnLoad: (pgn: string) => void;
}

export const PgnUpload: React.FC<PgnUploadProps> = ({ onPgnLoad }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pgnText, setPgnText] = useState('');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setPgnText(content);
        onPgnLoad(content);
      };
      reader.readAsText(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setPgnText(content);
        onPgnLoad(content);
      };
      reader.readAsText(file);
    }
  };

  const handleLoadFromText = () => {
    if (pgnText.trim()) {
      onPgnLoad(pgnText);
    }
  };

  return (
    <div className="bg-[#2b2926] rounded-lg shadow-lg p-6 mb-6 border border-[#3d3a36]">
      <h3 className="text-lg font-semibold mb-4 text-[#f0d9b5] border-b border-[#3d3a36] pb-2">
        PGN Input
      </h3>
      
      {/* Text Input Area */}
      <div className="mb-4">
        <textarea
          value={pgnText}
          onChange={(e) => setPgnText(e.target.value)}
          placeholder="Paste PGN text here..."
          className="w-full h-32 p-3 bg-[#3d3a36] text-[#f0d9b5] border border-[#4a453f] rounded-lg resize-none focus:outline-none focus:border-[#759900] transition-colors"
        />
        <button
          onClick={handleLoadFromText}
          disabled={!pgnText.trim()}
          className="mt-2 w-full bg-[#759900] hover:bg-[#6d8a00] disabled:bg-[#4a453f] disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
        >
          Load from Text
        </button>
      </div>

      {/* File Upload Area */}
      <div
        className="border-2 border-dashed border-[#3d3a36] rounded-lg p-6 text-center cursor-pointer hover:border-[#759900] transition-colors duration-200"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center space-y-3">
          <div className="flex items-center space-x-2 text-[#759900]">
            <Upload className="w-5 h-5" />
            <FileText className="w-5 h-5" />
          </div>
          <div className="text-[#f0d9b5] font-medium">Upload PGN File</div>
          <div className="text-[#a0a0a0] text-sm">
            Click to browse or drag & drop a .pgn file
          </div>
        </div>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept=".pgn,.txt"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
};