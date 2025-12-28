
import React, { useState, useEffect, useRef } from 'react';
import { Wind, Waves, Zap, Flame, CloudRain, Play, Pause, Volume2, Timer, Power } from 'lucide-react';

const sounds = [
  { id: '1', name: 'Nebula Wind', icon: Wind, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
  { id: '2', name: 'Digital Rain', icon: CloudRain, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { id: '3', name: 'Warp Drive', icon: Zap, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  { id: '4', name: 'Cyber Creek', icon: Waves, color: 'text-teal-400', bg: 'bg-teal-400/10' },
  { id: '5', name: 'Binary Fire', icon: Flame, color: 'text-orange-400', bg: 'bg-orange-400/10' }
];

const Soundscapes: React.FC = () => {
  const [playing, setPlaying] = useState<string | null>(null);
  const [volume, setVolume] = useState(50);
  const [sleepTimer, setSleepTimer] = useState<number>(0); // minutes
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);
  const intervalRef = useRef<number | null>(null);

  const toggleSound = (id: string) => {
    setPlaying(playing === id ? null : id);
  };

  const startSleepTimer = (minutes: number) => {
    setSleepTimer(minutes);
    setRemainingSeconds(minutes * 60);
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    intervalRef.current = window.setInterval(() => {
      setRemainingSeconds(prev => {
        if (prev === null || prev <= 1) {
          shutdownSystem();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const shutdownSystem = () => {
    setPlaying(null);
    setRemainingSeconds(null);
    if (intervalRef.current) clearInterval(intervalRef.current);
    // Visual "Shut down" indicator logic
    document.body.classList.add('opacity-30', 'pointer-events-none');
    setTimeout(() => {
      document.body.classList.remove('opacity-30', 'pointer-events-none');
    }, 5000);
  };

  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-orbitron font-bold text-white uppercase tracking-tighter">Sonic Environment</h2>
          <p className="text-slate-500 text-sm">Acoustic dampening and focus frequency management</p>
        </div>

        {remainingSeconds !== null && (
          <div className="glass-panel px-6 py-4 rounded-2xl border-red-500/30 flex items-center gap-4 animate-pulse">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Stasis Lockdown In</span>
              <span className="text-xl font-orbitron font-black text-white">{formatCountdown(remainingSeconds)}</span>
            </div>
            <button onClick={() => { setRemainingSeconds(null); if (intervalRef.current) clearInterval(intervalRef.current); }} className="text-slate-600 hover:text-white">
              <Power size={20} />
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sounds.map(sound => (
          <div 
            key={sound.id}
            onClick={() => toggleSound(sound.id)}
            className={`glass-panel p-10 rounded-[3rem] cursor-pointer transition-all duration-700 border-2 group
              ${playing === sound.id ? 'border-cyan-500 bg-cyan-500/5 shadow-[0_0_30px_rgba(34,211,238,0.1)]' : 'border-white/5 hover:border-white/10'}`}
          >
            <div className="flex items-center justify-between mb-8">
              <div className={`p-6 rounded-[1.5rem] transition-all duration-500 ${sound.bg} ${sound.color} ${playing === sound.id ? 'scale-110 shadow-lg' : ''}`}>
                <sound.icon size={32} />
              </div>
              <div className={`w-12 h-12 rounded-full border border-white/10 flex items-center justify-center transition-all 
                ${playing === sound.id ? 'bg-cyan-500 text-slate-950 rotate-90' : 'text-slate-600 group-hover:text-white'}`}>
                {playing === sound.id ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
              </div>
            </div>
            <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">{sound.name}</h3>
            <div className="flex items-center gap-2">
              <div className="h-1 flex-1 bg-slate-900 rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-1000 ${playing === sound.id ? 'bg-cyan-500 w-full animate-pulse' : 'bg-slate-800 w-0'}`}></div>
              </div>
              <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Active</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-panel p-8 rounded-[2.5rem] border-white/5 flex flex-col gap-6">
          <div className="flex items-center gap-4 text-cyan-400">
             <Volume2 size={24} />
             <span className="text-xs font-bold uppercase tracking-widest">Master Amplitude</span>
          </div>
          <div className="flex items-center gap-6">
            <input 
              type="range" min="0" max="100" value={volume}
              onChange={(e) => setVolume(parseInt(e.target.value))}
              className="flex-1 h-2 bg-slate-900 rounded-full appearance-none cursor-pointer accent-cyan-500"
            />
            <span className="text-3xl font-orbitron font-black text-white w-20 text-right">{volume}%</span>
          </div>
        </div>

        <div className="glass-panel p-8 rounded-[2.5rem] border-white/5 flex flex-col gap-6">
          <div className="flex items-center gap-4 text-red-400">
             <Timer size={24} />
             <span className="text-xs font-bold uppercase tracking-widest">Sleep Mood Shutdown (Stasis)</span>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[15, 30, 45, 60].map(mins => (
              <button 
                key={mins}
                onClick={() => startSleepTimer(mins)}
                className={`py-3 rounded-2xl border font-orbitron font-bold transition-all
                  ${sleepTimer === mins && remainingSeconds !== null ? 'border-red-500 bg-red-500/10 text-red-400' : 'border-slate-800 text-slate-500 hover:border-slate-600 hover:text-white'}`}
              >
                {mins}M
              </button>
            ))}
          </div>
          <p className="text-[10px] text-slate-600 italic">Automatically terminates all neural audio channels upon cycle completion.</p>
        </div>
      </div>
    </div>
  );
};

export default Soundscapes;
