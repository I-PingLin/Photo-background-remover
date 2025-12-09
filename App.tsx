import React, { useState } from 'react';
import Header from './components/Header';
import UploadArea from './components/UploadArea';
import EditorPanel from './components/EditorPanel';
import { Sparkles } from 'lucide-react';

const App: React.FC = () => {
  // State to hold the current working image
  const [imageState, setImageState] = useState<{
    originalUrl: string;
    base64Data: string;
    mimeType: string;
  } | null>(null);

  const handleImageSelected = (base64: string, mimeType: string, previewUrl: string) => {
    setImageState({
      base64Data: base64,
      mimeType: mimeType,
      originalUrl: previewUrl,
    });
  };

  const handleReset = () => {
    setImageState(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!imageState ? (
          // Empty State / Upload View
          <div className="max-w-3xl mx-auto flex flex-col items-center">
            <div className="text-center mb-10 space-y-4">
              <div className="inline-flex items-center justify-center p-2 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl mb-4">
                 <span className="bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
                   <Sparkles className="w-3 h-3" />
                   AI Powered
                 </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                Transform your product photos <br className="hidden md:block"/> with simple text prompts.
              </h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                Remove backgrounds, adjust lighting, or completely restyle your images using Gemini 2.5 Flash Image. Just describe what you want.
              </p>
            </div>

            <div className="w-full bg-slate-900/40 backdrop-blur-sm p-1 rounded-3xl border border-slate-800 shadow-2xl">
              <div className="bg-slate-950 rounded-[20px] p-6 sm:p-10">
                <UploadArea onImageSelected={handleImageSelected} />
                
                {/* Example Gallery / Capabilities */}
                <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 opacity-60 pointer-events-none grayscale hover:grayscale-0 transition-all">
                   <div className="aspect-square rounded-lg bg-slate-800/50 overflow-hidden relative">
                      <img src="https://picsum.photos/400/400?random=1" className="w-full h-full object-cover" alt="Example" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-2">
                        <span className="text-[10px] text-white">Remove Background</span>
                      </div>
                   </div>
                   <div className="aspect-square rounded-lg bg-slate-800/50 overflow-hidden relative">
                      <img src="https://picsum.photos/400/400?random=2" className="w-full h-full object-cover" alt="Example" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-2">
                        <span className="text-[10px] text-white">Studio Lighting</span>
                      </div>
                   </div>
                   <div className="aspect-square rounded-lg bg-slate-800/50 overflow-hidden relative">
                      <img src="https://picsum.photos/400/400?random=3" className="w-full h-full object-cover" alt="Example" />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-2">
                        <span className="text-[10px] text-white">Clean Up</span>
                      </div>
                   </div>
                   <div className="aspect-square rounded-lg bg-slate-800/50 overflow-hidden relative">
                      <img src="https://picsum.photos/400/400?random=4" className="w-full h-full object-cover" alt="Example" />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-2">
                        <span className="text-[10px] text-white">Color Correct</span>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Editor View
          <EditorPanel 
            originalImage={imageState.originalUrl}
            base64Data={imageState.base64Data}
            mimeType={imageState.mimeType}
            onReset={handleReset}
          />
        )}
      </main>

      <footer className="py-8 text-center text-slate-600 text-sm">
        <p>© {new Date().getFullYear()} ProductMagic. Powered by Google Gemini.</p>
      </footer>
    </div>
  );
};

export default App;