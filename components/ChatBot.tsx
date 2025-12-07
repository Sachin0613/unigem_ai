
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2, Sparkles, Image as ImageIcon, Paperclip } from 'lucide-react';
import { createChatSession } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Chat } from '@google/genai';

export const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [image, setImage] = useState<string | null>(null); // Base64 image
  const [loading, setLoading] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Initialize chat session on mount
    chatSessionRef.current = createChatSession();
    // Add welcome message
    setMessages([
      {
        id: 'welcome',
        role: 'model',
        text: "Hello! I'm UniGem Assistant (Fast Mode). I can help you with Health, Science, and Code. You can also send me images!",
        timestamp: new Date()
      }
    ]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, image]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async () => {
    if ((!inputText.trim() && !image) || !chatSessionRef.current) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText,
      image: image || undefined,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setImage(null);
    setLoading(true);

    try {
      let response;
      if (userMsg.image) {
        // Multimodal Request
        const imageBase64 = userMsg.image.split(',')[1];
        response = await chatSessionRef.current.sendMessage({
          message: [
            { text: userMsg.text || "Analyze this image." },
            { inlineData: { mimeType: 'image/jpeg', data: imageBase64 } }
          ]
        });
      } else {
        // Text Only Request
        response = await chatSessionRef.current.sendMessage({ message: userMsg.text });
      }

      const modelMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response.text || "I couldn't process that. Please try again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, modelMsg]);
    } catch (error) {
      console.error("ChatBot Error:", error);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "Sorry, I encountered an error. Please check your connection or API key.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatMessage = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, i) => {
        const trimmed = line.trim();
        if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
            const cleanLine = trimmed.substring(2);
            return (
                <div key={i} className="flex items-start gap-2 mb-1 pl-1">
                    <span className="text-cyan-400 mt-1.5 text-[6px]">●</span>
                    <span className="flex-1">{parseBold(cleanLine)}</span>
                </div>
            );
        }
        if (trimmed === '') return <div key={i} className="h-2"></div>;
        return <div key={i} className="mb-0.5 leading-relaxed">{parseBold(line)}</div>;
    });
  };

  const parseBold = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={index} className="text-cyan-300 font-bold">{part.slice(2, -2)}</strong>;
        }
        return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* Chat Window - Mobile Responsive Width */}
      <div 
        className={`
          transition-all duration-300 origin-bottom-right
          ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-10 pointer-events-none'}
          mb-4 w-[90vw] md:w-[400px] h-[600px] max-h-[80vh]
          glass-panel rounded-3xl overflow-hidden shadow-2xl border-cyan-500/30 flex flex-col bg-[#0f172a]/95
        `}
      >
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-cyan-900/40 to-purple-900/40 border-b border-white/10 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="relative">
                <div className="w-2 h-2 absolute top-0 right-0 bg-emerald-500 rounded-full animate-pulse"></div>
                <Bot className="text-cyan-400" size={24} />
            </div>
            <div>
                <h3 className="font-bold text-white font-['Rajdhani'] text-lg">UniGem Assistant</h3>
                <p className="text-[10px] text-cyan-200/60 uppercase tracking-wider">Flash-Lite Fast Mode</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-black/20">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
               <div className={`flex items-start gap-3 max-w-full ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-purple-600' : 'bg-cyan-600'}`}>
                    {msg.role === 'user' ? <User size={16} /> : <Sparkles size={16} />}
                  </div>
                  <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-purple-500/20 border border-purple-500/30 text-purple-100 rounded-tr-sm' : 'bg-cyan-950/30 border border-cyan-500/10 text-slate-200 rounded-tl-sm'}`}>
                    {msg.image && (
                      <img src={msg.image} alt="Uploaded" className="max-w-full rounded-lg mb-2 border border-white/10" />
                    )}
                    {msg.text && formatMessage(msg.text)}
                  </div>
               </div>
            </div>
          ))}
          {loading && (
             <div className="flex items-center gap-2 text-slate-500 text-xs ml-12">
                 <Loader2 size={12} className="animate-spin"/> Analyzing...
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-3 bg-white/5 border-t border-white/10">
          {image && (
            <div className="relative w-fit mb-2">
              <img src={image} alt="Preview" className="h-16 rounded-lg border border-cyan-500/50" />
              <button onClick={() => setImage(null)} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"><X size={12}/></button>
            </div>
          )}
          <div className="flex gap-2 items-center">
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageSelect} className="hidden" />
            <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-3 text-cyan-400 hover:bg-cyan-500/10 rounded-xl transition-colors"
                title="Upload Image"
            >
                <Paperclip size={20} />
            </button>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Message..."
              className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
            />
            <button
              onClick={handleSend}
              disabled={loading || (!inputText.trim() && !image)}
              className="p-3 bg-cyan-600 rounded-xl text-white hover:bg-cyan-500 transition-colors disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* FAB Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-4 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all duration-300 hover:scale-110 ${isOpen ? 'bg-slate-700 text-slate-300' : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'}`}
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} fill="currentColor" />}
      </button>
    </div>
  );
};
