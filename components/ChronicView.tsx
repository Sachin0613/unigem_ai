import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { CameraInput } from './CameraInput';
import { analyzeChronicLog } from '../services/geminiService';
import { ChronicCareResponse } from '../types';
import { Activity, Pill, Upload, Loader2, ArrowRight } from 'lucide-react';

export const ChronicView: React.FC = () => {
  const [notes, setNotes] = useState('');
  const [imageB64, setImageB64] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ChronicCareResponse | null>(null);

  const handleSubmit = async () => {
    if (!notes && !imageB64) return;
    setLoading(true);
    try {
      const data = await analyzeChronicLog(notes, imageB64 || undefined);
      setResult(data);
    } catch (e) {
      alert("Analysis failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto pb-20">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-2 neon-text">Chronic Care Coach</h2>
        <p className="text-teal-200/50">Longitudinal Monitoring & Micro-Interventions</p>
      </div>

      {!result && (
        <div className="glass-panel p-6 rounded-3xl border-teal-500/20 space-y-6">
            <textarea
                className="glass-input w-full p-4 rounded-xl h-32 text-white placeholder-slate-500"
                placeholder="Log patient vitals, mood, or diet..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
            />
            
            <CameraInput onCapture={setImageB64} onClear={() => setImageB64(null)} hasImage={!!imageB64} />

            <button
                onClick={handleSubmit}
                disabled={loading || (!notes && !imageB64)}
                className="w-full bg-teal-500 text-black font-bold py-4 rounded-xl hover:bg-teal-400 shadow-[0_0_20px_rgba(20,184,166,0.3)] transition-all flex items-center justify-center gap-2"
            >
                {loading ? <Loader2 className="animate-spin" /> : <Upload size={20} />}
                {loading ? "ANALYZING..." : "UPDATE RECORD"}
            </button>
        </div>
      )}

      {result && (
        <div className="space-y-6 animate-fade-in-up">
            <div className="bg-gradient-to-br from-teal-900/50 to-emerald-900/50 p-6 rounded-3xl border border-teal-500/30 backdrop-blur-md">
                <div className="flex items-center gap-3 mb-3">
                    <Activity className="text-teal-300" />
                    <h3 className="font-bold text-lg text-teal-100">Patient Status</h3>
                </div>
                <p className="leading-relaxed text-teal-50/90 font-light">{result.patientStatusSummary}</p>
            </div>

            {result.metrics.length > 0 && (
                <div className="glass-panel p-6 rounded-3xl border-white/5">
                    <h3 className="font-bold text-white mb-6 text-sm uppercase tracking-widest">Vitals Trend</h3>
                    <div className="h-56 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={result.metrics}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="date" tick={{fontSize: 10, fill: '#64748b'}} stroke="transparent" />
                                <YAxis tick={{fontSize: 10, fill: '#64748b'}} stroke="transparent" />
                                <Tooltip 
                                    contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
                                />
                                <Line type="monotone" dataKey="value" stroke="#2dd4bf" strokeWidth={3} dot={{r: 4, fill: '#2dd4bf', strokeWidth: 0}} activeDot={{r: 6, fill: '#fff'}} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            <div className="glass-panel p-6 rounded-3xl border-white/5">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2 text-sm uppercase tracking-widest">
                    <Pill className="text-teal-400" size={18} /> Daily Plan
                </h3>
                <ul className="space-y-3">
                    {result.dailyTasks.map((task, idx) => (
                        <li key={idx} className="flex items-center gap-4 p-3 bg-white/5 rounded-xl border border-white/5">
                            <div className="w-2 h-2 rounded-full bg-teal-400 shadow-[0_0_8px_#2dd4bf]"></div>
                            <span className="text-slate-300 text-sm">{task}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <button 
                onClick={() => { setResult(null); setNotes(''); setImageB64(null); }}
                className="w-full py-4 text-slate-500 font-medium hover:text-white transition-colors uppercase tracking-widest text-xs"
            >
                Start New Log
            </button>
        </div>
      )}
    </div>
  );
};
