import React, { useRef, useState } from 'react';
import { Camera, X, Upload } from 'lucide-react';

interface CameraInputProps {
  onCapture: (base64: string) => void;
  onClear: () => void;
  hasImage: boolean;
}

export const CameraInput: React.FC<CameraInputProps> = ({ onCapture, onClear, hasImage }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const base64Clean = result.split(',')[1];
        setPreview(result);
        onCapture(base64Clean);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClear = () => {
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    onClear();
  };

  if (hasImage && preview) {
    return (
      <div className="relative w-full h-48 bg-black/50 rounded-xl overflow-hidden mb-4 border border-white/10 group">
        <img src={preview} alt="Captured" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
        <button
          onClick={handleClear}
          className="absolute top-3 right-3 bg-black/60 text-white p-2 rounded-full hover:bg-red-500/80 transition-colors backdrop-blur-sm border border-white/10"
        >
          <X size={18} />
        </button>
        <div className="absolute bottom-3 left-3 px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 text-cyan-200 text-xs font-bold rounded-lg backdrop-blur-md">
          IMAGE ATTACHED
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <input
        type="file"
        accept="image/*"
        capture="environment"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="w-full flex items-center justify-center gap-3 py-6 border border-dashed border-white/20 rounded-xl text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 hover:bg-white/5 transition-all group glass-panel"
      >
        <div className="p-2 bg-white/5 rounded-full group-hover:scale-110 transition-transform">
           <Camera size={24} className="group-hover:text-cyan-400" />
        </div>
        <span className="font-medium tracking-wide text-sm">UPLOAD VISUAL DATA</span>
      </button>
    </div>
  );
};
