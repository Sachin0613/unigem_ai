import React, { useState } from 'react';
import { CameraInput } from './CameraInput';
import { VoiceRecorder } from './VoiceRecorder';
import { TriageCard } from './TriageCard';
import { analyzeTriageCase } from '../services/geminiService';
import { TriageResponse } from '../types';
import { Stethoscope, Loader2, Send, Activity } from 'lucide-react';

export const TriageView: React.FC = () => {
  const [symptoms, setSymptoms] = useState('');
  const [imageB64, setImageB64] = useState<string | null>(null);
  const [audioB64, setAudioB64] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TriageResponse | null>(null);

  const handleTriage = async () => {
    if (!symptoms && !imageB64 && !audioB64) return;
    setLoading(true);
    try {
      const data = await analyzeTriageCase(symptoms, imageB64 || undefined, audioB64 || undefined);
      setResult(data);
    } catch (e) {
      alert("Analysis failed.");
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <div className="max-w-2xl mx-auto pb-20 pt-4">
        <button 
            onClick={() => { setResult(null); setSymptoms(''); setImageB64(null); setAudioB64(null); }}
            className="mb-6 px-4 py-2 glass-panel rounded-full text-xs text-cyan-400 hover:bg-cyan-500/20 font-bold uppercase tracking-widest transition-all"
        >
            ← Initialize New Case
        </button>
        <TriageCard data={result} />
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto pb-24 pt-8">
      <div className="text-center mb-10">
        <div className="w-20 h-20 glass-panel rounded-full flex items-center justify-center mx-auto mb-4 border border-teal-500/30 shadow-[0_0_20px_rgba(20,184,166,0.2)]">
            <Activity className="text-teal-400 w-10 h-10" />
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight mb-2">TRIAGE PROTOCOL</h1>
        <p className="text-teal-200/60 font-medium">Multimodal Diagnostic Assistant Active</p>
      </div>

      <div className="space-y-6">
        <VoiceRecorder onRecordingComplete={setAudioB64} onClear={() => setAudioB64(null)} />

        <div className="glass-panel p-1 rounded-2xl border-white/10">
            <textarea
                className="w-full p-5 bg-transparent text-white placeholder-slate-500 focus:outline-none resize-none h-40 text-lg rounded-xl"
                placeholder="Describe patient condition, vitals, and primary complaint..."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
            />
        </div>

        <CameraInput onCapture={setImageB64} onClear={() => setImageB64(null)} hasImage={!!imageB64} />
        
        <button
            onClick={handleTriage}
            disabled={loading || (!symptoms && !imageB64 && !audioB64)}
            className={`w-full py-5 rounded-xl font-black tracking-wider text-lg flex items-center justify-center gap-3 transition-all duration-300 ${
                loading 
                ? 'bg-slate-800 text-slate-500 cursor-wait' 
                : 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white hover:shadow-[0_0_30px_rgba(20,184,166,0.4)] hover:scale-[1.02]'
            }`}
        >
            {loading ? <><Loader2 className="animate-spin" /> PROCESSING DATA...</> : <><Send size={20} /> RUN ANALYSIS</>}
        </button>
      </div>
    </div>
  );
};
