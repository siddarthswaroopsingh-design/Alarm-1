
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Flag } from 'lucide-react';
import { Lap } from '../types';

const Stopwatch: React.FC = () => {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState<Lap[]>([]);
  const timerRef = useRef<number | null>(null);

  const startStop = () => {
    if (running) {
      if (timerRef.current) clearInterval(timerRef.current);
      setRunning(false);
    } else {
      setRunning(true);
      const startTime = Date.now() - time;
      timerRef.current = window.setInterval(() => {
        setTime(Date.now() - startTime);
      }, 10);
    }
  };

  const reset = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTime(0);
    setRunning(false);
    setLaps([]);
  };

  const addLap = () => {
    const lastLapTime = laps.length > 0 ? laps[0].time : 0;
    const newLap: Lap = {
      id: laps.length + 1,
      time: time,
      delta: time - lastLapTime
    };
    setLaps([newLap, ...laps]);
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);
    return {
      m: minutes.toString().padStart(2, '0'),
      s: seconds.toString().padStart(2, '0'),
      ms: milliseconds.toString().padStart(2, '0')
    };
  };

  const { m, s, ms } = formatTime(time);

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex flex-col items-center">
        <h2 className="text-3xl font-orbitron font-bold text-white mb-2 uppercase tracking-widest">Chrono Monitor</h2>
        <p className="text-slate-500 text-sm mb-8">Precision temporal measurement active</p>

        <div className="relative group mb-12">
          <div className="absolute -inset-4 bg-cyan-500/5 blur-2xl rounded-full"></div>
          <div className="relative glass-panel rounded-full w-64 h-64 md:w-80 md:h-80 border-cyan-500/20 flex flex-col items-center justify-center shadow-2xl">
            <div className="text-5xl md:text-6xl font-orbitron font-black text-white glow-text flex items-baseline">
              <span>{m}</span>
              <span className="text-cyan-500/50 text-3xl">:</span>
              <span>{s}</span>
              <span className="text-xl md:text-2xl text-cyan-500/60 ml-1 font-mono">{ms}</span>
            </div>
            <div className="mt-2 text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em]">Seconds . MS</div>
          </div>
        </div>

        <div className="flex gap-6">
          <button 
            onClick={reset}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <RotateCcw size={24} />
          </button>
          
          <button 
            onClick={startStop}
            className={`w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-xl
              ${running ? 'bg-red-500/20 text-red-400 shadow-red-500/10' : 'bg-cyan-500 text-slate-950 shadow-cyan-500/20'}`}
          >
            {running ? <Pause size={40} /> : <Play size={40} className="ml-2" />}
          </button>

          <button 
            onClick={addLap}
            disabled={!running}
            className={`p-5 rounded-2xl transition-all ${running ? 'bg-slate-900 border border-slate-800 text-cyan-400 hover:bg-slate-800' : 'bg-slate-900/50 border border-slate-800/50 text-slate-700 cursor-not-allowed'}`}
          >
            <Flag size={24} />
          </button>
        </div>
      </div>

      <div className="glass-panel rounded-3xl overflow-hidden border-white/5">
        <div className="bg-slate-900/50 p-4 border-b border-white/5 flex justify-between items-center">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Telemetry Log</span>
          <span className="text-xs font-bold text-cyan-500">{laps.length} Laps Recorded</span>
        </div>
        <div className="max-h-64 overflow-y-auto no-scrollbar">
          {laps.length === 0 ? (
            <div className="p-8 text-center text-slate-600 italic text-sm">No data in buffer...</div>
          ) : (
            laps.map((lap, idx) => {
              const formatted = formatTime(lap.time);
              const delta = formatTime(lap.delta);
              return (
                <div key={lap.id} className="p-4 flex items-center justify-between border-b border-white/5 hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-bold text-slate-600 uppercase">Lap {laps.length - idx}</span>
                    <span className="font-orbitron text-lg text-white">
                      {formatted.m}:{formatted.s}<span className="text-xs text-slate-500">.{formatted.ms}</span>
                    </span>
                  </div>
                  <span className="text-xs font-bold text-cyan-500/60 font-mono">+{delta.m}:{delta.s}.{delta.ms}</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Stopwatch;
