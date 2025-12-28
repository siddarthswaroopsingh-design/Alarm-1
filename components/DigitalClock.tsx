
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const DigitalClock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    const h = date.getHours().toString().padStart(2, '0');
    const m = date.getMinutes().toString().padStart(2, '0');
    const s = date.getSeconds().toString().padStart(2, '0');
    return { h, m, s };
  };

  const { h, m, s } = formatTime(time);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="relative group">
        {/* Glow effect background */}
        <div className="absolute -inset-8 bg-cyan-500/10 blur-3xl opacity-50 rounded-full group-hover:opacity-100 transition-opacity"></div>
        
        {/* The Clock HUD */}
        <div className="relative glass-panel p-12 md:p-20 rounded-[3rem] border-cyan-500/30 flex flex-col items-center shadow-2xl">
          <div className="text-[10px] text-cyan-500/50 mb-4 font-bold tracking-[0.5em] uppercase">Temporal Node System v4.0.2</div>
          
          <div className="flex items-end gap-2 md:gap-4 font-orbitron font-black text-6xl md:text-9xl tracking-tight text-white glow-text">
            <span>{h}</span>
            <span className="text-cyan-500/50 animate-pulse">:</span>
            <span>{m}</span>
            <span className="text-2xl md:text-4xl text-cyan-500/60 font-mono mb-3 md:mb-6 w-12 md:w-20">{s}</span>
          </div>

          <div className="mt-8 flex gap-6 text-sm font-bold tracking-widest text-slate-400 uppercase">
            <div className="flex flex-col items-center">
              <span className="text-cyan-500">{time.toLocaleDateString('en-US', { weekday: 'long' })}</span>
              <span className="text-[10px] opacity-50">Cycle Day</span>
            </div>
            <div className="w-[1px] h-8 bg-slate-800"></div>
            <div className="flex flex-col items-center">
              <span>{time.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              <span className="text-[10px] opacity-50">Stardate</span>
            </div>
          </div>

          {/* Progress ring around the seconds */}
          <div className="absolute bottom-8 w-full px-12">
             <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-cyan-500 transition-all duration-1000 ease-linear shadow-[0_0_10px_#22d3ee]" 
                  style={{ width: `${(time.getSeconds() / 60) * 100}%` }}
                ></div>
             </div>
          </div>
        </div>
      </div>

      {/* Auxiliary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 w-full max-w-4xl">
        {[
          { label: 'Uplink', value: 'NOMINAL', color: 'text-green-500' },
          { label: 'Latency', value: '2ms', color: 'text-cyan-400' },
          { label: 'Battery', value: '88%', color: 'text-yellow-400' },
          { label: 'Memory', value: '3.2GB', color: 'text-purple-400' }
        ].map((stat, i) => (
          <div key={i} className="glass-panel p-4 rounded-2xl border-white/5 flex flex-col items-center">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">{stat.label}</span>
            <span className={`font-bold text-sm ${stat.color}`}>{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DigitalClock;
