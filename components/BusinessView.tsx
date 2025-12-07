
import React, { useState } from 'react';
import { CameraInput } from './CameraInput';
import { analyzeBusiness } from '../services/geminiService';
import { BusinessResponse } from '../types';
import { InstructionCard } from './InstructionCard';
import { Briefcase, TrendingUp, Loader2, GitMerge, Users, CheckSquare, Clock } from 'lucide-react';

export const BusinessView: React.FC = () => {
  const [showInstructions, setShowInstructions] = useState(true);
  const [mode, setMode] = useState<'WORKFLOW' | 'MEETING'>('WORKFLOW');
  const [input, setInput] = useState('');
  const [imageB64, setImageB64] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BusinessResponse | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setResult(null);
    try {
      const data = await analyzeBusiness(input, imageB64 || undefined, mode);
      setResult(data);
    } catch (e) {
      alert("Analysis failed.");
    } finally {
      setLoading(false);
    }
  };

  if (showInstructions) {
    return (
      <InstructionCard
        title="Business Operations Suite"
        subtitle="Workflow Optimization & Meeting Intelligence"
        icon={<Briefcase size={32} className="text-amber-400" />}
        accentColor="amber"
        colorClass="text-amber-400"
        capabilities={[
          "Workflow Bottleneck Analysis & Automation Suggestions",
          "Automated Meeting Minutes & Action Item Extraction",
          "Legal Contract Risk Analysis & Red Flag Detection",
          "Operational Efficiency Consulting"
        ]}
        tips={[
          "For meetings: Upload a transcript or image of whiteboard notes.",
          "For contracts: Remove sensitive PII before uploading.",
          "Be specific about the industry context for better workflow advice.",
          "Use 'Workflow Ops' to find automation opportunities in manual processes."
        ]}
        onStart={() => setShowInstructions(false)}
      />
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 pb-20 animate-fade-in-up">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20">
          <Briefcase size={32} className="text-amber-400" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white neon-text">Business Analyst</h2>
          <p className="text-amber-200/50">Workflow Optimization & Meeting Intelligence</p>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <button
            onClick={() => { setMode('WORKFLOW'); setResult(null); }}
            className={`flex-1 py-4 rounded-xl font-bold text-sm tracking-wide transition-all ${mode === 'WORKFLOW' ? 'bg-amber-600 text-white shadow-[0_0_20px_rgba(217,119,6,0.3)]' : 'glass-panel text-slate-400 hover:text-white'}`}
        >
            WORKFLOW OPS
        </button>
        <button
            onClick={() => { setMode('MEETING'); setResult(null); }}
            className={`flex-1 py-4 rounded-xl font-bold text-sm tracking-wide transition-all ${mode === 'MEETING' ? 'bg-amber-600 text-white shadow-[0_0_20px_rgba(217,119,6,0.3)]' : 'glass-panel text-slate-400 hover:text-white'}`}
        >
            MINUTES GEN
        </button>
      </div>

      <div className="glass-panel p-6 rounded-3xl border-amber-500/20 mb-8">
        <textarea
            className="glass-input w-full p-4 rounded-xl h-32 mb-4 text-white placeholder-slate-500"
            placeholder={mode === 'WORKFLOW' ? "Describe process or upload flowchart..." : "Paste meeting transcript or upload notes..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
        />
        <CameraInput onCapture={setImageB64} onClear={() => setImageB64(null)} hasImage={!!imageB64} />
        <button
            onClick={handleAnalyze}
            disabled={loading || (!input && !imageB64)}
            className="w-full mt-4 bg-amber-600 text-white font-bold py-4 rounded-xl hover:bg-amber-500 transition-all flex justify-center gap-2 shadow-lg"
        >
            {loading ? <Loader2 className="animate-spin" /> : mode === 'WORKFLOW' ? "OPTIMIZE FLOW" : "PROCESS TRANSCRIPT"}
        </button>
      </div>

      {result && (
        <div className="space-y-6 animate-fade-in-up">
            {result.workflowAnalysis && (
                <div className="glass-panel p-6 rounded-3xl border-white/10">
                    <h3 className="font-bold text-white mb-3 text-lg">Workflow Assessment</h3>
                    <p className="text-slate-300 leading-relaxed font-light">{result.workflowAnalysis}</p>
                </div>
            )}

            {result.bottlenecks && (
                 <div className="grid md:grid-cols-2 gap-6">
                    <div className="glass-panel p-6 rounded-3xl border-red-500/30 bg-red-900/10">
                        <h3 className="font-bold text-red-400 mb-4 flex items-center gap-2">
                            <TrendingUp size={18} className="rotate-180" /> BOTTLENECKS
                        </h3>
                        <ul className="space-y-2 text-sm text-red-200/80">
                            {result.bottlenecks.map((b, i) => <li key={i} className="flex gap-2"><span className="text-red-500">×</span> {b}</li>)}
                        </ul>
                    </div>
                    
                    <div className="glass-panel p-6 rounded-3xl border-emerald-500/30 bg-emerald-900/10">
                        <h3 className="font-bold text-emerald-400 mb-4 flex items-center gap-2">
                            <GitMerge size={18} /> AUTOMATION
                        </h3>
                        <ul className="space-y-2 text-sm text-emerald-200/80">
                            {result.automationSuggestions?.map((a, i) => <li key={i} className="flex gap-2"><span className="text-emerald-500">✓</span> {a}</li>)}
                        </ul>
                    </div>
                </div>
            )}

            {result.meetingSummary && (
                <div className="space-y-4">
                    <div className="glass-panel p-6 rounded-3xl border-white/10">
                         <div className="flex items-center gap-3 mb-4">
                             <Users className="text-amber-400" size={20} />
                             <span className="font-bold text-white">Participants:</span>
                             <span className="text-slate-400 text-sm">{result.meetingSummary.participants.join(", ")}</span>
                         </div>
                         <div className="mb-2">
                             <h4 className="font-bold text-amber-100 mb-3">Key Decisions</h4>
                             <ul className="space-y-2 pl-4 text-slate-300 text-sm list-disc marker:text-amber-500">
                                 {result.meetingSummary.decisions.map((d,i) => <li key={i}>{d}</li>)}
                             </ul>
                         </div>
                    </div>
                    
                    <div className="glass-panel p-6 rounded-3xl border-blue-500/20 bg-blue-900/10">
                        <h4 className="font-bold text-blue-300 mb-4 flex items-center gap-2"><CheckSquare size={18}/> ACTION ITEMS</h4>
                        <div className="space-y-3">
                            {result.meetingSummary.actionItems.map((item, idx) => (
                                <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between bg-black/20 p-4 rounded-xl border border-white/5 hover:border-blue-500/30 transition-colors">
                                    <div className="flex-1">
                                        <p className="text-white font-medium text-sm">{item.task}</p>
                                        <p className="text-xs text-slate-500 mt-1">Owner: <span className="font-bold text-blue-400">{item.owner}</span></p>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-bold text-amber-400 mt-2 sm:mt-0 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                                        <Clock size={12}/> {item.deadline}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
      )}
    </div>
  );
};
