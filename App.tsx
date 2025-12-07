
import React, { useState, useRef, useEffect, MouseEvent } from 'react';
import { HealthWrapper } from './components/HealthWrapper';
import { EducationView } from './components/EducationView';
import { AccessibilityView } from './components/AccessibilityView';
import { ScienceView } from './components/ScienceView';
import { BusinessView } from './components/BusinessView';
import { TechView } from './components/TechView';
import { DocumentationView } from './components/DocumentationView';
import { ChatBot } from './components/ChatBot';
import { 
  Heart, GraduationCap, Eye, Microscope, Briefcase, Terminal, 
  ArrowLeft, Sparkles, Hexagon, Github, Twitter, Globe, Linkedin, Cpu, Layers
} from 'lucide-react';

type ModuleType = 'HOME' | 'HEALTH' | 'EDUCATION' | 'ACCESSIBILITY' | 'SCIENCE' | 'BUSINESS' | 'TECH' | 'DOCS';

// --- PARTICLE FIELD COMPONENT ---
const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const particles: {x: number, y: number, vx: number, vy: number, size: number}[] = [];
    const particleCount = Math.min(100, (width * height) / 15000);
    const connectionDistance = 150;
    const mouseDistance = 200;

    let mouse = { x: -1000, y: -1000 };

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Update and Draw Particles
      particles.forEach((p, i) => {
        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Bounce
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Mouse Interaction (Anti-gravity/Repel)
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouseDistance) {
          const angle = Math.atan2(dy, dx);
          const force = (mouseDistance - dist) / mouseDistance;
          p.x -= Math.cos(angle) * force * 2;
          p.y -= Math.sin(angle) * force * 2;
        }

        // Draw Particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(74, 223, 255, ${0.3 + (Math.random() * 0.2)})`; // Cyan
        ctx.fill();

        // Connect Lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx2 = p.x - p2.x;
          const dy2 = p.y - p2.y;
          const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

          if (dist2 < connectionDistance) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(168, 85, 247, ${0.15 - (dist2 / connectionDistance) * 0.15})`; // Purple
            ctx.lineWidth = 1;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

      requestAnimationFrame(animate);
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: globalThis.MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none opacity-60" />;
};

function App() {
  const [module, setModule] = useState<ModuleType>('HOME');

  const renderModule = () => {
    switch (module) {
      case 'HEALTH': return <HealthWrapper />;
      case 'EDUCATION': return <EducationView />;
      case 'ACCESSIBILITY': return <AccessibilityView />;
      case 'SCIENCE': return <ScienceView />;
      case 'BUSINESS': return <BusinessView />;
      case 'TECH': return <TechView />;
      case 'DOCS': return <DocumentationView />;
      default: return <Dashboard onSelect={setModule} />;
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col font-sans text-slate-200">
      <ParticleBackground />
      <div className="absolute inset-0 grid-bg z-0 pointer-events-none" />

      {/* Futuristic Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-5 flex items-center justify-between backdrop-blur-xl bg-[#0B1120]/60 border-b border-white/5 transition-all duration-300">
        <div className="flex items-center gap-6 cursor-pointer" onClick={() => setModule('HOME')}>
          {module !== 'HOME' && (
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors text-cyan-400 animate-fade-in-up">
              <ArrowLeft size={24} />
            </button>
          )}
          <div className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <div className="absolute inset-0 bg-cyan-500 blur-md opacity-20 group-hover:opacity-50 transition-opacity rounded-full animate-pulse"></div>
              <Hexagon className="relative text-cyan-400 fill-cyan-500/10 transition-transform group-hover:rotate-180 duration-700" size={32} />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-white text-xl tracking-wide font-['Rajdhani'] uppercase">UniGem AI</span>
              <span className="text-[10px] tracking-[0.2em] text-cyan-400/80 uppercase">Multimodal Core</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex px-4 py-1.5 bg-gradient-to-r from-cyan-900/20 to-purple-900/20 rounded-full border border-cyan-500/30 items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.15)] group hover:border-cyan-400/50 transition-all">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00E6FF]"></div> 
            <span className="text-xs font-bold text-cyan-100 tracking-wider">POWERED BY GEMINI 3 PRO</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 pt-32 px-4 pb-20 container mx-auto max-w-7xl flex-grow">
        {renderModule()}
      </main>

      {/* Footer */}
      <Footer onSelect={setModule} />
      
      {/* Real-time ChatBot */}
      <ChatBot />
    </div>
  );
}

const Dashboard = ({ onSelect }: { onSelect: (m: ModuleType) => void }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    
    // Slight parallax rotation for the whole container
    containerRef.current.style.transform = `perspective(1000px) rotateY(${x * 2}deg) rotateX(${-y * 2}deg)`;
  };

  const handleMouseLeave = () => {
    if (containerRef.current) {
        containerRef.current.style.transform = `perspective(1000px) rotateY(0deg) rotateX(0deg)`;
    }
  }

  const apps = [
    { id: 'HEALTH', name: 'Health Copilot', icon: <Heart className="text-emerald-400" size={28} />, desc: 'Triage & Chronic Care', color: 'emerald' },
    { id: 'EDUCATION', name: 'Education Tutor', icon: <GraduationCap className="text-blue-400" size={28} />, desc: 'Adaptive Learning Plans', color: 'blue' },
    { id: 'ACCESSIBILITY', name: 'Accessibility', icon: <Eye className="text-purple-400" size={28} />, desc: 'Scene & Nav Assist', color: 'purple' },
    { id: 'SCIENCE', name: 'Research Lab', icon: <Microscope className="text-cyan-400" size={28} />, desc: 'Data & Literature', color: 'cyan' },
    { id: 'BUSINESS', name: 'Business Ops', icon: <Briefcase className="text-amber-400" size={28} />, desc: 'Workflow & Contracts', color: 'amber' },
    { id: 'TECH', name: 'Dev Studio', icon: <Terminal className="text-pink-400" size={28} />, desc: 'Refactor & Security', color: 'pink' },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[65vh] relative perspective-1000">
      
      {/* Cinematic Hero Section */}
      <div className="text-center mb-20 relative z-10 animate-fade-in-up">
        {/* Holographic Ring Animation behind text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none opacity-40">
            <div className="holo-ring w-full h-full animate-spin-slow border-t-cyan-500/30"></div>
            <div className="holo-ring w-[80%] h-[80%] top-[10%] left-[10%] animate-spin-slow border-b-purple-500/30" style={{animationDirection: 'reverse'}}></div>
        </div>

        <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 border border-cyan-500/20 mb-8 backdrop-blur-md hover:bg-white/10 transition-colors cursor-default">
          <Sparkles size={16} className="text-cyan-400" />
          <span className="text-xs font-bold tracking-[0.15em] text-cyan-200 uppercase">Next Gen Intelligence</span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-100 to-slate-500 mb-6 drop-shadow-[0_0_30px_rgba(74,223,255,0.2)] tracking-tight font-['Rajdhani']">
          UNIGEM AI
        </h1>
        
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-light">
          The <span className="text-cyan-300 font-normal">Gemini 3 Pro</span> powered universal copilot. 
          Seamlessly bridging multimodal reasoning across <span className="text-white">six</span> critical domains.
        </p>

        <div className="mt-10 flex gap-4 justify-center">
            <button 
                onClick={() => onSelect('HEALTH')}
                className="px-8 py-4 bg-cyan-500 text-black font-bold text-sm tracking-widest uppercase rounded-xl hover:bg-cyan-400 transition-all shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:scale-105 flex items-center gap-2"
            >
                <Cpu size={18}/> Initialize Core
            </button>
            <button 
                onClick={() => onSelect('DOCS')}
                className="px-8 py-4 bg-transparent border border-white/20 text-white font-bold text-sm tracking-widest uppercase rounded-xl hover:bg-white/5 transition-all flex items-center gap-2"
            >
                <Layers size={18}/> View Docs
            </button>
        </div>
      </div>
      
      {/* 3D Grid */}
      <div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl transition-transform duration-100 ease-out"
      >
        {apps.map((app, idx) => (
          <button
            key={app.id}
            onClick={() => onSelect(app.id as ModuleType)}
            className="group relative glass-panel p-8 rounded-[2rem] text-left overflow-hidden hover:z-10"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            {/* Inner Glow - pointer events none to allow click-through */}
            <div className={`absolute top-0 right-0 w-64 h-64 bg-${app.color}-500/10 blur-[80px] rounded-full group-hover:bg-${app.color}-500/20 transition-all duration-700 pointer-events-none`} />
            
            <div className="relative z-10 flex flex-col h-full pointer-events-none"> 
              {/* Content is pointer-events-none so click registers on button parent, or button handles bubbling */}
              <div className={`mb-6 p-4 rounded-2xl w-fit bg-gradient-to-br from-white/10 to-transparent border border-white/5 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_20px_rgba(0,0,0,0.2)]`}>
                {app.icon}
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-2 font-['Rajdhani'] tracking-wide group-hover:translate-x-1 transition-transform">
                {app.name}
              </h3>
              
              <p className="text-slate-400 text-sm font-light leading-relaxed group-hover:text-slate-200 transition-colors">
                {app.desc}
              </p>

              <div className="mt-auto pt-6 flex items-center gap-2 text-xs font-bold tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300">
                <span className={`text-${app.color}-400`}>Open Module</span>
                <ArrowLeft className="rotate-180" size={12} />
              </div>
            </div>
            
            {/* Border Glow on Hover - pointer events none */}
            <div className={`absolute inset-0 border border-${app.color}-500/0 group-hover:border-${app.color}-500/30 rounded-[2rem] transition-colors duration-500 pointer-events-none`} />
          </button>
        ))}
      </div>
    </div>
  );
};

const Footer = ({ onSelect }: { onSelect: (m: ModuleType) => void }) => {
  return (
    <footer className="relative z-20 mt-auto border-t border-white/5 bg-[#080c17]/80 backdrop-blur-md">
      <div className="container mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-white">
               <Hexagon className="text-cyan-400 fill-cyan-500/10" size={24} />
               <span className="font-bold text-lg tracking-widest uppercase font-['Rajdhani']">UniGem AI</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-500 max-w-xs">
              Next-generation multimodal intelligence interface. 
              Running on advanced Gemini 3 Pro architectures.
            </p>
            <div className="flex gap-4 opacity-60">
               <Twitter size={18} className="hover:text-cyan-400 cursor-pointer transition-colors" />
               <a href="https://github.com/Sachin0613/unigem_ai" target="_blank" rel="noopener noreferrer">
                 <Github size={18} className="hover:text-white cursor-pointer transition-colors" />
               </a>
               <a href="https://www.linkedin.com/in/sachin-yadav-631b6031a/" target="_blank" rel="noopener noreferrer">
                 <Linkedin size={18} className="hover:text-blue-400 cursor-pointer transition-colors" />
               </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6 text-xs tracking-[0.2em] uppercase text-cyan-500">Solutions</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><button onClick={() => onSelect('HEALTH')} className="hover:text-emerald-400 transition-colors flex items-center gap-2"><Heart size={16}/> Health Copilot</button></li>
              <li><button onClick={() => onSelect('EDUCATION')} className="hover:text-blue-400 transition-colors flex items-center gap-2"><GraduationCap size={16}/> Education Tutor</button></li>
              <li><button onClick={() => onSelect('ACCESSIBILITY')} className="hover:text-purple-400 transition-colors flex items-center gap-2"><Eye size={16}/> Accessibility</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6 text-xs tracking-[0.2em] uppercase text-purple-500">Enterprise</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><button onClick={() => onSelect('SCIENCE')} className="hover:text-cyan-400 transition-colors flex items-center gap-2"><Microscope size={16}/> Research Lab</button></li>
              <li><button onClick={() => onSelect('BUSINESS')} className="hover:text-amber-400 transition-colors flex items-center gap-2"><Briefcase size={16}/> Business Ops</button></li>
              <li><button onClick={() => onSelect('TECH')} className="hover:text-pink-400 transition-colors flex items-center gap-2"><Terminal size={16}/> Dev Studio</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6 text-xs tracking-[0.2em] uppercase text-slate-500">Company</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><button onClick={() => onSelect('DOCS')} className="hover:text-white transition-colors flex items-center gap-2"><Layers size={16}/> Documentation</button></li>
              <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2">Privacy</a></li>
              <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2">Legal</a></li>
            </ul>
          </div>

        </div>
        
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] text-slate-300 uppercase tracking-widest">
           <p>© 2025 UniGem AI Systems. All rights reserved.</p>
           <p className="mt-2 md:mt-0 flex items-center gap-2"><Globe size={12}/> Global Node: US-EAST-1</p>
        </div>
      </div>
    </footer>
  );
};

export default App;
