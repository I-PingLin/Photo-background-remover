import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Download, RefreshCcw, X, Wand2, Scissors, Eraser, Palette } from 'lucide-react';
import { editImageWithGemini } from '../services/geminiService';
import { AppStatus, QuickAction } from '../types';

interface EditorPanelProps {
  originalImage: string; // Data URI for preview
  base64Data: string;    // Raw base64 for API
  mimeType: string;
  onReset: () => void;
}

const QUICK_ACTIONS: QuickAction[] = [
  { label: 'Remove Background', prompt: 'Remove the background and leave it transparent or white.', icon: 'scissors' },
  { label: 'Studio Light', prompt: 'Place the product in a professional studio setting with soft lighting.', icon: 'wand' },
  { label: 'Clean Up', prompt: 'Remove dust, scratches, and imperfections from the product.', icon: 'eraser' },
  { label: 'Monochrome', prompt: 'Convert the image to a high-contrast black and white style.', icon: 'palette' },
];

const EditorPanel: React.FC<EditorPanelProps> = ({ originalImage, base64Data, mimeType, onReset }) => {
  const [prompt, setPrompt] = useState('');
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setStatus(AppStatus.PROCESSING);
    setError(null);
    setGeneratedImage(null);

    try {
      const result = await editImageWithGemini(base64Data, mimeType, prompt);
      setGeneratedImage(result);
      setStatus(AppStatus.SUCCESS);
    } catch (err: any) {
      setError(err.message || 'Something went wrong while generating the image.');
      setStatus(AppStatus.ERROR);
    }
  };

  const handleQuickAction = (actionPrompt: string) => {
    setPrompt(actionPrompt);
    // Optional: Auto-submit on click? 
    // Let's just fill it in to let the user confirm or edit.
    // Or auto-submit for better UX:
    // setPrompt(actionPrompt);
    // setTimeout(() => document.getElementById('generate-btn')?.click(), 0);
  };

  const getIcon = (name: string) => {
    switch (name) {
      case 'scissors': return <Scissors className="w-4 h-4" />;
      case 'wand': return <Wand2 className="w-4 h-4" />;
      case 'eraser': return <Eraser className="w-4 h-4" />;
      case 'palette': return <Palette className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Top Bar: Back & Status */}
      <div className="flex items-center justify-between">
        <button 
          onClick={onReset}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
          Change Image
        </button>
        {status === AppStatus.PROCESSING && (
           <div className="flex items-center gap-2 text-indigo-400 text-sm animate-pulse">
             <Sparkles className="w-4 h-4" />
             <span>Processing with Gemini...</span>
           </div>
        )}
      </div>

      {/* Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Original Image + Controls */}
        <div className="space-y-6">
          <div className="relative group rounded-2xl overflow-hidden border border-slate-700 bg-slate-900 aspect-square flex items-center justify-center">
            <img 
              src={originalImage} 
              alt="Original" 
              className="max-w-full max-h-full object-contain"
            />
            <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur px-2 py-1 rounded text-xs font-medium text-slate-300 border border-slate-700">
              Original
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 space-y-4">
            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-slate-300 mb-2">
                Edit Instructions
              </label>
              <div className="flex gap-2">
                <input
                  id="prompt"
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="E.g., Remove background, add a soft shadow..."
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                />
                <button
                  id="generate-btn"
                  onClick={handleGenerate}
                  disabled={status === AppStatus.PROCESSING || !prompt.trim()}
                  className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white px-6 rounded-xl font-medium transition-all flex items-center justify-center min-w-[120px]"
                >
                  {status === AppStatus.PROCESSING ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Generate
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </button>
              </div>
            </div>

            <div>
              <p className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wider">Quick Actions</p>
              <div className="flex flex-wrap gap-2">
                {QUICK_ACTIONS.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => handleQuickAction(action.prompt)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs text-slate-300 transition-colors"
                  >
                    {getIcon(action.icon)}
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
            
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400">
                Error: {error}
              </div>
            )}
          </div>
        </div>

        {/* Right: Result Area */}
        <div className="flex flex-col h-full">
           <div className={`relative flex-1 rounded-2xl overflow-hidden border border-slate-700 bg-slate-900 aspect-square flex items-center justify-center transition-all duration-500 ${status === AppStatus.SUCCESS ? 'ring-2 ring-indigo-500/50 shadow-2xl shadow-indigo-500/10' : ''}`}>
             
             {generatedImage ? (
               <img 
                 src={generatedImage} 
                 alt="Generated Result" 
                 className="max-w-full max-h-full object-contain animate-in fade-in zoom-in duration-300"
               />
             ) : (
               <div className="text-center p-8">
                 {status === AppStatus.PROCESSING ? (
                   <div className="flex flex-col items-center gap-4">
                     <div className="relative">
                       <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                       <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400 animate-pulse" />
                     </div>
                     <p className="text-slate-400 text-sm">Enhancing your image...</p>
                   </div>
                 ) : (
                   <div className="flex flex-col items-center gap-3 text-slate-600">
                     <Wand2 className="w-10 h-10 opacity-50" />
                     <p>Edited image will appear here</p>
                   </div>
                 )}
               </div>
             )}

             {generatedImage && (
               <div className="absolute top-3 left-3 bg-indigo-500/90 backdrop-blur px-2 py-1 rounded text-xs font-medium text-white shadow-lg">
                 AI Generated
               </div>
             )}
           </div>

           {/* Actions for Result */}
           {generatedImage && (
             <div className="mt-6 flex justify-end gap-3 animate-fade-in-up">
               <button 
                 onClick={() => handleGenerate()} // Re-run with same prompt
                 className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors font-medium text-sm"
               >
                 <RefreshCcw className="w-4 h-4" />
                 Regenerate
               </button>
               <a 
                 href={generatedImage} 
                 download={`edited-image-${Date.now()}.png`}
                 className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors font-medium text-sm shadow-lg shadow-indigo-900/20"
               >
                 <Download className="w-4 h-4" />
                 Download
               </a>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default EditorPanel;