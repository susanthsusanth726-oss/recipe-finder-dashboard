import React, { useState, useEffect } from 'react';
import { X, Mic, Volume2, Sparkles } from 'lucide-react';
import { useRecipeContext } from '../context/RecipeContext';

interface VoiceSearchModalProps {
  onClose: () => void;
}

export const VoiceSearchModal: React.FC<VoiceSearchModalProps> = ({ onClose }) => {
  const { setFilter, showToast } = useRecipeContext();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  useEffect(() => {
    // Start Web Speech API if supported or simulate
    let recognition: any = null;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      try {
        recognition.start();
      } catch (e) {
        setIsListening(false);
      }
    } else {
      // Simulation for unsupported browsers
      setIsListening(true);
      const timer = setTimeout(() => {
        setTranscript('Garlic Mushroom Risotto');
        setIsListening(false);
      }, 2000);
      return () => clearTimeout(timer);
    }

    return () => {
      if (recognition) recognition.stop();
    };
  }, []);

  const handleApplyVoice = () => {
    if (transcript) {
      setFilter((prev) => ({ ...prev, searchQuery: transcript }));
      showToast(`Searching for "${transcript}" 🎙️`, 'info');
      onClose();
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-[#0B1121] border border-white/10 rounded-[32px] p-6 shadow-2xl relative space-y-6 text-center"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-16 h-16 rounded-full bg-purple-600/20 text-purple-400 border border-purple-500/40 flex items-center justify-center mx-auto">
          <Mic className={`w-8 h-8 ${isListening ? 'animate-pulse text-amber-400' : ''}`} />
        </div>

        <div>
          <h3 className="text-xl font-serif italic text-white">
            {isListening ? 'Listening for ingredients...' : 'Voice Search'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Say recipe names or ingredients (e.g. "Salmon", "Pasta", "Keto breakfast")
          </p>
        </div>

        {/* Live Transcript Display */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 min-h-[60px] flex items-center justify-center">
          <p className="text-sm font-semibold text-purple-300">
            {transcript ? `"${transcript}"` : isListening ? 'Speak now...' : 'Tap below to search'}
          </p>
        </div>

        {transcript && (
          <button
            onClick={handleApplyVoice}
            className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-950/40 border border-purple-400/30"
          >
            Apply Search Filter
          </button>
        )}
      </div>
    </div>
  );
};
