
import React, { useState } from 'react';
import { TriageView } from './TriageView';
import { ChronicView } from './ChronicView';
import { MedsView } from './MedsView';
import { InstructionCard } from './InstructionCard';
import { Heart, Activity, Pill, Stethoscope } from 'lucide-react';

export const HealthWrapper: React.FC = () => {
  const [showInstructions, setShowInstructions] = useState(true);
  const [mode, setMode] = useState<'TRIAGE' | 'CHRONIC' | 'MEDS'>('TRIAGE');

  if (showInstructions) {
    return (
      <InstructionCard
        title="Health Copilot Protocol"
        subtitle="Advanced Medical Triage & Management"
        icon={<Heart size={32} className="text-emerald-400" />}
        accentColor="emerald"
        colorClass="text-emerald-400"
        capabilities={[
          "Acute Symptom Triage & Urgency Assessment",
          "Chronic Disease Tracking & Lifestyle Coaching",
          "Prescription Scanning & Interaction Checks",
          "Multimodal Analysis (Voice, Image, Text)"
        ]}
        tips={[
          "For skin conditions, ensure photos are well-lit and focused.",
          "Speak clearly when recording voice notes for triage.",
          "Double-check all AI-generated medication advice with a professional.",
          "Use 'Chronic Care' for long-term tracking of diabetes or hypertension."
        ]}
        onStart={() => setShowInstructions(false)}
      />
    );
  }

  return (
    <div className="pb-20">
      {/* Neon Segmented Toggle */}
      <div className="max-w-xl mx-auto flex p-1 bg-black/40 border border-white/10 rounded-2xl mb-8 backdrop-blur-md overflow-hidden">
        <button
          onClick={() => setMode('TRIAGE')}
          className={`flex-1 py-3 text-[10px] md:text-xs font-bold transition-all duration-300 rounded-xl ${
            mode === 'TRIAGE' 
            ? 'bg-emerald-500/20 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)] border border-emerald-500/30' 
            : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          ACUTE TRIAGE
        </button>
        <button
          onClick={() => setMode('CHRONIC')}
          className={`flex-1 py-3 text-[10px] md:text-xs font-bold transition-all duration-300 rounded-xl ${
            mode === 'CHRONIC' 
            ? 'bg-emerald-500/20 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)] border border-emerald-500/30' 
            : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          CHRONIC CARE
        </button>
        <button
          onClick={() => setMode('MEDS')}
          className={`flex-1 py-3 text-[10px] md:text-xs font-bold transition-all duration-300 rounded-xl ${
            mode === 'MEDS' 
            ? 'bg-emerald-500/20 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)] border border-emerald-500/30' 
            : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          PHARMA-SCAN
        </button>
      </div>

      <div className="animate-fade-in-up">
          {mode === 'TRIAGE' && <TriageView />}
          {mode === 'CHRONIC' && <ChronicView />}
          {mode === 'MEDS' && <MedsView />}
      </div>
    </div>
  );
};
