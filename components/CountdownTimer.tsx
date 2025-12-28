
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Timer as TimerIcon } from 'lucide-react';

const CountdownTimer: React.FC = () => {
  const [inputMinutes, setInputMinutes] = useState(5);
  const [timeLeft, setTimeLeft] = useState(inputMinutes * 60);
  const [isActive, setIsActive] = useState(false);
  const timerRef = useRef<number | null>(null);

  const toggle = () => {
    setIsActive(!isActive);
  };

  const reset = () => {
    setIsActive(false);
    setTimeLeft(inputMinutes * 60);
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Play alert sound logic here
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  const setPreset = (mins: number) => {
    setInputMinutes(mins);
    setTimeLeft(mins * 60);
    setIsActive(false);
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return {
      m: m.toString().padStart(2, '0'),
      s: s.toString().padStart(2, '0'),
      h: h.toString().padStart(2, '0')
    };
  };

  const { m, s } = formatTime(timeLeft);
  const progress = (timeLeft / (inputMinutes * 60)) * 100;

  return (
    <div className="max-w-xl mx-auto space-y-12">
      <div className="flex flex-col items-center">
        <h2 className="text-3xl font-orbitron font-bold text-white mb-8 uppercase tracking-widest">Countdown Sequence</h2>

        <div className="relative w-72 h-72 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="144"
              cy="144"
              r="130"
              stroke="currentColor"
              strokeWidth="4"
              fill="transparent"
              className="text-slate-900"
            />
            <circle
              cx="144"
              cy="144"
              r="130"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={2 * Math.PI * 130}
              strokeDashoffset={2 * Math.PI * 130 * (1 - progress / 100)}
              className="text-cyan-500 transition-all duration-1000 ease-linear drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-6xl font-orbitron font-black text-white glow-text">
              {m}:{s}
            </div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2">Remaining Ops Time</div>
          </div>
        </div>

        <div className="flex gap-4 mt-12 w-full">
           <button 
            onClick={reset}
            className="flex-1 p-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all font-bold uppercase text-xs"
          >
            Abort
          </button>
          <button 
            onClick={toggle}
            className={`flex-[2] p-4 rounded-2xl flex items-center justify-center gap-3 transition-all font-bold uppercase text-xs tracking-[0.2em]
              ${isActive ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-cyan-500 text-slate-950'}`}
          >
            {isActive ? <><Pause size={20} /> Pause</> : <><Play size={20} /> Initialize</>}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em] text-center">Protocol Presets</h3>
        <div className="grid grid-cols-4 gap-3">
          {[1, 5, 15, 30].map(mins => (
            <button 
              key={mins}
              onClick={() => setPreset(mins)}
              className={`p-4 rounded-xl border transition-all text-sm font-bold
                ${inputMinutes === mins ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400' : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600'}`}
            >
              {mins}m
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
