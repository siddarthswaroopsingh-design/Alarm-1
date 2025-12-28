
import React, { useState, useEffect, useRef } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Clock as ClockIcon, 
  AlarmClock, 
  Timer as TimerIcon, 
  History, 
  Globe, 
  Cpu, 
  Wind,
  Zap,
  Moon,
  Bell,
  X,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DigitalClock from './components/DigitalClock';
import AlarmsList from './components/AlarmsList';
import Stopwatch from './components/Stopwatch';
import CountdownTimer from './components/CountdownTimer';
import WorldClockView from './components/WorldClockView';
import Pomodoro from './components/Pomodoro';
import AIBriefing from './components/AIBriefing';
import Soundscapes from './components/Soundscapes';
import BedtimeRoutine from './components/BedtimeRoutine';
import { Alarm } from './types';
import { playInbuiltSound, decodeBase64, decodeAudioData } from './services/audioSynth';
import { getDetailedSystemStats, generateVoiceAnnouncement } from './services/geminiService';

const NavItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={`flex flex-col items-center justify-center p-3 transition-all duration-300 group
        ${isActive ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}
    >
      <div className={`p-2 rounded-xl transition-all duration-300 
        ${isActive ? 'bg-cyan-500/10 glow-border' : 'bg-transparent group-hover:bg-slate-800'}`}>
        <Icon size={24} />
      </div>
      <span className="text-[10px] mt-1 font-bold uppercase tracking-widest">{label}</span>
    </Link>
  );
};

const App: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [triggeredAlarm, setTriggeredAlarm] = useState<Alarm | null>(null);
  const [isDismissing, setIsDismissing] = useState(false);
  const [morningBriefing, setMorningBriefing] = useState<string | null>(null);
  const [isBriefingLoading, setIsBriefingLoading] = useState(false);
  const alarmIntervalRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Monitor Alarms
  useEffect(() => {
    const checkAlarms = () => {
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      const dateStr = now.toISOString().split('T')[0];
      
      const saved = localStorage.getItem('chronos_alarms');
      if (saved) {
        const alarms: Alarm[] = JSON.parse(saved);
        const alarmToTrigger = alarms.find(a => {
          if (!a.active) return false;
          if (a.time !== timeStr) return false;
          
          // If it's a date-specific alarm, check the date
          if (a.date) {
            return a.date === dateStr;
          }
          
          // Otherwise check recurring days (if days is defined)
          if (a.days && a.days.length > 0) {
            return a.days.includes(now.getDay());
          }
          
          // Fallback to time-only if neither date nor days are specific
          return true;
        });

        if (alarmToTrigger && !triggeredAlarm && !isDismissing) {
          setTriggeredAlarm(alarmToTrigger);
          if (alarmToTrigger.sound.type === 'inbuilt') {
            playInbuiltSound(alarmToTrigger.sound.id, 0.8);
            alarmIntervalRef.current = window.setInterval(() => playInbuiltSound(alarmToTrigger.sound.id, 0.8), 2000);
          } else if (alarmToTrigger.sound.url) {
            const audio = new Audio(alarmToTrigger.sound.url);
            audio.loop = true;
            audio.play().catch(e => console.error("Audio playback error:", e));
            (window as any).currentAlarmAudio = audio;
          }
        }
      }
    };

    const interval = setInterval(checkAlarms, 10000); // Check every 10s
    return () => clearInterval(interval);
  }, [triggeredAlarm, isDismissing]);

  const dismissAlarm = async () => {
    if (isDismissing) return;
    setIsDismissing(true);

    // Stop audio
    if (alarmIntervalRef.current) clearInterval(alarmIntervalRef.current);
    if ((window as any).currentAlarmAudio) {
      (window as any).currentAlarmAudio.pause();
      (window as any).currentAlarmAudio = null;
    }

    const alarmCopy = triggeredAlarm;
    
    // Deactivate if it was a one-time date-specific alarm
    if (alarmCopy?.date) {
      const saved = localStorage.getItem('chronos_alarms');
      if (saved) {
        const alarms: Alarm[] = JSON.parse(saved);
        const updated = alarms.map(a => a.id === alarmCopy.id ? { ...a, active: false } : a);
        localStorage.setItem('chronos_alarms', JSON.stringify(updated));
      }
    }

    // Subtle feedback delay for the deactivation animation
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    setTriggeredAlarm(null);
    setIsDismissing(false);

    // If alarm had AI Briefing enabled, start the morning sequence
    if (alarmCopy?.aiBriefing) {
      setIsBriefingLoading(true);
      try {
        const pos = await new Promise<GeolocationPosition>((resolve) => {
          navigator.geolocation.getCurrentPosition(resolve, () => resolve({ coords: { latitude: 0, longitude: 0 } } as any));
        });
        const stats = await getDetailedSystemStats(pos.coords.latitude, pos.coords.longitude);
        setMorningBriefing(stats);
        setIsBriefingLoading(false);
        
        const audioBase64 = await generateVoiceAnnouncement(stats);
        if (audioBase64) {
          if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
          }
          const ctx = audioContextRef.current;
          const audioBuffer = await decodeAudioData(decodeBase64(audioBase64), ctx);
          const source = ctx.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(ctx.destination);
          source.start();
        }
      } catch (err) {
        setIsBriefingLoading(false);
      }
    }
  };

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col md:flex-row bg-[#020617] text-slate-200 overflow-hidden font-mono">
        
        {/* Alarm Overlay with Framer Motion */}
        <AnimatePresence>
          {triggeredAlarm && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
              transition={{ duration: 0.8 }}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-3xl"
            >
              <div className="relative flex flex-col items-center max-w-lg w-full p-12 text-center">
                <motion.div 
                  animate={{ 
                    scale: isDismissing ? [1, 1.2, 0.9] : [1, 1.05, 1],
                    opacity: isDismissing ? [1, 1, 0] : 1
                  }}
                  className="absolute -inset-20 bg-cyan-500/20 blur-[100px] rounded-full"
                ></motion.div>
                
                <div className="relative">
                  <motion.div 
                    animate={isDismissing ? { rotate: 360, scale: 0.5 } : { y: [0, -20, 0] }}
                    transition={{ repeat: isDismissing ? 0 : Infinity, duration: 2 }}
                    className={`p-8 rounded-full bg-cyan-500/10 border-4 mb-8 shadow-[0_0_50px_rgba(34,211,238,0.3)] transition-colors duration-500
                      ${isDismissing ? 'border-green-500 bg-green-500/10' : 'border-cyan-500/50'}`}
                  >
                    {isDismissing ? (
                      <CheckCircle2 size={80} className="text-green-500" />
                    ) : (
                      <Bell size={80} className="text-cyan-400" />
                    )}
                  </motion.div>

                  <h1 className={`text-6xl font-orbitron font-black text-white mb-2 transition-all duration-500 ${isDismissing ? 'opacity-0 scale-90' : 'glow-text'}`}>
                    {triggeredAlarm.time}
                  </h1>
                  
                  <motion.p 
                    animate={isDismissing ? { opacity: 0 } : { opacity: 1 }}
                    className="text-xl font-bold text-cyan-500 uppercase tracking-[0.4em] mb-12"
                  >
                    {triggeredAlarm.label}
                  </motion.p>

                  <button 
                    onClick={dismissAlarm}
                    disabled={isDismissing}
                    className={`group relative w-full py-6 rounded-3xl font-black uppercase text-xl tracking-[0.3em] overflow-hidden transition-all active:scale-95
                      ${isDismissing ? 'bg-green-500 text-slate-950 scale-95' : 'bg-white text-slate-950 hover:scale-105'}`}
                  >
                    <span className="relative z-10">
                      {isDismissing ? 'Protocol Terminated' : 'Deactivate Protocol'}
                    </span>
                    {!isDismissing && (
                      <div className="absolute inset-0 bg-cyan-400 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    )}
                  </button>
                  
                  {isDismissing && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 text-green-500 text-[10px] font-black tracking-[0.5em] uppercase"
                    >
                      Clearing neural buffer...
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Morning Briefing Overlay */}
        <AnimatePresence>
          {(morningBriefing || isBriefingLoading) && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/95 backdrop-blur-xl p-6 overflow-y-auto"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 40 }}
                animate={{ scale: 1, y: 0 }}
                className="max-w-3xl w-full glass-panel p-10 rounded-[3rem] border-cyan-500/30 shadow-2xl"
              >
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-3xl font-orbitron font-black text-white uppercase italic">Neural Synthesis</h2>
                    <p className="text-cyan-500 text-xs font-bold tracking-widest mt-1">POST-ALARM SYSTEM REPORT</p>
                  </div>
                  {!isBriefingLoading && (
                    <button onClick={() => setMorningBriefing(null)} className="p-3 rounded-full hover:bg-white/10 transition-colors">
                      <X className="text-slate-500 hover:text-white" />
                    </button>
                  )}
                </div>

                {isBriefingLoading ? (
                  <div className="flex flex-col items-center py-20 gap-6">
                    <Cpu className="text-cyan-500 animate-spin" size={64} />
                    <p className="text-slate-400 font-mono text-sm animate-pulse tracking-widest uppercase text-center px-4">Establishing secure satellite uplink... Fetching planetary data sweep...</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="text-xl text-slate-300 leading-relaxed italic whitespace-pre-line border-l-2 border-cyan-500/50 pl-6 max-h-[50vh] overflow-y-auto no-scrollbar">
                      {morningBriefing}
                    </div>
                    <div className="pt-8 border-t border-white/5 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-[10px] text-slate-500 uppercase font-bold">Commander Briefing Complete</span>
                      </div>
                      <button 
                        onClick={() => setMorningBriefing(null)}
                        className="px-8 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white font-bold uppercase text-xs tracking-widest hover:bg-slate-800 transition-all"
                      >
                        Acknowledge
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <Cpu className="text-cyan-500 animate-pulse" size={24} />
            <h1 className="font-orbitron font-black text-xl tracking-tighter text-cyan-500">CHRONOS.AI</h1>
          </div>
          <div className="text-xs font-bold text-slate-400">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="hidden md:flex flex-col w-24 border-r border-slate-800 bg-slate-950/80 backdrop-blur-xl h-screen sticky top-0 py-8 gap-4 overflow-y-auto no-scrollbar">
          <div className="flex justify-center mb-8">
            <Cpu className="text-cyan-500 animate-pulse" size={32} />
          </div>
          <NavItem to="/" icon={ClockIcon} label="Clock" />
          <NavItem to="/alarms" icon={AlarmClock} label="Alarms" />
          <NavItem to="/timer" icon={TimerIcon} label="Timer" />
          <NavItem to="/stopwatch" icon={History} label="Laps" />
          <NavItem to="/world" icon={Globe} label="World" />
          <NavItem to="/pomodoro" icon={Zap} label="Pomo" />
          <NavItem to="/sounds" icon={Wind} label="Audio" />
          <NavItem to="/bedtime" icon={Moon} label="Sleep" />
          <div className="mt-auto">
            <NavItem to="/briefing" icon={Cpu} label="AI" />
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 relative overflow-y-auto max-h-screen pb-24 md:pb-8">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-30"></div>
          <div className="max-w-6xl mx-auto p-4 md:p-8">
            <Routes>
              <Route path="/" element={<DigitalClock />} />
              <Route path="/alarms" element={<AlarmsList />} />
              <Route path="/timer" element={<CountdownTimer />} />
              <Route path="/stopwatch" element={<Stopwatch />} />
              <Route path="/world" element={<WorldClockView />} />
              <Route path="/pomodoro" element={<Pomodoro />} />
              <Route path="/briefing" element={<AIBriefing />} />
              <Route path="/sounds" element={<Soundscapes />} />
              <Route path="/bedtime" element={<BedtimeRoutine />} />
            </Routes>
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-slate-950/90 backdrop-blur-2xl border-t border-slate-800 flex justify-around items-center px-2 z-50">
          <NavItem to="/" icon={ClockIcon} label="Time" />
          <NavItem to="/alarms" icon={AlarmClock} label="Alarms" />
          <NavItem to="/pomodoro" icon={Zap} label="Pomo" />
          <NavItem to="/briefing" icon={Cpu} label="AI" />
          <NavItem to="/sounds" icon={Wind} label="Audio" />
        </nav>
      </div>
    </HashRouter>
  );
};

export default App;
