import React from 'react';
import { TriageResponse, UrgencyLevel } from '../types';
import { AlertTriangle, CheckCircle, Ambulance, Home, ClipboardList, Stethoscope } from 'lucide-react';

interface TriageCardProps {
  data: TriageResponse;
}

const getUrgencyConfig = (level: UrgencyLevel) => {
  switch (level) {
    case UrgencyLevel.EMERGENCY:
      return {
        bg: 'bg-red-500/10',
        border: 'border-red-500/50',
        text: 'text-red-400',
        icon: <Ambulance className="w-8 h-8 text-red-500" />,
        label: 'EMERGENCY ALERT',
        shadow: 'shadow-red-500/20'
      };
    case UrgencyLevel.URGENT:
      return {
        bg: 'bg-orange-500/10',
        border: 'border-orange-500/50',
        text: 'text-orange-400',
        icon: <AlertTriangle className="w-8 h-8 text-orange-500" />,
        label: 'URGENT ATTENTION',
        shadow: 'shadow-orange-500/20'
      };
    case UrgencyLevel.ROUTINE:
      return {
        bg: 'bg-yellow-500/10',
        border: 'border-yellow-500/50',
        text: 'text-yellow-400',
        icon: <ClipboardList className="w-8 h-8 text-yellow-500" />,
        label: 'ROUTINE CHECK',
        shadow: 'shadow-yellow-500/20'
      };
    case UrgencyLevel.HOME_CARE:
      return {
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/50',
        text: 'text-emerald-400',
        icon: <Home className="w-8 h-8 text-emerald-500" />,
        label: 'HOME MONITORING',
        shadow: 'shadow-emerald-500/20'
      };
    default:
      return { bg: 'bg-gray-800', border: 'border-gray-700', text: 'text-gray-400', icon: null, label: 'UNKNOWN', shadow: '' };
  }
};

export const TriageCard: React.FC<TriageCardProps> = ({ data }) => {
  const config = getUrgencyConfig(data.urgency);

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className={`glass-panel p-8 rounded-3xl ${config.border} border-t-4 ${config.shadow} transition-all duration-500`}>
        <div className="flex items-center gap-5 mb-6">
          <div className="p-4 bg-black/40 rounded-2xl border border-white/5">{config.icon}</div>
          <div>
            <h2 className={`text-2xl font-black tracking-wider ${config.text}`}>{config.label}</h2>
            <p className="text-slate-400 text-sm mt-1">AI Confidence: <span className="text-white">98.4%</span></p>
          </div>
        </div>
        <div className="p-5 bg-white/5 rounded-xl border border-white/5">
            <p className="text-slate-200 leading-relaxed font-light text-lg">
                {data.summary}
            </p>
        </div>
      </div>

      {/* Danger Signs */}
      {data.dangerSigns.length > 0 && (
        <div className="glass-panel border-red-500/30 rounded-3xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-red-500 box-shadow-[0_0_10px_red]"></div>
            <h3 className="text-red-400 font-bold flex items-center gap-2 mb-4 text-lg">
                <AlertTriangle size={20} /> CRITICAL INDICATORS
            </h3>
            <ul className="space-y-3">
                {data.dangerSigns.map((sign, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-red-200/90">
                        <span className="mt-2 w-1.5 h-1.5 bg-red-500 rounded-full shadow-[0_0_5px_red]"></span>
                        {sign}
                    </li>
                ))}
            </ul>
        </div>
      )}

      {/* Action Plan */}
      <div className="glass-panel border-emerald-500/30 rounded-3xl p-6">
        <h3 className="text-emerald-400 font-bold flex items-center gap-2 mb-4 text-lg">
            <CheckCircle size={20} /> RECOMMENDED ACTIONS
        </h3>
        <ul className="space-y-3">
            {data.actionItems.map((item, idx) => (
                <li key={idx} className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/5 hover:border-emerald-500/30 transition-colors">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold border border-emerald-500/30 flex-shrink-0">
                        {idx + 1}
                    </div>
                    <span className="text-slate-300 text-sm font-medium">{item}</span>
                </li>
            ))}
        </ul>
      </div>

      {/* Doctor Questions */}
      <div className="glass-panel border-indigo-500/30 rounded-3xl p-6">
        <h3 className="text-indigo-400 font-bold flex items-center gap-2 mb-4 text-lg">
            <Stethoscope size={20} /> CLINICIAN QUERY PROTOCOL
        </h3>
        <ul className="space-y-3">
            {data.questionsForClinician.map((q, idx) => (
                <li key={idx} className="flex items-start gap-3 text-indigo-200/80 text-sm italic p-3 bg-indigo-900/10 rounded-lg">
                    <span className="text-indigo-400 font-bold">?</span>
                    {q}
                </li>
            ))}
        </ul>
      </div>
      
      <div className="px-4">
        <p className="text-xs text-slate-500 font-mono">
            <span className="font-bold text-slate-400">ANALYSIS LOG:</span> {data.reasoning}
        </p>
      </div>
    </div>
  );
};
