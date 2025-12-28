
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, Zap } from 'lucide-react';

const Pomodoro: React.FC = () => {
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      handleSwitch();
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isActive, timeLeft]);

  const handleSwitch = () => {
    const nextMode = mode === 'work' ? 'break' : 'work';
    setMode(nextMode);
    setTimeLeft(nextMode === 'work' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress = (timeLeft / (mode === 'work' ? 25 * 60 : 5 * 60)) * 100;

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-12">
      <div className="flex gap-4 p-2 bg-slate-900 rounded-2xl border border-white/5">
        <button 
          onClick={() => { setMode('work'); setTimeLeft(25 * 60); setIsActive(false); }}
          className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all
            ${mode === 'work' ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20' : 'text-slate-500 hover:text-white'}`}
        >
          Work Phase
        </button>
        <button 
          onClick={() => { setMode('break'); setTimeLeft(5 * 60); setIsActive(false); }}
          className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all
            ${mode === 'break' ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20' : 'text-slate-500 hover:text-white'}`}
        >
          Recovery Phase
        </button>
      </div>

      <div className="relative">
        <div className={`absolute -inset-10 rounded-full blur-3xl opacity-20 transition-colors duration-1000
          ${mode === 'work' ? 'bg-cyan-500' : 'bg-emerald-500'}`}></div>
        <div className="relative w-80 h-80 glass-panel rounded-full border-white/10 flex flex-col items-center justify-center">
          <div className="mb-2">
            {mode === 'work' ? <Zap className="text-cyan-400 animate-pulse" size={32} /> : <Coffee className="text-emerald-400 animate-bounce" size={32} />}
          </div>
          <div className="text-7xl font-orbitron font-black text-white glow-text mb-2">
            {formatTime(timeLeft)}
          </div>
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.4em]">
            System {mode === 'work' ? 'Optimizing' : 'Cooling'}
          </div>
          
          <div className="absolute inset-0 p-4">
             <svg className="w-full h-full -rotate-90">
               <circle
                  cx="50%" cy="50%" r="48%"
                  stroke="currentColor" strokeWidth="2" fill="transparent"
                  className="text-white/5"
               />
               <circle
                  cx="50%" cy="50%" r="48%"
                  stroke="currentColor" strokeWidth="4" fill="transparent"
                  strokeDasharray="100" strokeDashoffset={100 - progress}
                  pathLength="100"
                  className={`transition-all duration-1000 ${mode === 'work' ? 'text-cyan-500' : 'text-emerald-500'}`}
               />
             </svg>
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        <button 
          onClick={() => { setTimeLeft(mode === 'work' ? 25 * 60 : 5 * 60); setIsActive(false); }}
          className="p-5 rounded-3xl bg-slate-900 border border-slate-800 text-slate-500 hover:text-white transition-all"
        >
          <RotateCcw size={28} />
        </button>
        <button 
          onClick={() => setIsActive(!isActive)}
          className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-xl
            ${isActive ? 'bg-white/10 text-white' : (mode === 'work' ? 'bg-cyan-500 text-slate-950' : 'bg-emerald-500 text-slate-950')}`}
        >
          {isActive ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
        </button>
      </div>
    </div>
  );
};

export default Pomodoro;
