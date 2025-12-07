import React from 'react';
import { ArrowRight, Info, CheckCircle, AlertTriangle } from 'lucide-react';

interface InstructionCardProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  capabilities: string[];
  tips: string[];
  onStart: () => void;
  colorClass: string; // e.g., "text-emerald-400" or "bg-emerald-500"
  accentColor: string; // e.g. "emerald"
}

export const InstructionCard: React.FC<InstructionCardProps> = ({
  title,
  subtitle,
  icon,
  capabilities,
  tips,
  onStart,
  colorClass,
  accentColor
}) => {
  return (
    <div className="max-w-2xl mx-auto p-1 animate-fade-in-up">
      <div className={`glass-panel rounded-3xl overflow-hidden border-${accentColor}-500/30`}>
        {/* Header */}
        <div className={`p-8 bg-gradient-to-b from-${accentColor}-900/20 to-transparent border-b border-white/5`}>
          <div className="flex items-center gap-4 mb-4">
            <div className={`p-4 rounded-2xl bg-${accentColor}-500/10 border border-${accentColor}-500/20`}>
              {icon}
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white tracking-tight">{title}</h2>
              <p className={`text-${accentColor}-200/60 font-medium`}>{subtitle}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          
          {/* Capabilities Section */}
          <div>
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <Info size={18} className={colorClass} /> 
              KEY CAPABILITIES
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {capabilities.map((cap, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className={`mt-1 w-1.5 h-1.5 rounded-full bg-${accentColor}-400 shadow-[0_0_5px_currentColor]`} />
                  <span className="text-slate-300 text-sm leading-snug">{cap}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tips Section */}
          <div className={`p-6 rounded-2xl bg-${accentColor}-900/10 border border-${accentColor}-500/20`}>
             <h3 className={`font-bold text-${accentColor}-300 mb-4 flex items-center gap-2`}>
              <CheckCircle size={18} /> 
              FOR BEST RESULTS
            </h3>
            <ul className="space-y-3">
              {tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                  <span className={`text-${accentColor}-500 font-bold`}>•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
          
          {/* Disclaimer (Static for all) */}
          <div className="flex gap-3 items-start text-xs text-slate-500 px-2">
            <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
            <p>AI responses can vary. Always verify critical information, especially for health, safety, and legal matters.</p>
          </div>

          {/* Action Button */}
          <button
            onClick={onStart}
            className={`w-full py-5 rounded-xl font-bold text-lg tracking-wide flex items-center justify-center gap-3 transition-all hover:scale-[1.02] shadow-lg bg-gradient-to-r from-${accentColor}-600 to-${accentColor}-500 text-white hover:shadow-${accentColor}-500/30`}
          >
            INITIALIZE MODULE <ArrowRight size={20} />
          </button>

        </div>
      </div>
    </div>
  );
};
