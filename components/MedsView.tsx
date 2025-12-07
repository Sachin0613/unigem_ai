
import React, { useState } from 'react';
import { CameraInput } from './CameraInput';
import { analyzeMeds } from '../services/geminiService';
import { MedsResponse } from '../types';
import { Pill, AlertOctagon, FileText, Loader2 } from 'lucide-react';

export const MedsView: React.FC = () => {
  const [input, setInput] = useState('');
  const [imageB64, setImageB64] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MedsResponse | null>(null);

  const handleAnalyze = async () => {
    if (!input && !imageB64) return;
    setLoading(true);
    setResult(null);
    try {
      const data = await analyzeMeds(input, imageB64 || undefined);
      setResult(data);
    } catch (e) {
      alert("Analysis failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto pb-20 pt-4">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2 neon-text">
            <Pill className="text-teal-400" /> Pharma-Scan
        </h2>
        <p className="text-teal-200/50 text-sm">Prescription Decoder & Interaction Checker</p>
      </div>

      {!result && (
        <div className="glass-panel p-6 rounded-3xl border-teal-500/20 space-y-6">
            <textarea
                className="glass-input w-full p-4 rounded-xl h-32 text-white placeholder-slate-500"
                placeholder="List medicines here or scan prescription/bottles..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />
            
            <CameraInput onCapture={setImageB64} onClear={() => setImageB64(null)} hasImage={!!imageB64} />

            <button
                onClick={handleAnalyze}
                disabled={loading || (!input && !imageB64)}
                className="w-full bg-teal-600 text-white font-bold py-4 rounded-xl hover:bg-teal-500 shadow-[0_0_20px_rgba(20,184,166,0.3)] transition-all flex items-center justify-center gap-2"
            >
                {loading ? <Loader2 className="animate-spin" /> : "ANALYZE MEDS"}
            </button>
        </div>
      )}

      {result && (
        <div className="space-y-6 animate-fade-in-up">
            <div className="glass-panel p-6 rounded-3xl border-white/10">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                    <FileText className="text-teal-400" size={18} /> Simplified Instructions
                </h3>
                <p className="text-lg leading-relaxed text-slate-200 font-light">{result.simplifiedInstructions}</p>
            </div>

            {result.warnings.length > 0 ? (
                <div className="glass-panel p-6 rounded-3xl border-red-500/30 bg-red-900/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <AlertOctagon size={100} className="text-red-500" />
                    </div>
                    <h3 className="font-bold text-red-400 mb-4 flex items-center gap-2 relative z-10">
                        <AlertOctagon size={20} /> INTERACTION WARNINGS
                    </h3>
                    <ul className="space-y-3 relative z-10">
                        {result.warnings.map((w, idx) => (
                            <li key={idx} className="flex gap-3 text-red-200 font-medium">
                                <span className="text-red-500 font-bold">!</span> {w}
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-center text-sm font-bold">
                    NO DANGEROUS INTERACTIONS DETECTED
                </div>
            )}

            <div className="glass-panel p-6 rounded-3xl border-teal-500/10">
                 <h3 className="font-bold text-teal-200 mb-3 text-sm uppercase">Identified Items</h3>
                 <div className="flex flex-wrap gap-2">
                     {result.identifiedItems.map((item, i) => (
                         <span key={i} className="px-3 py-1 bg-teal-500/10 border border-teal-500/20 rounded-full text-teal-300 text-xs">
                             {item}
                         </span>
                     ))}
                 </div>
            </div>
            
            <button 
                onClick={() => { setResult(null); setInput(''); setImageB64(null); }}
                className="w-full py-3 text-slate-500 text-xs font-bold hover:text-white transition-colors tracking-widest"
            >
                SCAN NEXT BATCH
            </button>
        </div>
      )}
    </div>
  );
};
