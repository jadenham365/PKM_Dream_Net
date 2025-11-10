import React from 'react';
import { User } from 'lucide-react';

interface WelcomeDialogProps {
  username: string;
  onDismiss: () => void;
}

const WelcomeDialog: React.FC<WelcomeDialogProps> = ({ username, onDismiss }) => {
  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-end pb-12 bg-black/40 backdrop-blur-sm transition-all animate-in fade-in duration-500"
      onClick={onDismiss}
    >
      {/* Character Stage area */}
      <div className="w-full max-w-4xl h-[60vh] relative flex items-end justify-center gap-8 px-4 mb-[-40px] pointer-events-none">
         {/* Placeholder Characters (simulating Burnet, Fennel, etc) */}
         {/* Left Character */}
         <div className="h-4/5 aspect-[2/5] bg-gradient-to-t from-teal-600/20 to-transparent rounded-t-full flex items-end justify-center opacity-0 animate-in slide-in-from-bottom-10 duration-700 delay-100 fill-mode-forwards">
            <User size={120} strokeWidth={1} className="text-teal-700/50 mb-20" />
         </div>
         
         {/* Center Character (Main) */}
         <div className="h-full aspect-[2/5] bg-gradient-to-t from-indigo-600/20 to-transparent rounded-t-full flex items-end justify-center z-10 opacity-0 animate-in slide-in-from-bottom-10 duration-700 delay-300 fill-mode-forwards">
            <User size={140} strokeWidth={1} className="text-indigo-700/50 mb-20" />
         </div>

         {/* Right Character */}
         <div className="h-4/5 aspect-[2/5] bg-gradient-to-t from-purple-600/20 to-transparent rounded-t-full flex items-end justify-center opacity-0 animate-in slide-in-from-bottom-10 duration-700 delay-200 fill-mode-forwards">
            <User size={120} strokeWidth={1} className="text-purple-700/50 mb-20" />
         </div>
      </div>

      {/* Dialogue Box */}
      <div className="w-full max-w-3xl px-4 animate-in slide-in-from-bottom-4 duration-500 delay-500 cursor-pointer">
        <div className="relative bg-white/95 border-4 border-gray-200 rounded-2xl p-8 shadow-2xl min-h-[160px] flex flex-col justify-center">
           
           {/* Speech Triangle */}
           <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[24px] border-b-gray-200"></div>
           <div className="absolute -top-[20px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[20px] border-b-white"></div>

           <p className="font-pixel text-4xl text-gray-800 tracking-wide text-center typing-effect">
             Welcome back, <span className="text-blue-600">{username}</span>!
           </p>
           
           <div className="absolute bottom-4 right-6 animate-bounce text-gray-400">
             <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[12px] border-t-gray-400"></div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeDialog;