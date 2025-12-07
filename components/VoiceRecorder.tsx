import React, { useState, useRef } from 'react';
import { Mic, Square, Trash2 } from 'lucide-react';

interface VoiceRecorderProps {
  onRecordingComplete: (base64: string) => void;
  onClear: () => void;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onRecordingComplete, onClear }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = (reader.result as string).split(',')[1];
            onRecordingComplete(base64String);
            setHasRecording(true);
        };
        reader.readAsDataURL(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      alert("Microphone access denied.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const reset = () => {
    setHasRecording(false);
    onClear();
  };

  if (hasRecording) {
    return (
        <div className="flex items-center justify-between glass-panel border-cyan-500/30 p-4 rounded-xl mb-4 bg-cyan-950/10">
            <div className="flex items-center gap-3 text-cyan-400">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-bold tracking-wide">AUDIO DATA CAPTURED</span>
            </div>
            <button onClick={reset} className="p-2 text-slate-400 hover:text-red-400 hover:bg-white/5 rounded-full transition-all">
                <Trash2 size={18} />
            </button>
        </div>
    )
  }

  return (
    <div className="mb-4">
      <button
        type="button"
        onClick={isRecording ? stopRecording : startRecording}
        className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl transition-all border ${
          isRecording 
            ? 'bg-red-500/10 border-red-500/50 text-red-400 animate-pulse' 
            : 'glass-panel text-slate-300 hover:bg-white/5 hover:border-white/30 hover:text-white'
        }`}
      >
        {isRecording ? (
          <>
            <Square size={20} fill="currentColor" />
            <span className="font-bold tracking-wider">STOP RECORDING</span>
          </>
        ) : (
          <>
            <Mic size={20} />
            <span className="font-bold tracking-wider text-sm">RECORD VOICE NOTE</span>
          </>
        )}
      </button>
    </div>
  );
};
