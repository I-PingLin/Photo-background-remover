import React from 'react';
import { Wand2, Camera, Sparkles } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-500/20 p-2 rounded-lg">
            <Camera className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
              Product<span className="text-indigo-400">Magic</span>
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm font-medium text-slate-400">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800">
            <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
            <span>Gemini 2.5 Flash</span>
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;