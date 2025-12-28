
import React, { useState, useEffect, useRef } from 'react';
import { Cpu, RefreshCw, MessageSquare, Terminal, Volume2, Mic, MapPin, Wind, Sun, Cloud, AlertTriangle } from 'lucide-react';
import { getDetailedSystemStats, generateVoiceAnnouncement } from '../services/geminiService';
import { decodeBase64, decodeAudioData } from '../services/audioSynth';

const AIBriefing: React.FC = () => {
  const [briefing, setBriefing] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [announcing, setAnnouncing] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);

  const fetchDetailedBriefing = async () => {
    setLoading(true);
    setLogs(prev => [...prev, "Initiating global data sweep...", "Establishing connection to search nodes..."]);
    
    try {
      // Get location
      const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      
      setLogs(prev => [...prev, `Coordinates locked: ${pos.coords.latitude.toFixed(2)}, ${pos.coords.longitude.toFixed(2)}`]);
      
      const response = await getDetailedSystemStats(pos.coords.latitude, pos.coords.longitude);
      setBriefing(response);
      setLogs(prev => [...prev, "Atmospheric data retrieved.", "Briefing synthesis complete."]);
    } catch (e) {
      setBriefing("Geolocation failed. Providing general planetary report.");
      const response = await getDetailedSystemStats();
      setBriefing(response);
    } finally {
      setLoading(false);
    }
  };

  const startVoiceBroadcast = async () => {
    if (!briefing || announcing) return;
    setAnnouncing(true);
    setLogs(prev => [...prev, "Generating neural voice packets..."]);
    
    try {
      const audioBase64 = await generateVoiceAnnouncement(briefing);
      if (audioBase64) {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
        const ctx = audioContextRef.current;
        const audioBuffer = await decodeAudioData(decodeBase64(audioBase64), ctx);
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        
        setLogs(prev => [...prev, "Broadcast active."]);
        source.start();
        source.onended = () => {
          setAnnouncing(false);
          setLogs(prev => [...prev, "Broadcast sequence terminated."]);
        };
      } else {
        setAnnouncing(false);
      }
    } catch (error) {
      console.error(error);
      setAnnouncing(false);
    }
  };

  useEffect(() => {
    fetchDetailedBriefing();
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-5 bg-cyan-500/10 rounded-[2rem] border border-cyan-500/30 shadow-[0_0_20px_rgba(34,211,238,0.1)]">
            <Cpu className={`text-cyan-500 ${loading ? 'animate-spin' : 'animate-pulse'}`} size={40} />
          </div>
          <div>
            <h2 className="text-3xl font-orbitron font-black text-white uppercase tracking-tighter">Atmospheric Core</h2>
            <p className="text-slate-500 text-sm font-bold tracking-widest flex items-center gap-2">
              <MapPin size={14} className="text-cyan-500" /> PLANETARY STATUS HUD
            </p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={startVoiceBroadcast}
            disabled={loading || announcing || !briefing}
            className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] transition-all
              ${announcing ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-slate-900 border border-slate-800 text-cyan-400 hover:bg-slate-800'}`}
          >
            {announcing ? <><Volume2 size={20} className="animate-bounce" /> Broadcasting...</> : <><Mic size={20} /> Voice Sync</>}
          </button>
          
          <button 
            onClick={fetchDetailedBriefing}
            disabled={loading}
            className="p-4 rounded-2xl bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/20"
          >
            <RefreshCw size={24} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          <div className="glass-panel p-10 rounded-[3rem] border-cyan-500/20 relative overflow-hidden group">
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent transition-opacity duration-1000 ${announcing ? 'opacity-100' : 'opacity-20'}`}></div>
            
            {announcing && (
              <div className="flex gap-1 h-8 mb-6 items-center">
                {[...Array(12)].map((_, i) => (
                  <div 
                    key={i} 
                    className="w-1 bg-cyan-500 rounded-full" 
                    style={{ 
                      height: `${Math.random() * 100}%`,
                      animation: `wave 0.5s ease-in-out infinite alternate ${i * 0.05}s`
                    }}
                  ></div>
                ))}
                <style>{`
                  @keyframes wave { 0% { height: 20%; } 100% { height: 100%; } }
                `}</style>
              </div>
            )}

            <div className="flex items-center gap-2 mb-6 text-cyan-500">
               <MessageSquare size={18} />
               <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Direct Neural Communication Channel</span>
            </div>
            
            {loading ? (
              <div className="space-y-6 animate-pulse">
                <div className="h-6 bg-slate-800 rounded w-3/4"></div>
                <div className="h-6 bg-slate-800 rounded w-full"></div>
                <div className="h-6 bg-slate-800 rounded w-5/6"></div>
                <div className="h-6 bg-slate-800 rounded w-2/3"></div>
              </div>
            ) : (
              <div className="text-xl md:text-2xl text-slate-200 leading-relaxed font-light whitespace-pre-line tracking-tight">
                {briefing || "Waiting for data uplink..."}
              </div>
            )}
            
            <div className="mt-12 flex justify-between items-end">
               <div className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  Search Grounding Active
               </div>
               <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Signed: CHRONOS.AI_v3.2</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="glass-panel p-6 rounded-3xl border-white/5 flex flex-col items-center">
                <Sun className="text-yellow-500 mb-2" size={24} />
                <span className="text-[10px] text-slate-500 uppercase tracking-widest mb-1 font-bold">Astro Times</span>
                <span className="text-sm font-orbitron font-bold text-white uppercase">Sunrise/Sunset</span>
             </div>
             <div className="glass-panel p-6 rounded-3xl border-white/5 flex flex-col items-center">
                <Wind className="text-cyan-400 mb-2" size={24} />
                <span className="text-[10px] text-slate-500 uppercase tracking-widest mb-1 font-bold">Atmosphere</span>
                <span className="text-sm font-orbitron font-bold text-white uppercase">Wind/AQI</span>
             </div>
             <div className="glass-panel p-6 rounded-3xl border-white/5 flex flex-col items-center">
                <Cloud className="text-indigo-400 mb-2" size={24} />
                <span className="text-[10px] text-slate-500 uppercase tracking-widest mb-1 font-bold">Activity</span>
                <span className="text-sm font-orbitron font-bold text-white uppercase">Planetary Ops</span>
             </div>
          </div>
        </div>

        {/* System Logs & Telemetry */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-[2.5rem] border-white/5 flex flex-col h-full">
             <div className="flex items-center gap-2 mb-6 text-slate-500 border-b border-white/5 pb-3">
                <Terminal size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Neural Link Logs</span>
             </div>
             <div className="flex-1 font-mono text-[10px] space-y-3 overflow-y-auto max-h-[400px] no-scrollbar">
                {logs.map((log, i) => (
                  <div key={i} className="flex gap-3 leading-tight">
                    <span className="text-cyan-500/50">[{i}]</span>
                    <span className="text-slate-400">{log}</span>
                  </div>
                ))}
                {(loading || announcing) && <div className="text-cyan-500 animate-pulse flex items-center gap-1">_ <div className="w-1 h-3 bg-cyan-500 animate-pulse"></div></div>}
             </div>
          </div>
          
          <div className="glass-panel p-6 rounded-[2rem] border-amber-500/20 bg-amber-500/5">
             <div className="flex items-center gap-2 mb-2 text-amber-500">
                <AlertTriangle size={16} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Global Watch</span>
             </div>
             <p className="text-[10px] text-slate-400 leading-tight">Environmental hazards are monitored 24/7 via synchronized satellite uplinks.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIBriefing;
