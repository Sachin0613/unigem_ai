
import React, { useState } from 'react';
import { CameraInput } from './CameraInput';
import { analyzeEducation } from '../services/geminiService';
import { EducationResponse } from '../types';
import { InstructionCard } from './InstructionCard';
import { GraduationCap, BookOpen, Loader2, Send, Calendar, CheckSquare, PenTool } from 'lucide-react';

export const EducationView: React.FC = () => {
  const [showInstructions, setShowInstructions] = useState(true);
  const [mode, setMode] = useState<'TUTOR' | 'PLAN' | 'GRADER'>('TUTOR');
  const [query, setQuery] = useState('');
  const [imageB64, setImageB64] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EducationResponse | null>(null);

  const handleAnalyze = async () => {
    if (!query && !imageB64) return;
    setLoading(true);
    setResult(null);
    try {
      const data = await analyzeEducation(query, imageB64 || undefined, mode);
      setResult(data);
    } catch (e) {
      alert("Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (showInstructions) {
    return (
      <InstructionCard
        title="Academic Copilot Guide"
        subtitle="Personalized Learning & Grading Assistant"
        icon={<GraduationCap size={32} className="text-blue-400" />}
        accentColor="blue"
        colorClass="text-blue-400"
        capabilities={[
          "Step-by-Step Concept Explanations",
          "Automated Essay & Homework Grading",
          "Personalized 5-Day Study Plan Generation",
          "Visual Problem Solving from Photos"
        ]}
        tips={[
          "For Math/Physics: Upload a clear photo of the problem for best accuracy.",
          "For Grading: Paste the full assignment text or rubric for precise feedback.",
          "For Study Plans: Specify your goal (e.g., 'Prepare for Calculus Final in 5 days').",
          "Use the Quiz mode to test your knowledge after learning a concept."
        ]}
        onStart={() => setShowInstructions(false)}
      />
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 pb-20 animate-fade-in-up">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20">
          <GraduationCap size={32} className="text-blue-400" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white neon-text">Personal Tutor</h2>
          <p className="text-blue-200/50">Adaptive Learning & Automated Grading</p>
        </div>
      </div>

      <div className="flex gap-2 md:gap-4 mb-6">
        <button onClick={() => { setMode('TUTOR'); setResult(null); }} className={`flex-1 py-3 md:py-4 rounded-xl font-bold text-[10px] md:text-sm tracking-wide transition-all ${mode === 'TUTOR' ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]' : 'glass-panel text-slate-400 hover:text-white'}`}>TUTOR</button>
        <button onClick={() => { setMode('PLAN'); setResult(null); }} className={`flex-1 py-3 md:py-4 rounded-xl font-bold text-[10px] md:text-sm tracking-wide transition-all ${mode === 'PLAN' ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]' : 'glass-panel text-slate-400 hover:text-white'}`}>STUDY PLAN</button>
        <button onClick={() => { setMode('GRADER'); setResult(null); }} className={`flex-1 py-3 md:py-4 rounded-xl font-bold text-[10px] md:text-sm tracking-wide transition-all ${mode === 'GRADER' ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]' : 'glass-panel text-slate-400 hover:text-white'}`}>AI GRADER</button>
      </div>

      <div className="glass-panel p-6 rounded-3xl border-blue-500/20 mb-8">
        <textarea
          className="glass-input w-full p-4 rounded-xl h-32 text-white placeholder-slate-500 mb-4"
          placeholder={mode === 'GRADER' ? "Describe the assignment rubric or valid answer key..." : "Ask a question, paste syllabus, or topics..."}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <CameraInput onCapture={setImageB64} onClear={() => setImageB64(null)} hasImage={!!imageB64} />
        <button
          onClick={handleAnalyze}
          disabled={loading || (!query && !imageB64)}
          className="w-full mt-4 bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-500 transition-all flex justify-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.3)]"
        >
          {loading ? <Loader2 className="animate-spin" /> : mode === 'GRADER' ? "GRADE ASSIGNMENT" : mode === 'PLAN' ? "GENERATE PLAN" : "GET HELP"}
        </button>
      </div>

      {result && (
        <div className="space-y-6 animate-fade-in-up">
          {/* GRADER VIEW */}
          {mode === 'GRADER' && result.grading && (
            <>
                <div className="glass-panel p-6 rounded-3xl border-white/10 flex items-center justify-between bg-black/40">
                    <div>
                        <h3 className="text-slate-400 font-bold text-sm uppercase">Grade Awarded</h3>
                        <p className="text-4xl font-black text-white">{result.grading.grade}</p>
                    </div>
                    <div className="p-4 bg-blue-500/10 rounded-full border border-blue-500/20">
                        <PenTool className="text-blue-400" size={24} />
                    </div>
                </div>

                <div className="glass-panel p-6 rounded-3xl border-blue-500/20">
                    <h3 className="font-bold text-blue-300 mb-4">Feedback Summary</h3>
                    <p className="text-slate-300 leading-relaxed font-light">{result.grading.feedback}</p>
                </div>

                {result.grading.corrections.length > 0 ? (
                    <div className="space-y-4">
                        <h3 className="font-bold text-white px-2">Corrections & Improvements</h3>
                        {result.grading.corrections.map((corr, idx) => (
                            <div key={idx} className="glass-panel p-5 rounded-2xl border-red-500/20 bg-red-900/5">
                                <div className="flex gap-4 mb-2">
                                    <div className="w-1 bg-red-500 rounded-full"></div>
                                    <div>
                                        <p className="text-xs text-red-400 font-bold uppercase mb-1">Original Issue</p>
                                        <p className="text-slate-300 text-sm line-through opacity-70 mb-2">"{corr.original}"</p>
                                        <p className="text-xs text-emerald-400 font-bold uppercase mb-1">Suggested Fix</p>
                                        <p className="text-white text-sm font-medium mb-2">"{corr.correction}"</p>
                                        <p className="text-xs text-slate-500 bg-black/30 p-2 rounded">Note: {corr.reason}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center text-emerald-400 font-bold">
                        Excellent work! No major corrections found.
                    </div>
                )}
            </>
          )}

          {/* TUTOR VIEW */}
          {mode === 'TUTOR' && result.explanation && (
            <div className="glass-panel p-8 rounded-3xl border-white/10">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2 text-lg"><BookOpen size={20}/> Concept Explanation</h3>
                <p className="text-slate-300 leading-relaxed font-light text-lg">{result.explanation}</p>
            </div>
          )}

          {mode === 'TUTOR' && result.quizQuestions && result.quizQuestions.length > 0 && (
            <div className="glass-panel p-6 rounded-3xl bg-blue-900/10 border-blue-500/20">
              <h3 className="font-bold text-blue-300 mb-4">Quick Quiz</h3>
              <ul className="space-y-3">
                {result.quizQuestions.map((q, idx) => (
                  <li key={idx} className="flex gap-3 text-blue-100 text-sm p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <span className="font-bold text-blue-400">Q{idx + 1}.</span> {q}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* PLANNER VIEW */}
          {mode === 'PLAN' && result.studyPlan && (
            <div className="space-y-4">
               {result.studyPlan.map((day, i) => (
                   <div key={i} className="glass-panel p-5 rounded-2xl border-white/5 hover:border-blue-500/30 transition-all">
                       <div className="flex items-center gap-3 mb-3">
                           <div className="bg-blue-500/20 text-blue-400 p-2 rounded-lg">
                               <Calendar size={18} />
                           </div>
                           <h4 className="font-bold text-white">{day.day}: {day.focus}</h4>
                       </div>
                       <ul className="pl-12 space-y-2">
                           {day.tasks.map((t, j) => (
                               <li key={j} className="flex items-center gap-2 text-sm text-slate-400">
                                   <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                   {t}
                               </li>
                           ))}
                       </ul>
                   </div>
               ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
