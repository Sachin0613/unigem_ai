
import React, { useState } from 'react';
import { 
  Heart, GraduationCap, Eye, Microscope, Briefcase, Terminal, 
  Shield, Book, Zap, FileText, ChevronRight, Activity, Pill, Layout
} from 'lucide-react';

export const DocumentationView: React.FC = () => {
  const [activeTab, setActiveTab] = useState('INTRO');

  const tabs = [
    { id: 'INTRO', label: 'Overview', icon: <Book size={18} /> },
    { id: 'HEALTH', label: 'Health Copilot', icon: <Heart size={18} /> },
    { id: 'EDUCATION', label: 'Education Tutor', icon: <GraduationCap size={18} /> },
    { id: 'ACCESS', label: 'Accessibility', icon: <Eye size={18} /> },
    { id: 'SCIENCE', label: 'Science Lab', icon: <Microscope size={18} /> },
    { id: 'BUSINESS', label: 'Business Ops', icon: <Briefcase size={18} /> },
    { id: 'TECH', label: 'Dev Studio', icon: <Terminal size={18} /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'HEALTH':
        return (
          <div className="space-y-8 animate-fade-in-up">
            <div className="border-b border-emerald-500/30 pb-4 mb-4">
              <h2 className="text-3xl font-bold text-emerald-400 font-['Rajdhani'] mb-2">Health Copilot</h2>
              <p className="text-emerald-100/60">Advanced triage, chronic care management, and medication analysis.</p>
            </div>
            
            <div className="grid gap-6">
              <DocSection 
                title="Acute Triage"
                icon={<Activity className="text-emerald-400" />}
                desc="Analyzes symptoms via text, voice, and visual inputs to determine urgency levels."
                features={[
                  "Detects 'Danger Signs' automatically.",
                  "Provides medical-grade questions for clinician handover.",
                  "Does NOT provide a definitive medical diagnosis (Safety Protocol)."
                ]}
              />
              <DocSection 
                title="Chronic Care"
                icon={<Layout className="text-emerald-400" />}
                desc="Longitudinal tracking for diabetes, hypertension, and other chronic conditions."
                features={[
                  "Digitizes handwritten vitals logs.",
                  "Generates daily micro-tasks (diet, exercise).",
                  "Visualizes trends over time with dynamic charts."
                ]}
              />
              <DocSection 
                title="Pharma-Scan"
                icon={<Pill className="text-emerald-400" />}
                desc="Instant prescription decoding and drug interaction checking."
                features={[
                  "Identifies pills/meds from images.",
                  "Checks for drug-drug and drug-condition interactions.",
                  "Simplifies complex dosing instructions to 5th-grade level."
                ]}
              />
            </div>
          </div>
        );
      case 'EDUCATION':
        return (
           <div className="space-y-8 animate-fade-in-up">
            <div className="border-b border-blue-500/30 pb-4 mb-4">
              <h2 className="text-3xl font-bold text-blue-400 font-['Rajdhani'] mb-2">Education Tutor</h2>
              <p className="text-blue-100/60">Adaptive learning assistant for students and educators.</p>
            </div>
             <div className="grid gap-6">
              <DocSection 
                title="Personal Tutor"
                icon={<GraduationCap className="text-blue-400" />}
                desc="Explains complex concepts using Socratic methods and generated quizzes."
                features={[
                  "Supports image-based math problem solving.",
                  "Generates follow-up quiz questions.",
                  "Links to related topics for deep diving."
                ]}
              />
               <DocSection 
                title="Study Planner"
                icon={<Book className="text-blue-400" />}
                desc="Generates detailed, time-blocked study schedules."
                features={[
                  "Breaks down goals into 5-day actionable plans.",
                  "Prioritizes topics based on difficulty.",
                  "Includes review sessions."
                ]}
              />
               <DocSection 
                title="AI Grader"
                icon={<FileText className="text-blue-400" />}
                desc="Automated grading and feedback for assignments."
                features={[
                  "Provides letter grades (A-F) based on rubrics.",
                  "Offers specific 'Feedback Sandwich' (Praise-Critique-Praise).",
                  "Highlights specific corrections in text."
                ]}
              />
            </div>
           </div>
        );
      case 'TECH':
          return (
             <div className="space-y-8 animate-fade-in-up">
              <div className="border-b border-pink-500/30 pb-4 mb-4">
                <h2 className="text-3xl font-bold text-pink-400 font-['Rajdhani'] mb-2">Dev Studio</h2>
                <p className="text-pink-100/60">Professional coding agent for modernization and security.</p>
              </div>
               <div className="grid gap-6">
                <DocSection 
                  title="Code Refactor"
                  icon={<Terminal className="text-pink-400" />}
                  desc="Modernizes legacy codebases to current standards."
                  features={[
                    "Improves type safety and readability.",
                    "Generates comprehensive unit tests.",
                    "Optimizes algorithms for performance."
                  ]}
                />
                 <DocSection 
                  title="Debug Agent"
                  icon={<Zap className="text-pink-400" />}
                  desc="Analyzes stack traces and bugs to find root causes."
                  features={[
                    "Explains the 'Why' behind the error.",
                    "Provides copy-pasteable hotfixes.",
                    "Suggests preventative measures."
                  ]}
                />
                 <DocSection 
                  title="Security Audit"
                  icon={<Shield className="text-pink-400" />}
                  desc="Scans code for OWASP vulnerabilities."
                  features={[
                    "Detects SQL Injection, XSS, and CSRF risks.",
                    "Assigns severity scores (Critical/High/Low).",
                    "Auto-patches vulnerable code blocks."
                  ]}
                />
              </div>
             </div>
          );
      case 'ACCESS':
        return (
             <div className="space-y-8 animate-fade-in-up">
              <div className="border-b border-purple-500/30 pb-4 mb-4">
                <h2 className="text-3xl font-bold text-purple-400 font-['Rajdhani'] mb-2">Accessibility</h2>
                <p className="text-purple-100/60">Vision and cognitive support tools.</p>
              </div>
              <div className="grid gap-6">
                  <DocSection title="Scene Description" icon={<Eye className="text-purple-400"/>} desc="Detailed audio-visual descriptions of the environment." features={["Identifies objects, people, and text.", "Supports follow-up questions via voice."]} />
                  <DocSection title="Navigation Assist" icon={<Layout className="text-purple-400"/>} desc="Real-time hazard detection for mobility." features={["Uses 'Clock Face' directions (e.g. Door at 12 o'clock).", "Warns of tripping hazards."]} />
                  <DocSection title="Text Simplifier" icon={<FileText className="text-purple-400"/>} desc="Converts complex documents into plain language." features={["Ideal for cognitive disabilities.", "Summarizes key action items."]} />
              </div>
             </div>
        )
      case 'SCIENCE':
          return (
             <div className="space-y-8 animate-fade-in-up">
              <div className="border-b border-cyan-500/30 pb-4 mb-4">
                <h2 className="text-3xl font-bold text-cyan-400 font-['Rajdhani'] mb-2">Science Lab</h2>
                <p className="text-cyan-100/60">Research acceleration and data extraction.</p>
              </div>
              <div className="grid gap-6">
                  <DocSection title="Literature Analysis" icon={<Microscope className="text-cyan-400"/>} desc="Summarizes papers and critiques methodology." features={["Generates novel hypotheses.", "Detects bias in research methods."]} />
                  <DocSection title="Data Digitizer" icon={<Layout className="text-cyan-400"/>} desc="Converts images of charts/tables to Markdown." features={["Extracts raw data points.", "Generates statistical insights."]} />
              </div>
             </div>
          )
      case 'BUSINESS':
          return (
             <div className="space-y-8 animate-fade-in-up">
              <div className="border-b border-amber-500/30 pb-4 mb-4">
                <h2 className="text-3xl font-bold text-amber-400 font-['Rajdhani'] mb-2">Business Ops</h2>
                <p className="text-amber-100/60">Workflow optimization and legal intelligence.</p>
              </div>
              <div className="grid gap-6">
                  <DocSection title="Workflow Ops" icon={<Briefcase className="text-amber-400"/>} desc="Identifies bottlenecks in business processes." features={["Suggests automation tools (Zapier, Python).", "Maps out efficiency gains."]} />
                  <DocSection title="Meeting Minutes" icon={<FileText className="text-amber-400"/>} desc="Transcribes and summarizes meetings." features={["Extracts Action Items with owners/deadlines.", "Summarizes key decisions."]} />
                  <DocSection title="Contract Sentinel" icon={<Shield className="text-amber-400"/>} desc="Analyzes legal documents for risk." features={["Flags dangerous clauses.", "Checks for missing standard protections."]} />
              </div>
             </div>
          )
      default:
        return (
          <div className="space-y-8 animate-fade-in-up">
             <div className="border-b border-white/10 pb-4 mb-4">
              <h2 className="text-4xl font-bold text-white font-['Rajdhani'] mb-4">Welcome to UniGem AI Docs</h2>
              <p className="text-lg text-slate-300 font-light leading-relaxed">
                UniGem AI is a universal multimodal copilot powered by the <span className="text-cyan-400 font-bold">Gemini 3</span> architecture. 
                It bridges the gap between raw AI capability and real-world utility across six critical domains.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
               <div className="glass-panel p-6 rounded-2xl border-white/5 bg-white/5">
                 <h3 className="font-bold text-cyan-300 mb-2 flex items-center gap-2"><Zap size={20}/> Core Technology</h3>
                 <p className="text-sm text-slate-400 leading-relaxed">
                   Built on Gemini 2.5 Flash for ultra-low latency response times. The system utilizes specific "Persona Prompts" (e.g., Senior Clinical Specialist, Staff Security Engineer) to ensure domain-specific accuracy.
                 </p>
               </div>
               <div className="glass-panel p-6 rounded-2xl border-white/5 bg-white/5">
                 <h3 className="font-bold text-purple-300 mb-2 flex items-center gap-2"><Shield size={20}/> Privacy & Safety</h3>
                 <p className="text-sm text-slate-400 leading-relaxed">
                   All data processing is stateless. We do not store patient data, audio recordings, or proprietary code. Users are advised to verify all critical outputs, especially in Health and Legal modules.
                 </p>
               </div>
            </div>

            <div className="glass-panel p-8 rounded-3xl border-cyan-500/20 bg-cyan-900/10 mt-8">
              <h3 className="text-xl font-bold text-white mb-4">Getting Started</h3>
              <ol className="list-decimal list-inside space-y-3 text-slate-300 text-sm">
                <li>Select a module from the dashboard (e.g., <strong className="text-emerald-400">Health</strong>).</li>
                <li>Read the <strong>Instruction Card</strong> for best practices.</li>
                <li>Use the <strong>Camera</strong> or <strong>Microphone</strong> icons to provide multimodal context.</li>
                <li>Review the AI's structured output.</li>
                <li>Use the navigation bar to switch contexts instantly.</li>
              </ol>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-[80vh] gap-6 max-w-7xl mx-auto p-4 animate-fade-in-up">
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 flex-shrink-0 glass-panel rounded-3xl p-4 overflow-y-auto h-full border-white/10">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 px-2">Documentation</h3>
        <nav className="space-y-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id 
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.1)]' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              {tab.icon}
              {tab.label}
              {activeTab === tab.id && <ChevronRight size={14} className="ml-auto" />}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow glass-panel rounded-3xl p-8 overflow-y-auto h-full border-white/10 custom-scrollbar">
        {renderContent()}
      </div>
    </div>
  );
};

const DocSection = ({ title, icon, desc, features }: { title: string, icon: React.ReactNode, desc: string, features: string[] }) => (
  <div className="p-6 bg-white/5 rounded-2xl border border-white/5 hover:border-white/20 transition-colors">
    <div className="flex items-center gap-3 mb-3">
      <div className="p-2 bg-black/40 rounded-lg">{icon}</div>
      <h3 className="font-bold text-white text-lg">{title}</h3>
    </div>
    <p className="text-slate-400 text-sm mb-4 leading-relaxed">{desc}</p>
    <ul className="space-y-2">
      {features.map((f, i) => (
        <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
          <span className="text-cyan-500 mt-0.5">›</span> {f}
        </li>
      ))}
    </ul>
  </div>
);
