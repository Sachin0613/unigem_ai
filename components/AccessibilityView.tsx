
import React, { useState } from 'react';
import { CameraInput } from './CameraInput';
import { analyzeAccessibility } from '../services/geminiService';
import { AccessibilityResponse } from '../types';
import { InstructionCard } from './InstructionCard';
import { Eye, Type, Loader2, Speaker, HelpCircle, Volume2 } from 'lucide-react';

export const AccessibilityView: React.FC = () => {
  const [showInstructions, setShowInstructions] = useState(true);
  const [text, setText] = useState('');
  const [imageB64, setImageB64] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AccessibilityResponse | null>(null);

  const handleAnalyze = async () => {
    if (!text && !imageB64) return;
    setLoading(true);
    try {
      const data = await analyzeAccessibility(text || "Describe this scene in detail", imageB64 || undefined);
      setResult(data);
    } catch (e) {
      alert("Error processing request.");
    } finally {
      setLoading(false);
    }
  };

  const speak = (content: string) => {
    const utterance = new SpeechSynthesisUtterance(content);
    window.speechSynthesis.speak(utterance);
  };

  if (showInstructions) {
    return (
      <InstructionCard
        title="Visual & Cognitive Assistant"
        subtitle="Scene Description, Navigation & Simplification"
        icon={<Eye size={32} className="text-purple-400" />}
        accentColor="purple"
        colorClass="text-purple-400"
        capabilities={[
          "Detailed Scene Description for Visually Impaired",
          "Real-time Hazard Detection & Navigation",
          "Text Simplification for Cognitive Support",
          "Visual Question Answering (VQA)"
        ]}
        tips={[
          "For navigation, hold camera steady to detect obstacles accurately.",
          "Use voice commands (via microphone) to ask questions about the scene.",
          "For text simplification, ensure the document is clearly visible.",
          "Use the 'Speaker' icon to hear the AI response read aloud."
        ]}
        onStart={() => setShowInstructions(false)}
      />
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 pb-20 animate-fade-in-up">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-4 bg-purple-500/10 rounded-2xl border border-purple-500/20">
          <Eye size={32} className="text-purple-400" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white neon-text">Vision & Cognition</h2>
          <p className="text-purple-200/50">Scene Description, Simplification & Visual QA</p>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-3xl border-purple-500/20 mb-8">
        <CameraInput onCapture={setImageB64} onClear={() => setImageB64(null)} hasImage={!!imageB64} />
        <div className="relative mt-4">
            <textarea
            className="glass-input w-full p-4 rounded-xl text-white placeholder-slate-500 text-lg"
            placeholder="Ask a question about the image or paste text to simplify..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            />
            {text.length === 0 && (
                <div className="absolute top-4 right-4 text-purple-400 opacity-50">
                    <HelpCircle size={24} />
                </div>
            )}
        </div>
        <button
          onClick={handleAnalyze}
          disabled={loading || (!text && !imageB64)}
          className="w-full mt-6 bg-purple-600 text-white font-bold py-4 rounded-xl hover:bg-purple-500 hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-all flex justify-center gap-3"
        >
          {loading ? <Loader2 className="animate-spin" /> : "PROCESS INPUT"}
        </button>
      </div>

      {result && (
        <div className="space-y-6 animate-fade-in-up">
            {result.directAnswer && (
                 <div className="glass-panel border-l-4 border-l-teal-400 p-6 rounded-r-3xl bg-teal-900/10">
                     <h3 className="font-bold text-teal-400 mb-2 text-sm uppercase">Direct Answer</h3>
                     <div className="flex justify-between items-start gap-4">
                        <p className="text-white text-xl font-light">{result.directAnswer}</p>
                        <button onClick={() => speak(result.directAnswer!)} className="p-3 bg-teal-500/20 hover:bg-teal-500/40 rounded-full transition-colors text-teal-300">
                            <Volume2 size={24} />
                        </button>
                     </div>
                 </div>
            )}

          {result.description && (
            <div className="glass-panel p-8 rounded-3xl border-purple-500/20 bg-purple-900/10">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-purple-300 flex items-center gap-2"><Eye size={18}/> SCENE ANALYSIS</h3>
                    <button onClick={() => speak(result.description)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-purple-300">
                        <Speaker size={20} />
                    </button>
                </div>
                <p className="text-lg leading-relaxed text-slate-200 font-light">{result.description}</p>
            </div>
          )}

          {result.simplifiedText && (
            <div className="glass-panel p-8 rounded-3xl border-yellow-500/20 bg-yellow-900/10">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-yellow-400 flex items-center gap-2">
                        <Type size={20} /> SIMPLIFIED TEXT
                    </h3>
                    <button onClick={() => speak(result.simplifiedText!)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-yellow-400">
                        <Volume2 size={20} />
                    </button>
                </div>
                <p className="text-2xl font-medium text-white leading-relaxed">{result.simplifiedText}</p>
            </div>
          )}
          
          {result.suggestedAction && (
             <div className="p-5 bg-blue-500/20 border border-blue-500/30 text-blue-200 rounded-xl font-medium text-center shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                 AI Suggestion: {result.suggestedAction}
             </div>
          )}
        </div>
      )}
    </div>
  );
};
