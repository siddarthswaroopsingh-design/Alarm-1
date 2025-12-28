
import React, { useState } from 'react';
import { Moon, Sun, Star, Shield, Battery } from 'lucide-react';

const BedtimeRoutine: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
       <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-6">
          <div className={`p-6 rounded-[2rem] border transition-all duration-700
            ${isEnabled ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400 animate-pulse' : 'bg-slate-900 border-slate-800 text-slate-600'}`}>
            <Moon size={40} />
          </div>
          <div>
            <h2 className="text-3xl font-orbitron font-bold text-white uppercase tracking-tighter">Stasis Protocol</h2>
            <p className="text-slate-500 text-sm italic">"Optimal rest ensures peak operational efficiency"</p>
          </div>
        </div>
        <button 
          onClick={() => setIsEnabled(!isEnabled)}
          className={`px-10 py-4 rounded-2xl font-black uppercase tracking-[0.2em] transition-all text-sm
            ${isEnabled ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-indigo-500 text-slate-950 shadow-lg shadow-indigo-500/20'}`}
        >
          {isEnabled ? 'Terminate Stasis' : 'Engage Stasis'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-8 rounded-[2.5rem] border-white/5 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-indigo-400">
               <Shield size={20} />
               <span className="text-xs font-bold uppercase tracking-widest">Sleep Hygiene Settings</span>
            </div>
          </div>
          <div className="space-y-4">
             {[
               { label: 'Blue Light Suppression', desc: 'Shift displays to amber spectrum' },
               { label: 'Focus Mode Uplink', desc: 'Silence incoming non-critical alerts' },
               { label: 'Smart Dimming', desc: 'Gradual luminosity reduction' }
             ].map((setting, i) => (
               <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/50 border border-white/5">
                 <div>
                   <div className="text-sm font-bold text-white">{setting.label}</div>
                   <div className="text-[10px] text-slate-500">{setting.desc}</div>
                 </div>
                 <div className="w-10 h-5 bg-indigo-500 rounded-full"></div>
               </div>
             ))}
          </div>
        </div>

        <div className="glass-panel p-8 rounded-[2.5rem] border-white/5 flex flex-col justify-between">
           <div>
              <div className="flex items-center gap-3 text-yellow-400 mb-6">
                <Battery size={20} />
                <span className="text-xs font-bold uppercase tracking-widest">Recharge Cycle Analytics</span>
              </div>
              <div className="space-y-4">
                 <div className="flex justify-between items-end">
                    <span className="text-sm text-slate-400">Projected Efficiency</span>
                    <span className="text-2xl font-orbitron font-bold text-white">92%</span>
                 </div>
                 <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 w-[92%]"></div>
                 </div>
                 <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="p-4 rounded-2xl bg-slate-900/50 border border-white/5">
                       <span className="text-[10px] text-slate-500 uppercase block mb-1">Target Duration</span>
                       <span className="text-lg font-bold text-white">8h 15m</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-900/50 border border-white/5">
                       <span className="text-[10px] text-slate-500 uppercase block mb-1">Optimal Exit</span>
                       <span className="text-lg font-bold text-white">07:30</span>
                    </div>
                 </div>
              </div>
           </div>
           
           <div className="mt-8 flex items-center gap-2 text-[10px] text-slate-600 font-bold uppercase">
              <Star size={12} className="text-yellow-500 animate-spin" />
              Neural patterns synchronized with lunar cycle
           </div>
        </div>
      </div>
    </div>
  );
};

export default BedtimeRoutine;
