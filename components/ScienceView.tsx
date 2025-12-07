
import React, { useState } from 'react';
import { CameraInput } from './CameraInput';
import { analyzeScience } from '../services/geminiService';
import { ScienceResponse } from '../types';
import { InstructionCard } from './InstructionCard';
import { Microscope, FlaskConical, Loader2, Lightbulb, Table, FileText } from 'lucide-react';

export const ScienceView: React.FC = () => {
  const [showInstructions, setShowInstructions] = useState(true);
  const [mode, setMode] = useState<'ANALYSIS' | 'DATA'>('ANALYSIS');
  const [input, setInput] = useState('');
  const [imageB64, setImageB64] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScienceResponse | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setResult(null);
    try {
      const data = await analyzeScience(input, imageB64 || undefined, mode);
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
        title="Scientific Research Lab"
        subtitle="Literature Analysis & Data Extraction"
        icon={<Microscope size={32} className="text-cyan-400" />}
        accentColor="cyan"
        colorClass="text-cyan-400"
        capabilities={[
          "Research Paper Summarization & Hypothesis Generation",
          "Automated Data Extraction from Charts/Tables to Markdown",
          "Methodology Critique & Bias Detection",
          "Experiment Simulation & Safety Risk Analysis"
        ]}
        tips={[
          "Upload PDFs or images of charts for high-precision data extraction.",
          "For literature review, paste the abstract or methodology section.",
          "Use 'Data Extraction' to convert screenshot tables into editable formats.",
          "Verify extracted data points against the original source."
        ]}
        onStart={() => setShowInstructions(false)}
      />
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 pb-20 animate-fade-in-up">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-4 bg-cyan-500/10 rounded-2xl border border-cyan-500/20">
          <Microscope size={32} className="text-cyan-400" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white neon-text">Scientific Analyst</h2>
          <p className="text-cyan-200/50">Literature Mapping & Data Digitization</p>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <button
            onClick={() => { setMode('ANALYSIS'); setResult(null); }}
            className={`flex-1 py-4 rounded-xl font-bold text-sm tracking-wide transition-all ${mode === 'ANALYSIS' ? 'bg-cyan-600 text-white shadow-[0_0_20px_rgba(6,182,212,0.3)]' : 'glass-panel text-slate-400 hover:text-white'}`}
        >
            LITERATURE ANALYSIS
        </button>
        <button
            onClick={() => { setMode('DATA'); setResult(null); }}
            className={`flex-1 py-4 rounded-xl font-bold text-sm tracking-wide transition-all ${mode === 'DATA' ? 'bg-cyan-600 text-white shadow-[0_0_20px_rgba(6,182,212,0.3)]' : 'glass-panel text-slate-400 hover:text-white'}`}
        >
            DATA EXTRACTION
        </button>
      </div>

      <div className="glass-panel p-6 rounded-3xl border-cyan-500/20 mb-8">
        <textarea
          className="glass-input w-full p-4 rounded-xl h-40 font-mono text-sm text-cyan-100 placeholder-cyan-800/50 mb-4"
          placeholder={mode === 'ANALYSIS' ? "Paste abstract, methodology, or upload paper..." : "Upload chart image or paste data table..."}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <CameraInput onCapture={setImageB64} onClear={() => setImageB64(null)} hasImage={!!imageB64} />
        <button
          onClick={handleAnalyze}
          disabled={loading || (!input && !imageB64)}
          className="w-full mt-4 bg-cyan-600 text-white font-bold py-4 rounded-xl hover:bg-cyan-500 transition-all flex justify-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" /> : mode === 'ANALYSIS' ? "ANALYZE RESEARCH" : "DIGITIZE VISUAL DATA"}
        </button>
      </div>

      {result && (
        <div className="space-y-6 animate-fade-in-up">
          {result.extractedData && (
              <div className="glass-panel overflow-hidden rounded-3xl border-cyan-500/30">
                  <div className="bg-cyan-900/20 px-6 py-4 border-b border-cyan-500/20 flex items-center justify-between">
                      <h3 className="font-bold text-cyan-400 flex items-center gap-2"><Table size={18}/> {result.extractedData.title}</h3>
                      <span className="text-xs bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded border border-cyan-500/30">MARKDOWN</span>
                  </div>
                  <pre className="p-6 bg-black/40 text-xs overflow-x-auto text-cyan-300 font-mono">
                      {result.extractedData.markdownTable}
                  </pre>
                  <div className="p-6">
                      <h4 className="font-bold text-white text-sm mb-3">Key Data Insights</h4>
                      <ul className="space-y-2">
                          {result.extractedData.insights.map((insight, i) => (
                              <li key={i} className="flex gap-2 text-slate-300 text-sm"><span className="text-cyan-500">›</span> {insight}</li>
                          ))}
                      </ul>
                  </div>
              </div>
          )}

          {result.summary && (
            <div className="glass-panel p-8 rounded-3xl border-white/10">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2 text-lg"><FileText size={20}/> Executive Summary</h3>
                <p className="text-slate-300 leading-relaxed font-light text-lg">{result.summary}</p>
            </div>
          )}

          {result.hypotheses && (
            <div className="grid md:grid-cols-2 gap-6">
                <div className="glass-panel p-6 rounded-3xl bg-indigo-900/10 border-indigo-500/20">
                    <h3 className="font-bold text-indigo-300 mb-4 flex items-center gap-2">
                        <Lightbulb size={18} /> Generated Hypotheses
                    </h3>
                    <ul className="space-y-3 text-sm text-indigo-100/80">
                        {result.hypotheses.map((h, i) => (
                            <li key={i} className="flex gap-2"><span className="opacity-50">•</span> {h}</li>
                        ))}
                    </ul>
                </div>
                
                <div className="glass-panel p-6 rounded-3xl bg-cyan-900/10 border-cyan-500/20">
                    <h3 className="font-bold text-cyan-300 mb-4 flex items-center gap-2">
                        <FlaskConical size={18} /> Key Findings
                    </h3>
                    <ul className="space-y-3 text-sm text-cyan-100/80">
                        {result.keyLiteraturePoints?.map((p, i) => (
                            <li key={i} className="flex gap-2"><span className="opacity-50">•</span> {p}</li>
                        ))}
                    </ul>
                </div>
            </div>
          )}
          
          {result.methodologyCritique && (
              <div className="p-6 border border-red-500/30 bg-red-900/10 rounded-3xl text-red-200 text-sm backdrop-blur-md">
                  <span className="font-bold text-red-400 block mb-2 uppercase tracking-wide">Methodology Critique</span>
                  {result.methodologyCritique}
              </div>
          )}
        </div>
      )}
    </div>
  );
};
