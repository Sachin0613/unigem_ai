
import React, { useState } from 'react';
import { analyzeTech } from '../services/geminiService';
import { TechResponse } from '../types';
import { InstructionCard } from './InstructionCard';
import { Terminal, Code, Play, Loader2, Copy, Bug, Wrench } from 'lucide-react';

export const TechView: React.FC = () => {
  const [showInstructions, setShowInstructions] = useState(true);
  const [mode, setMode] = useState<'REFACTOR' | 'DEBUG'>('REFACTOR');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TechResponse | null>(null);

  const handleAnalyze = async () => {
    if (!code) return;
    setLoading(true);
    setResult(null);
    try {
      const data = await analyzeTech(code, mode);
      setResult(data);
    } catch (e) {
      alert("Error.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  if (showInstructions) {
    return (
      <InstructionCard
        title="Technical Dev Copilot"
        subtitle="Code Refactoring, Debugging & Security"
        icon={<Terminal size={32} className="text-pink-400" />}
        accentColor="pink"
        colorClass="text-pink-400"
        capabilities={[
          "Repo-Scale Code Modernization & Refactoring",
          "Automated Unit Test Generation (Edge Cases included)",
          "Deep Debugging with Root Cause Analysis",
          "Security Vulnerability Scanning (OWASP)"
        ]}
        tips={[
          "Paste the full function or class context for accurate refactoring.",
          "For debugging, include the error stack trace along with the code.",
          "Check 'Security Audit' for potential SQLi or XSS vulnerabilities.",
          "Review generated test cases to ensure they cover business logic."
        ]}
        onStart={() => setShowInstructions(false)}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 pb-20 animate-fade-in-up">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-4 bg-pink-500/10 rounded-2xl border border-pink-500/20">
          <Terminal size={32} className="text-pink-400" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white neon-text">Dev Copilot</h2>
          <p className="text-pink-200/50">Modernization & Debugging Agent</p>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <button
            onClick={() => { setMode('REFACTOR'); setResult(null); }}
            className={`flex-1 py-4 rounded-xl font-bold text-sm tracking-wide transition-all ${mode === 'REFACTOR' ? 'bg-pink-600 text-white shadow-[0_0_20px_rgba(219,39,119,0.3)]' : 'glass-panel text-slate-400 hover:text-white'}`}
        >
            REFACTOR CODE
        </button>
        <button
            onClick={() => { setMode('DEBUG'); setResult(null); }}
            className={`flex-1 py-4 rounded-xl font-bold text-sm tracking-wide transition-all ${mode === 'DEBUG' ? 'bg-pink-600 text-white shadow-[0_0_20px_rgba(219,39,119,0.3)]' : 'glass-panel text-slate-400 hover:text-white'}`}
        >
            DEBUG AGENT
        </button>
      </div>

      <div className="mb-8 relative group">
        <div className="absolute top-0 left-0 w-full bg-black/60 backdrop-blur text-pink-400 text-xs px-4 py-2 rounded-t-xl flex justify-between border-b border-pink-500/20 z-10 font-mono">
            <span>{mode === 'REFACTOR' ? 'INPUT_SOURCE.ts' : 'ERROR_LOG.txt'}</span>
            <Code size={14} />
        </div>
        <textarea
            className="w-full pt-12 p-6 bg-black/40 text-cyan-300 font-mono text-sm rounded-xl focus:ring-1 focus:ring-pink-500 focus:outline-none min-h-[300px] border border-white/10 glass-panel"
            placeholder={mode === 'REFACTOR' ? "// Paste legacy code to modernize..." : "Exception in thread 'main'..."}
            value={code}
            onChange={(e) => setCode(e.target.value)}
        />
        <button
            onClick={handleAnalyze}
            disabled={loading || !code}
            className="absolute bottom-4 right-4 bg-pink-600 text-white p-4 rounded-xl hover:bg-pink-500 shadow-[0_0_20px_rgba(219,39,119,0.4)] disabled:opacity-50 transition-all hover:scale-105"
        >
            {loading ? <Loader2 className="animate-spin" /> : <Play size={20} fill="currentColor" />}
        </button>
      </div>

      {result && (
        <div className="space-y-6 animate-fade-in-up">
            {/* Refactor Result */}
            {result.codeAnalysis && (
                 <div className="glass-panel p-6 rounded-3xl border-white/10">
                    <h3 className="font-bold text-white mb-3 text-lg">Analysis</h3>
                    <p className="text-slate-300 text-sm leading-relaxed">{result.codeAnalysis}</p>
                </div>
            )}

            {result.refactoredCode && (
                <div>
                    <h3 className="font-bold text-white mb-4">Refactored Output</h3>
                    <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                        <div className="bg-black/60 px-4 py-3 flex justify-between items-center border-b border-white/5 backdrop-blur-md">
                            <span className="text-emerald-400 text-xs font-mono font-bold">OPTIMIZED_BUILD.ts</span>
                            <button className="text-slate-400 hover:text-white transition-colors" onClick={() => copyToClipboard(result.refactoredCode!)}><Copy size={16}/></button>
                        </div>
                        <pre className="p-6 bg-[#0a0a0a] text-emerald-300 overflow-x-auto text-sm font-mono leading-relaxed">
                            <code>{result.refactoredCode}</code>
                        </pre>
                    </div>
                </div>
            )}

            {result.testCases && (
                <div className="glass-panel p-6 rounded-3xl bg-slate-900/50">
                    <h3 className="font-bold text-white mb-4">Generated Test Suite</h3>
                    <ul className="space-y-2">
                        {result.testCases.map((tc, i) => (
                            <li key={i} className="flex gap-3 text-sm text-slate-300 font-mono items-center">
                                <span className="text-emerald-500 font-bold">PASS</span> {tc}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Debug Result */}
            {result.bugAnalysis && (
                <div className="space-y-4">
                    <div className="glass-panel p-6 rounded-3xl border-red-500/30 bg-red-900/10">
                        <h3 className="font-bold text-red-400 mb-3 flex items-center gap-2 text-lg"><Bug size={20}/> Root Cause</h3>
                        <p className="text-red-200 text-sm leading-relaxed">{result.bugAnalysis.rootCause}</p>
                    </div>
                    
                    <div className="glass-panel p-6 rounded-3xl border-white/10">
                        <h3 className="font-bold text-white mb-2">Technical Explanation</h3>
                        <p className="text-slate-400 text-sm font-light">{result.bugAnalysis.fixExplanation}</p>
                    </div>

                    <div className="rounded-2xl overflow-hidden border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                         <div className="bg-emerald-900/30 px-4 py-3 flex justify-between items-center border-b border-emerald-500/20 backdrop-blur-md">
                            <span className="text-emerald-400 font-bold text-xs flex items-center gap-2 font-mono"><Wrench size={14}/> HOTFIX_PATCH</span>
                            <button className="text-emerald-400/50 hover:text-emerald-400" onClick={() => copyToClipboard(result.bugAnalysis!.fixedSnippet)}><Copy size={16}/></button>
                        </div>
                        <pre className="p-6 bg-black text-emerald-300 overflow-x-auto font-mono text-sm">
                            <code>{result.bugAnalysis.fixedSnippet}</code>
                        </pre>
                    </div>
                </div>
            )}
        </div>
      )}
    </div>
  );
};
